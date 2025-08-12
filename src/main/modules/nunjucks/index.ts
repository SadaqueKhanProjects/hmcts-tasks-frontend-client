// src/main/modules/nunjucks/index.ts
import path from 'path';
import nunjucks from 'nunjucks';
import type express from 'express';

export class Nunjucks {
  private readonly isDev: boolean;

  constructor(isDev: boolean) {
    this.isDev = isDev;
  }

  enableFor(app: express.Application) {
    // App views
    const viewsPath = path.join(__dirname, '..', '..', 'views');

    // GOV.UK Frontend (v4.x) locations
    const govukRoot = path.join(__dirname, '..', '..', '..', 'node_modules', 'govuk-frontend');
    const govukPath = path.join(govukRoot, 'govuk');
    const govukComponentsPath = path.join(govukPath, 'components');

    // Configure Nunjucks with all search paths so macros/templates always resolve
    const env = nunjucks.configure(
      [viewsPath, govukComponentsPath, govukPath, govukRoot],
      {
        autoescape: true,
        express: app,
        watch: this.isDev,
        noCache: this.isDev,
      }
    );

    // Use .njk
    app.set('view engine', 'njk');

    return env;
  }
}