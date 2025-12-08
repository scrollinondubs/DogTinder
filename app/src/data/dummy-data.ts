export interface Dog {
  id: string;
  name: string;
  age: number;
  breed: string;
  gender: "Male" | "Female";
  description: string;
  imageUrl: string;
  shelter: Shelter;
  status: "available" | "pending" | "adopted";
}

export interface Shelter {
  id: string;
  name: string;
  address: string;
  distance: string;
  imageUrl: string;
}

export interface Message {
  id: string;
  content: string;
  timestamp: string;
  isFromUser: boolean;
}

export interface Conversation {
  id: string;
  shelter: Shelter;
  dog: Dog;
  messages: Message[];
  lastMessageTime: string;
  unreadCount: number;
}

export interface Appointment {
  id: string;
  dog: Dog;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  userName: string;
}

// Shelters
export const shelters: Shelter[] = [
  {
    id: "1",
    name: "Happy Paws Shelter",
    address: "123 Pet Street, City, ST 12345",
    distance: "2.3 mi",
    imageUrl: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=100&h=100&fit=crop",
  },
  {
    id: "2",
    name: "City Animal Rescue",
    address: "456 Rescue Lane, Town, ST 67890",
    distance: "4.1 mi",
    imageUrl: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=100&h=100&fit=crop",
  },
  {
    id: "3",
    name: "Second Chance Shelter",
    address: "789 Hope Ave, Village, ST 11223",
    distance: "5.8 mi",
    imageUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=100&h=100&fit=crop",
  },
];

// Dogs
export const dogs: Dog[] = [
  {
    id: "1",
    name: "Max",
    age: 3,
    breed: "Golden Retriever",
    gender: "Male",
    description: "Max is a friendly and playful Golden Retriever who loves kids and other dogs. He's fully vaccinated, neutered, and ready for his forever home!",
    imageUrl: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&h=800&fit=crop",
    shelter: shelters[0],
    status: "available",
  },
  {
    id: "2",
    name: "Bella",
    age: 2,
    breed: "Labrador Mix",
    gender: "Female",
    description: "Bella is a sweet and gentle soul who loves cuddles and long walks. She's great with children and other pets. Already spayed and up to date on shots.",
    imageUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=800&fit=crop",
    shelter: shelters[1],
    status: "available",
  },
  {
    id: "3",
    name: "Rocky",
    age: 5,
    breed: "German Shepherd",
    gender: "Male",
    description: "Rocky is a loyal and protective companion. He's trained, loves to play fetch, and is looking for an active family. Great with older kids.",
    imageUrl: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=600&h=800&fit=crop",
    shelter: shelters[2],
    status: "available",
  },
  {
    id: "4",
    name: "Luna",
    age: 1,
    breed: "Husky",
    gender: "Female",
    description: "Luna is an energetic young Husky who loves to run and play. She needs an active owner who can keep up with her adventurous spirit!",
    imageUrl: "https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=600&h=800&fit=crop",
    shelter: shelters[0],
    status: "available",
  },
  {
    id: "5",
    name: "Charlie",
    age: 4,
    breed: "Beagle",
    gender: "Male",
    description: "Charlie is a curious and friendly Beagle with an excellent nose! He loves sniffing adventures and makes friends everywhere he goes.",
    imageUrl: "https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=600&h=800&fit=crop",
    shelter: shelters[1],
    status: "available",
  },
];

// Liked Dogs (for favorites page)
export const likedDogs: Dog[] = [dogs[0], dogs[1], dogs[2]];

// Conversations
export const conversations: Conversation[] = [
  {
    id: "1",
    shelter: shelters[0],
    dog: dogs[0],
    messages: [
      {
        id: "1",
        content: "Hi! Thanks for your interest in Max. He's such a sweet boy!",
        timestamp: "10:30 AM",
        isFromUser: false,
      },
      {
        id: "2",
        content: "Hi! I'd love to learn more about him. Is he good with cats?",
        timestamp: "10:32 AM",
        isFromUser: true,
      },
      {
        id: "3",
        content: "Yes! Max has lived with cats before and gets along great with them. He's very gentle and calm around smaller animals.",
        timestamp: "10:35 AM",
        isFromUser: false,
      },
      {
        id: "4",
        content: "That's wonderful! I just booked an appointment to meet him.",
        timestamp: "10:38 AM",
        isFromUser: true,
      },
      {
        id: "5",
        content: "Great! We look forward to seeing you. Max will be so excited!",
        timestamp: "10:40 AM",
        isFromUser: false,
      },
    ],
    lastMessageTime: "10:40 AM",
    unreadCount: 0,
  },
  {
    id: "2",
    shelter: shelters[1],
    dog: dogs[1],
    messages: [
      {
        id: "1",
        content: "Hello! I saw Bella's profile and she looks lovely!",
        timestamp: "Yesterday",
        isFromUser: true,
      },
      {
        id: "2",
        content: "She really is! Would you like to schedule a visit?",
        timestamp: "Yesterday",
        isFromUser: false,
      },
    ],
    lastMessageTime: "Yesterday",
    unreadCount: 1,
  },
];

// Appointments (for shelter dashboard)
export const appointments: Appointment[] = [
  {
    id: "1",
    dog: dogs[0],
    date: "Today",
    time: "2:00 PM",
    status: "confirmed",
    userName: "Emily Johnson",
  },
  {
    id: "2",
    dog: dogs[1],
    date: "Tomorrow",
    time: "10:00 AM",
    status: "pending",
    userName: "Mike Chen",
  },
  {
    id: "3",
    dog: dogs[0],
    date: "Nov 25",
    time: "3:30 PM",
    status: "pending",
    userName: "Sarah Williams",
  },
];

// User appointments
export const userAppointments: Appointment[] = [
  {
    id: "1",
    dog: dogs[0],
    date: "Nov 22, 2025",
    time: "10:30 AM",
    status: "confirmed",
    userName: "You",
  },
];

// Shelter stats (for dashboard)
export const shelterStats = {
  totalDogs: 24,
  totalAppointments: 12,
  unreadMessages: 5,
};
