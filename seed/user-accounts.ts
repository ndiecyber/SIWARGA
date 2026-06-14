import "dotenv/config";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export async function seedUser() {
  const email = "user@example.com";
  const name = "User";
  const password = "password1234";
  const phoneNumber = "0822345678";
  const username = phoneNumber;

  // Check if the user already exists
  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    console.log(`User already exists: ${email}`);
    return;
  }

  // Create the user via the server-side API (no session required)
  const newUser = await auth.api.signUpEmail({
    body: {
      name: name,
      email: email,
      password: password,
      username: username,
      displayUsername: name,
      phoneNumber: phoneNumber,
    },
  });

  if (!newUser?.user?.id) {
    throw new Error("Failed to create user");
  }

  console.log(`User seeded successfully: ${email}`);
}

seedUser();
