/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals = [...(config.externals || []), 'encoding', 'bufferutil', 'utf-8-validate'];
    return config;
  },
};

module.exports = nextConfig;