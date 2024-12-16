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
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https: blob:",
              "connect-src 'self' https://*.walletconnect.org wss://*.walletconnect.org https://*.walletconnect.com https://rpc.zora.energy https://explorer-api.walletconnect.com https://verify.walletconnect.org",
              "frame-src 'self' https://*.walletconnect.org https://*.walletconnect.com https://verify.walletconnect.org",
              "worker-src 'self' blob:",
              "manifest-src 'self'",
              "media-src 'self'",
            ].join('; ')
          }
        ]
      }
    ];
  },
};

module.exports = nextConfig;