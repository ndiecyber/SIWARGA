module.exports = {
  apps: [
    {
      name: "siwarga-app",
      script: ".next/standalone/server.js", // ✅ harus dari standalone
      cwd: "/var/www/SIWARGA",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
