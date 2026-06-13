import "dotenv/config";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export async function seedAdminUser() {
  const email = process.env.DEV_EMAIL;
  const name = process.env.DEV_NAME;
  const password = process.env.DEV_PASSWORD;
  const username = process.env.DEV_USERNAME;

  if (!email || !name || !password || !username) {
    throw new Error(
      "Missing required env vars: DEV_EMAIL, DEV_NAME, DEV_PASSWORD, DEV_USERNAME",
    );
  }

  // Check if the admin user already exists
  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    console.log(`Admin user already exists: ${email}`);
    return;
  }

  // Create the user via the server-side API (no session required)
  const newUser = await auth.api.signUpEmail({
    body: {
      email,
      name,
      password,
      username,
      displayUsername: username,
      phoneNumber: "0812345678",
    },
  });

  if (!newUser?.user?.id) {
    throw new Error("Failed to create admin user");
  }

  // setRole requires an authenticated admin session so it can't be used in a
  // seed script. Directly update the role via Prisma instead.
  await prisma.user.update({
    where: { id: newUser.user.id },
    data: { role: "admin" },
  });

  console.log(`Admin user seeded successfully: ${email}`);
}

seedAdminUser();
