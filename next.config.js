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
              // Default security policy
              "default-src 'self'",
              
              // Scripts security policy
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' chrome-extension: https://*.walletconnect.com https://*.walletlink.org https://*.coinbase.com",
              
              // Styles security policy
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              
              // Fonts security policy
              "font-src 'self' data: https://fonts.gstatic.com",
              
              // Images security policy
              "img-src 'self' data: https: blob:",
              
              // Connection security policy
              "connect-src 'self' https://*.walletconnect.org wss://*.walletconnect.org https://*.walletconnect.com https://rpc.zora.energy https://explorer-api.walletconnect.com https://verify.walletconnect.org wss://*.walletlink.org wss://relay.walletconnect.com wss://www.walletlink.org/rpc chrome-extension: https://*.coinbase.com",
              
              // Frames security policy
              "frame-src 'self' https://*.walletconnect.org https://*.walletconnect.com https://verify.walletconnect.org chrome-extension: https://*.coinbase.com",
              
              // Workers security policy
              "worker-src 'self' 'unsafe-inline' blob:",
              
              // Other security policies
              "manifest-src 'self'",
              "media-src 'self'",
              "child-src 'self' blob: https://*.walletconnect.com https://*.coinbase.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'self'",
              "upgrade-insecure-requests"
            ].join('; ')
          },
          // Additional security headers
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

  // Experimental features
  experimental: {
    optimizeCss: true,
    // Modern builds optimization
    modern: true,
    // Increase build performance
    workerThreads: true,
    // Enable new features
    scrollRestoration: true,
  },

  // Production optimization
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

module.exports = nextConfig;