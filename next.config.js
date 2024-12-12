/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals = [...(config.externals || []), 'encoding', 'bufferutil', 'utf-8-validate'];
    return config;
  },
  transpilePackages: ['@rainbow-me/rainbowkit'],
  async rewrites() {
    return [
      {
        source: '/dashboard',
        destination: '/dashboard/page',
      },
      {
        source: '/staking',
        destination: '/staking/page',
      },
      {
        source: '/referral',
        destination: '/referral/page',
      },
    ];
  },
};

module.exports = nextConfig;