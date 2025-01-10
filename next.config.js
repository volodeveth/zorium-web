// next.config.js
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
      {
        source: '/nft-rewards',
        destination: '/nft-rewards/page',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' chrome-extension: https://*.walletconnect.com https://*.walletlink.org https://*.coinbase.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' data: https://fonts.gstatic.com",
              "img-src 'self' data: https: blob:",
              "connect-src 'self' https://*.walletconnect.org wss://*.walletconnect.org https://*.walletconnect.com https://rpc.zora.energy https://explorer-api.walletconnect.com https://verify.walletconnect.org wss://*.walletlink.org wss://relay.walletconnect.com wss://www.walletlink.org/rpc chrome-extension: https://*.coinbase.com",
              "frame-src 'self' https://*.walletconnect.org https://*.walletconnect.com https://verify.walletconnect.org chrome-extension: https://*.coinbase.com",
              "worker-src 'self' 'unsafe-inline' blob:",
              "manifest-src 'self'",
              "media-src 'self'",
              "child-src 'self' blob: https://*.walletconnect.com https://*.coinbase.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'self'",
              "upgrade-insecure-requests"
            ].join('; ')
          }
        ]
      }
    ];
  },
  experimental: {
    optimizeCss: true,
  },
  poweredByHeader: false,
};

module.exports = nextConfig;