module.exports = {
  apps: [
    {
      name: "siwarga-app",
      script: ".next/standalone/server.js", // ✅ harus dari standalone
      cwd: "/var/www/SIWARGA",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        // Ensure PM2 passes down your auth variables
        BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
        BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
        DATABASE_URL: process.env.DATABASE_URL,
      },
    },
  ],
};
