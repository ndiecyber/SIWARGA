import { betterAuth } from "better-auth";
import { admin as adminPlugin, username } from "better-auth/plugins";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  plugins: [username(), adminPlugin()],
});
