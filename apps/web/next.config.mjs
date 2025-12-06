/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@prepsutra/database", "@prepsutra/types"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
