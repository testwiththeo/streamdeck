// This file configures the Sentry SDK for the server-side code.
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 0.1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Capture only errors and unhandled exceptions
  beforeSend(event) {
    // Don't send events in development
    if (process.env.NODE_ENV === 'development') {
      return null;
    }
    return event;
  },

  // Filter out noise
  ignoreErrors: [
    // Network errors
    'Failed to fetch',
    'NetworkError',
    'Load failed',
    // User-initiated navigation
    'AbortError',
    // Resize observer noise
    'ResizeObserver loop',
  ],
});
