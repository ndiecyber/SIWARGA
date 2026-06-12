import "dotenv/config";
import { auth } from "@/lib/auth";

async function createAdminAccountFirst() {
  const result = await auth.api.signUpEmail({
    body: {
      name: "Admin RT 04",
      email: "admin@gmail.com",
      password: "admin1234",
    },
  });

  console.log("Admin berhasil dibuat:");
  console.log(result.user);
}

createAdminAccountFirst()
  .catch((error) => {
    console.error("Gagal membuat admin:");
    console.error(error);
    process.exit(1);
  });