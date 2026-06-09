module.exports = {
  apps: [
    {
      name: "siwarga-app",
      script: "pnpm",
      args: "start",
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
