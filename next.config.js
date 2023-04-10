/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  presets: ["next/babel"],
  transpilePackages: [
    "@mui/material",
    "@mui/x-data-grid",
    "@fullcalendar/react",
    "@fullcalendar/daygrid",
  ],
};

module.exports = nextConfig;
