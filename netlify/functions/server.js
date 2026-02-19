/**
 * Netlify serverless function - wraps the Express app for Netlify Functions.
 * All requests are forwarded here and handled by the full Express app (pages, API, static).
 */

import serverless from 'serverless-http';
import { app } from '../../server.js';

export const handler = serverless(app);
