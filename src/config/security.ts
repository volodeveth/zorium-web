// src/config/security.ts
export const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self' 'unsafe-inline' 'unsafe-eval' https: data: blob:",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' https: chrome-extension: blob:",
      "style-src 'self' 'unsafe-inline' https:",
      "img-src 'self' data: https: blob: ipfs:",
      "font-src 'self' data: https:",
      "connect-src 'self' https: wss: data: blob:",
      "frame-src 'self' https: chrome-extension:",
      "worker-src 'self' 'unsafe-inline' blob:",
      "child-src 'self' blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
      "upgrade-insecure-requests",
      "block-all-mixed-content"
    ].join('; ')
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
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
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains'
  }
];

export const cspConfig = {
  chainId: process.env.NEXT_PUBLIC_CHAIN_ID || '1',
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '',
};