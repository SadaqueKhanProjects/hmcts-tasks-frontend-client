// src/main/app.ts
import 'dotenv/config'; // Load .env before anything else
import * as path from 'path';

import { HTTPError } from './HttpError';
import { Nunjucks } from './modules/nunjucks';

import * as bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import { glob } from 'glob';

const { setupDev } = require('./development');

const env = process.env.NODE_ENV || 'development';
const developmentMode = env === 'development';

export const app = express();
app.locals.ENV = env;

// Trust proxy (useful behind reverse proxies / dev tools)
app.set('trust proxy', true);

// Nunjucks (kept as per scaffold)
new Nunjucks(developmentMode).enableFor(app);

// Static + common middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, max-age=0, must-revalidate, no-store');
  next();
});

// Auto‑register routes from src/main/routes (works in ts-node and compiled JS)
glob
  .sync(path.join(__dirname, 'routes', '**/*.+(ts|js)'))
  .map(filename => require(filename))
  .forEach(route => route.default(app));

// Dev helpers (webpack etc.)
setupDev(app, developmentMode);

// 404 for unmatched routes (optional but helpful)
app.use((req, res) => {
  res.status(404);
  res.render('error', { message: 'Not Found', error: developmentMode ? {} : undefined });
});

// Error handler (must have 4 args for Express to recognise it)
app.use((err: HTTPError, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  // eslint-disable-next-line no-console
  console.error(err);
  res.locals.message = err.message;
  res.locals.error = developmentMode ? err : {};
  res.status(err.status || 500);
  res.render('error');
});