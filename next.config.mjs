/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["bcrypt"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "placehold.co", pathname: "/**" },
    ],
  },
};

export default nextConfig;