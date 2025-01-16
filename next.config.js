/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,

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

  // Прибираємо всі rewrites і redirects
  trailingSlash: true,
  
  images: {
    domains: ['*'],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
  },

  experimental: {
    scrollRestoration: true,
  }
};

module.exports = nextConfig;