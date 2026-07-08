/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Uploads são gravados no filesystem local (ver src/lib/storage).
  // Aumentamos o limite do body das Server Actions para permitir uploads.
  experimental: {
    serverActions: {
      bodySizeLimit: "25mb",
    },
  },
};

export default nextConfig;
