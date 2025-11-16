import { withSentryConfig } from '@sentry/nextjs';
import type { NextConfig } from 'next';

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https://image.tmdb.org",
      "font-src 'self'",
      "connect-src 'self' https://api.themoviedb.org https://api.myanimelist.net https://*.sentry.io",
      "frame-src https://vidlink.pro",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/t/p/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

// Only wrap with Sentry in production and when Sentry DSN is configured
const shouldEnableSentry =
  process.env.NODE_ENV === 'production' && !!process.env.NEXT_PUBLIC_SENTRY_DSN;

export default shouldEnableSentry
  ? withSentryConfig(nextConfig, {
      // Suppress Sentry CLI logs during build
      silent: true,
      // Use tunnel to avoid ad blockers
      tunnelRoute: '/monitoring',
    })
  : nextConfig;
