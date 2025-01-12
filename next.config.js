/** @type {import('next').NextConfig} */
const nextConfig = {
  // Basic configuration
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,

  // External packages configuration
  webpack: (config) => {
    config.externals = [
      ...(config.externals || []),
      'encoding',
      'bufferutil',
      'utf-8-validate'
    ];
    return config;
  },
  
  // Required for RainbowKit
  transpilePackages: ['@rainbow-me/rainbowkit'],

  // URL rewrites configuration
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

  // Security headers configuration
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // Розширюємо script-src для підтримки всіх необхідних джерел
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' 'wasm-unsafe-eval' chrome-extension: https://*.walletconnect.com https://*.walletlink.org https://*.coinbase.com https://vercel.live https://*.vercel.app",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' data: https://fonts.gstatic.com",
              "img-src 'self' data: https: blob:",
              // Розширюємо connect-src для підтримки всіх з'єднань
              "connect-src 'self' https: wss: data: blob: https://*.walletconnect.org wss://*.walletconnect.org https://*.walletconnect.com https://rpc.zora.energy https://explorer-api.walletconnect.com https://verify.walletconnect.org wss://*.walletlink.org wss://relay.walletconnect.com wss://www.walletlink.org/rpc chrome-extension: https://*.coinbase.com https://vercel.live",
              "frame-src 'self' https://*.walletconnect.org https://*.walletconnect.com https://verify.walletconnect.org chrome-extension: https://*.coinbase.com",
              "worker-src 'self' 'unsafe-inline' blob:",
              "manifest-src 'self'",
              "media-src 'self'",
              "child-src 'self' blob: https://*.walletconnect.com https://*.coinbase.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'self'",
            ].join('; ')
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
          }
        ]
      }
    ];
  },

  // Production optimization
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn', 'info'],
    } : false,
  }
};

module.exports = nextConfig;