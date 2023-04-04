/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  presets: ["next/babel"],
  transpilePackages: [
    "@mui/material",
    "@fullcalendar/react",
    "@fullcalendar/daygrid",
  ],
};

module.exports = nextConfig;
