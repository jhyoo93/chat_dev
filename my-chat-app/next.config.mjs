/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (isServer) {
      import('./pages/api/socket').then(module => module.default);
    }
    return config;
  },
};

export default nextConfig;
