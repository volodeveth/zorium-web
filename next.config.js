/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
      encoding: false,
      bufferutil: false,
      'utf-8-validate': false,
      'pino-pretty': false
    };
    return config;
  },
};

module.exports = nextConfig;