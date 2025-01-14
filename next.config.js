/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,
  trailingSlash: true,

  webpack: (config) => {
    config.externals = [
      ...(config.externals || []),
      'encoding',
      'bufferutil',
      'utf-8-validate'
    ];
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
      {
        source: '/nft-rewards',
        destination: '/nft-rewards/page',
      },
      {
        source: '/faq',
        destination: '/faq/page',
      },
    ];
  },

  async redirects() {
    return [
      {
        source: '/dashboard/page',
        destination: '/dashboard',
        permanent: true,
      },
      {
        source: '/staking/page',
        destination: '/staking',
        permanent: true,
      },
      {
        source: '/referral/page',
        destination: '/referral',
        permanent: true,
      },
      {
        source: '/nft-rewards/page',
        destination: '/nft-rewards',
        permanent: true,
      },
      {
        source: '/faq/page',
        destination: '/faq',
        permanent: true,
      },
    ];
  },

  images: {
    domains: ['*'],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn', 'info'],
    } : false,
  }
};

module.exports = nextConfig;