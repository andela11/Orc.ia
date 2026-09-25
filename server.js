/**
 * Root entry point fallback for hosting providers (Render, Heroku, Railway).
 * Directs execution to the compiled production bundle in dist/server.cjs.
 */
import('./dist/server.cjs');
