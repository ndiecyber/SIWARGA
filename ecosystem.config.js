"use strict";

const os = import("os");

module.exports = {
  apps: [
    {
      // ── Identity ──────────────────────────────────────────
      name: "siwarga-app",
      script: "server.js", // Next.js standalone entry point
      cwd: "/var/www/SIWARGA/standalone",

      // ── Cluster mode ─────────────────────────────────────
      // 'max' uses every logical CPU core.
      // On a shared VPS with 2 vCPUs, set instances: 2 explicitly to avoid
      // over-scheduling (adjust to your VPS size).
      exec_mode: "cluster",
      instances: "2",

      // ── Runtime environment ───────────────────────────────
      // The .env file inside the standalone folder is read by server.js
      // automatically; we also set critical vars here as a safety net.
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "127.0.0.1", // Only accept connections from Nginx
      },

      // ── Auto-restart behaviour ────────────────────────────
      watch: false, // NEVER watch in production — pm2 will
      // restart on every file extraction
      autorestart: true,
      max_restarts: 10, // Stop thrashing after 10 rapid restarts
      min_uptime: "10s", // A restart counts only if up ≥ 10 s
      restart_delay: 4000, // Wait 4 s between restart attempts (ms)

      // ── Memory guard ─────────────────────────────────────
      // Restart a worker that exceeds 512 MB RSS.
      // Tune upward for image-heavy or large-session workloads.
      max_memory_restart: "512M",

      // ── Graceful shutdown ─────────────────────────────────
      kill_timeout: 5000, // Give the app 5 s to drain connections
      listen_timeout: 8000, // Wait 8 s for cluster worker to become ready
      shutdown_with_message: true, // Sends 'shutdown' message before SIGINT

      // ── Logging ───────────────────────────────────────────
      // Rotate with pm2-logrotate (see installation note below)
      out_file: "/var/log/pm2/siwarga-out.log",
      error_file: "/var/log/pm2/siwarga-error.log",
      merge_logs: true, // All instances write to one log file
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",

      // ── Crash-loop protection ─────────────────────────────
      // If the app crashes more than max_restarts within 5 minutes,
      // PM2 stops trying and marks it as "errored". Alert via pm2 monit.
      exp_backoff_restart_delay: 100, // Start with 100 ms, doubles each time
    },
  ],
};
