import path from 'path';
import nunjucks from 'nunjucks';
import type { Application } from 'express';

export class Nunjucks {
  constructor(private readonly isDev: boolean) { }

  enableFor(app: Application): void {
    // Directories Nunjucks should search for templates
    const viewPaths = [
      // Your app templates (src/main/views)
      path.resolve(__dirname, '..', '..', 'views'),

      // GOV.UK Frontend templates so `{% extends "govuk/template.njk" %}` works
      path.resolve(process.cwd(), 'node_modules', 'govuk-frontend'),
    ];

    app.set('view engine', 'njk');
    app.set('views', viewPaths);

    // Configure Nunjucks for Express (no unused local var)
    nunjucks.configure(viewPaths, {
      autoescape: true,
      watch: this.isDev,
      noCache: this.isDev,
      express: app,
    });
  }
}