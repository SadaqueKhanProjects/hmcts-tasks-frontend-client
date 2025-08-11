// src/main/app.ts
import 'dotenv/config';
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

// Trust proxy if running behind one
app.set('trust proxy', true);

// View engine (Nunjucks with GOV.UK paths)
new Nunjucks(developmentMode).enableFor(app);

// Static assets (webpack outputs here)
app.use(express.static(path.join(__dirname, 'public')));

// Common middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, max-age=0, must-revalidate, no-store');
  next();
});

// Auto‑register routes from src/main/routes
glob
  .sync(path.join(__dirname, 'routes', '**/*.+(ts|js)'))
  .map(filename => require(filename))
  .forEach(route => route.default(app));

// Webpack/dev helpers
setupDev(app, developmentMode);

// 404 catch‑all (render our error page)
app.use((_req, res) => {
  res.status(404);
  res.render('error.njk', { message: 'Not found' });
});

// Error handler (must have 4 args)
app.use((err: HTTPError, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  // eslint-disable-next-line no-console
  console.error(err);
  res.status(err.status || 500);
  res.render('error.njk', {
    message: err.message || 'Something went wrong',
    error: developmentMode ? err : undefined,
  });
});