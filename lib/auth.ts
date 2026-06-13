import { betterAuth } from "better-auth";
import { admin as adminPlugin } from "better-auth/plugins";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  plugins: [adminPlugin()],
});
