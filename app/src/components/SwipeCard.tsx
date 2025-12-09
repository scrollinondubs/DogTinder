"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useAnimation,
  PanInfo,
} from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Configuration constants
const SWIPE_THRESHOLD = 100; // pixels to trigger swipe
const ROTATION_RANGE = 20; // max rotation degrees

interface Dog {
  id: string;
  name: string;
  age: number;
  breed: string;
  gender: "Male" | "Female";
  description: string;
  imageUrl: string;
  shelter: {
    id: string;
    name: string;
    address: string;
    distance: string;
    imageUrl: string;
  };
  status: "available" | "pending" | "adopted";
}

interface SwipeCardProps {
  dog: Dog;
  onSwipe: (direction: "left" | "right") => void;
  active: boolean;
}

export interface SwipeCardHandle {
  swipe: (direction: "left" | "right") => void;
}

export const SwipeCard = forwardRef<SwipeCardHandle, SwipeCardProps>(
  function SwipeCard({ dog, onSwipe, active }, ref) {
    const controls = useAnimation();
    const router = useRouter();
    const isDragging = useRef(false);
    const dragStartX = useRef(0);

    // Guard against undefined dog prop
    if (!dog || !dog.shelter) {
      return null;
    }

    // Motion values for real-time tracking
    const x = useMotionValue(0);

    // Derive rotation from x position (-20deg to +20deg)
    const rotate = useTransform(
      x,
      [-200, 0, 200],
      [-ROTATION_RANGE, 0, ROTATION_RANGE]
    );

    // Derive overlay opacity based on drag direction
    const likeOpacity = useTransform(x, [0, SWIPE_THRESHOLD], [0, 1]);
    const nopeOpacity = useTransform(x, [-SWIPE_THRESHOLD, 0], [1, 0]);

    // Expose imperative swipe method for button triggers
    useImperativeHandle(ref, () => ({
      swipe: async (direction: "left" | "right") => {
        const exitX = direction === "right" ? 1000 : -1000;
        await controls.start({
          x: exitX,
          rotate: direction === "right" ? ROTATION_RANGE : -ROTATION_RANGE,
          opacity: 0,
          transition: { duration: 0.3 },
        });
        onSwipe(direction);
      },
    }));

    const handleDragStart = () => {
      isDragging.current = true;
      dragStartX.current = x.get();
    };

    const handleDragEnd = async (
      _event: MouseEvent | TouchEvent | PointerEvent,
      info: PanInfo
    ) => {
      const { offset } = info;

      // Mark as not dragging after a short delay to prevent click from firing
      setTimeout(() => {
        isDragging.current = false;
      }, 100);

      if (offset.x > SWIPE_THRESHOLD) {
        // Swiped right - Like
        await controls.start({
          x: 1000,
          rotate: ROTATION_RANGE,
          opacity: 0,
          transition: { duration: 0.3 },
        });
        onSwipe("right");
      } else if (offset.x < -SWIPE_THRESHOLD) {
        // Swiped left - Nope
        await controls.start({
          x: -1000,
          rotate: -ROTATION_RANGE,
          opacity: 0,
          transition: { duration: 0.3 },
        });
        onSwipe("left");
      }
      // If within threshold, card snaps back automatically via dragConstraints
    };

    // Handle click to navigate - only if not dragging
    const handleCardClick = () => {
      if (!isDragging.current && active) {
        router.push(`/dog/${dog.id}`);
      }
    };

    return (
      <motion.div
        className={`absolute inset-x-0 top-0 ${active ? "z-10" : "z-0"}`}
        style={{
          x,
          rotate,
          touchAction: "none", // Prevents scroll interference on mobile
        }}
        drag={active ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        animate={controls}
        initial={{ scale: active ? 1 : 0.95, y: active ? 0 : 10 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* LIKE Overlay */}
        <motion.div
          className="absolute top-8 left-8 z-10 border-4 border-green-500 rounded-lg px-4 py-2 rotate-[-20deg] pointer-events-none"
          style={{ opacity: likeOpacity }}
        >
          <span className="text-green-500 text-3xl font-bold">LIKE</span>
        </motion.div>

        {/* NOPE Overlay */}
        <motion.div
          className="absolute top-8 right-8 z-10 border-4 border-red-400 rounded-lg px-4 py-2 rotate-[20deg] pointer-events-none"
          style={{ opacity: nopeOpacity }}
        >
          <span className="text-red-400 text-3xl font-bold">NOPE</span>
        </motion.div>

        {/* Card Content */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-lg cursor-pointer" onClick={handleCardClick}>
          {/* Image */}
          <div className="relative w-full aspect-[3/4] bg-[#E8D5C4]">
            <Image
              src={dog.imageUrl}
              alt={dog.name}
              fill
              className="object-cover pointer-events-none"
              sizes="(max-width: 430px) 100vw, 430px"
              priority={active}
              draggable={false}
            />
            {/* Dog icon placeholder */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <DogIcon className="w-20 h-20 text-[#C4A98A] opacity-40" />
            </div>
          </div>

          {/* Info */}
          <div className="p-4">
            <h3 className="text-2xl font-bold text-gray-800">
              {dog.name}, {dog.age} yrs
            </h3>
            <p className="text-gray-600 font-medium">{dog.breed}</p>
            <p className="text-gray-400 text-sm mt-1">
              {dog.shelter.name} &bull; {dog.shelter.distance}
            </p>
            <p className="text-gray-500 text-sm mt-2 line-clamp-2">
              {dog.description.split(".")[0]}.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }
);

function DogIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="currentColor" className={className}>
      <circle cx="24" cy="20" r="4" />
      <circle cx="40" cy="20" r="4" />
      <ellipse cx="32" cy="38" rx="12" ry="10" />
      <circle cx="28" cy="36" r="2" fill="white" />
      <circle cx="36" cy="36" r="2" fill="white" />
      <ellipse cx="32" cy="42" rx="3" ry="2" />
    </svg>
  );
}
