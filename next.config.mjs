/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.hakifi.xyz",
        pathname: "/**",
      },
    ],
  },
  output: "standalone",
};

export default nextConfig;
