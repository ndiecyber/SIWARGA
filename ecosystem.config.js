module.exports = {
  apps: [
    {
      name: "siwarga-app",
      script: ".next/standalone/server.js",
      interpreter: "node",
      cwd: "/var/www/SIWARGA",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
