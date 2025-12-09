import { db } from "./index";
import { users, shelters, dogs, dogImages, likes, conversations, messages } from "./schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("Seeding database...");

  // Clear existing data
  await db.delete(messages);
  await db.delete(conversations);
  await db.delete(likes);
  await db.delete(dogImages);
  await db.delete(dogs);
  await db.delete(shelters);
  await db.delete(users);

  // Create test users
  const hashedPassword = await bcrypt.hash("password123", 10);

  const [user1] = await db.insert(users).values({
    email: "alex@example.com",
    password: hashedPassword,
    name: "Alex Johnson",
    role: "USER",
  }).returning();

  const [shelterAdmin] = await db.insert(users).values({
    email: "admin@happypaws.com",
    password: hashedPassword,
    name: "Sarah Smith",
    role: "SHELTER_ADMIN",
  }).returning();

  console.log("Created users:", user1.email, shelterAdmin.email);

  // Create shelters
  const [shelter1] = await db.insert(shelters).values({
    name: "Happy Paws Shelter",
    address: "123 Pet Street",
    city: "San Francisco",
    state: "CA",
    zipCode: "94102",
    phone: "(415) 555-0123",
    email: "info@happypaws.com",
    description: "A loving no-kill shelter dedicated to finding forever homes for dogs.",
    imageUrl: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=100&h=100&fit=crop",
  }).returning();

  const [shelter2] = await db.insert(shelters).values({
    name: "City Animal Rescue",
    address: "456 Rescue Lane",
    city: "Oakland",
    state: "CA",
    zipCode: "94607",
    phone: "(510) 555-0456",
    email: "adopt@cityanimalrescue.org",
    description: "Rescuing and rehoming animals since 2005.",
    imageUrl: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=100&h=100&fit=crop",
  }).returning();

  const [shelter3] = await db.insert(shelters).values({
    name: "Second Chance Shelter",
    address: "789 Hope Ave",
    city: "Berkeley",
    state: "CA",
    zipCode: "94704",
    phone: "(510) 555-0789",
    email: "hello@secondchance.org",
    description: "Every dog deserves a second chance at happiness.",
    imageUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=100&h=100&fit=crop",
  }).returning();

  console.log("Created shelters:", shelter1.name, shelter2.name, shelter3.name);

  // Link shelter admin to their shelter
  await db.update(users)
    .set({ shelterId: shelter1.id })
    .where(eq(users.id, shelterAdmin.id));
  console.log("Linked shelter admin to Happy Paws Shelter");

  // Create dogs
  const dogsData = [
    {
      shelterId: shelter1.id,
      name: "Max",
      breed: "Golden Retriever",
      age: 3,
      gender: "Male" as const,
      size: "Large" as const,
      description: "Max is a friendly and playful Golden Retriever who loves kids and other dogs. He's fully vaccinated, neutered, and ready for his forever home!",
      status: "available" as const,
    },
    {
      shelterId: shelter2.id,
      name: "Bella",
      breed: "Labrador Mix",
      age: 2,
      gender: "Female" as const,
      size: "Medium" as const,
      description: "Bella is a sweet and gentle soul who loves cuddles and long walks. She's great with children and other pets. Already spayed and up to date on shots.",
      status: "available" as const,
    },
    {
      shelterId: shelter3.id,
      name: "Rocky",
      breed: "German Shepherd",
      age: 5,
      gender: "Male" as const,
      size: "Large" as const,
      description: "Rocky is a loyal and protective companion. He's trained, loves to play fetch, and is looking for an active family. Great with older kids.",
      status: "available" as const,
    },
    {
      shelterId: shelter1.id,
      name: "Luna",
      breed: "Husky",
      age: 1,
      gender: "Female" as const,
      size: "Medium" as const,
      description: "Luna is an energetic young Husky who loves to run and play. She needs an active owner who can keep up with her adventurous spirit!",
      status: "available" as const,
    },
    {
      shelterId: shelter2.id,
      name: "Charlie",
      breed: "Beagle",
      age: 4,
      gender: "Male" as const,
      size: "Small" as const,
      description: "Charlie is a curious and friendly Beagle with an excellent nose! He loves sniffing adventures and makes friends everywhere he goes.",
      status: "available" as const,
    },
  ];

  const insertedDogs = await db.insert(dogs).values(dogsData).returning();
  console.log("Created dogs:", insertedDogs.map(d => d.name).join(", "));

  // Create dog images
  const dogImageUrls = [
    "https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=600&h=800&fit=crop",
  ];

  for (let i = 0; i < insertedDogs.length; i++) {
    await db.insert(dogImages).values({
      dogId: insertedDogs[i].id,
      url: dogImageUrls[i],
      isPrimary: true,
    });
  }
  console.log("Created dog images");

  // Create some likes for the test user
  await db.insert(likes).values([
    { userId: user1.id, dogId: insertedDogs[0].id, liked: true },
    { userId: user1.id, dogId: insertedDogs[1].id, liked: true },
    { userId: user1.id, dogId: insertedDogs[2].id, liked: true },
  ]);
  console.log("Created likes");

  // Create a conversation
  const [conversation] = await db.insert(conversations).values({
    userId: user1.id,
    shelterId: shelter1.id,
    dogId: insertedDogs[0].id,
  }).returning();

  // Create messages
  await db.insert(messages).values([
    {
      conversationId: conversation.id,
      senderId: shelter1.id,
      senderType: "shelter",
      content: "Hi! Thanks for your interest in Max. He's such a sweet boy!",
    },
    {
      conversationId: conversation.id,
      senderId: user1.id,
      senderType: "user",
      content: "Hi! I'd love to learn more about him. Is he good with cats?",
    },
    {
      conversationId: conversation.id,
      senderId: shelter1.id,
      senderType: "shelter",
      content: "Yes! Max has lived with cats before and gets along great with them. He's very gentle and calm around smaller animals.",
    },
    {
      conversationId: conversation.id,
      senderId: user1.id,
      senderType: "user",
      content: "That's wonderful! I just booked an appointment to meet him.",
    },
    {
      conversationId: conversation.id,
      senderId: shelter1.id,
      senderType: "shelter",
      content: "Great! We look forward to seeing you. Max will be so excited!",
    },
  ]);
  console.log("Created conversation and messages");

  console.log("\nDatabase seeded successfully!");
  console.log("\nTest accounts:");
  console.log("  User: alex@example.com / password123");
  console.log("  Shelter Admin: admin@happypaws.com / password123");
}

seed()
  .catch((error) => {
    console.error("Seed error:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
