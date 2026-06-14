import "dotenv/config";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export async function seedAdmin() {
  const email = process.env.DEV_EMAIL;
  const name = process.env.DEV_NAME;
  const password = process.env.DEV_PASSWORD;
  const username = process.env.DEV_USERNAME;
  const phoneNumber = process.env.DEV_PHONE_NUMBER;

  if (!email || !name || !password || !username || !phoneNumber) {
    throw new Error(
      "Missing required env vars: DEV_EMAIL, DEV_NAME, DEV_PASSWORD, DEV_USERNAME",
    );
  }

  // Check if the admin already exists
  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    console.log(`Admin already exists: ${email}`);
    return;
  }

  // Create the user via the server-side API
  const newUser = await auth.api.signUpEmail({
    body: {
      name: name,
      email: email,
      password: password,
      username: username,
      displayUsername: username,
      phoneNumber: phoneNumber,
    },
  });

  if (!newUser?.user?.id) {
    throw new Error("Failed to create admin");
  }

  // setRole requires an authenticated admin session so it can't be used in a
  // seed script. Directly update the role via Prisma instead.
  await prisma.user.update({
    where: { id: newUser.user.id },
    data: { role: "admin" },
  });

  console.log(`Admin seeded successfully: ${email}`);
}

seedAdmin();
