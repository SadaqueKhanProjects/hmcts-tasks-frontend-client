// src/main/modules/nunjucks/index.ts
import type { Application } from 'express';
import nunjucks from 'nunjucks';
import path from 'path';

export class Nunjucks {
  constructor(private readonly isDev: boolean) { }

  enableFor(app: Application): void {
    // All the places Nunjucks should look for templates/macros
    const viewPaths = [
      // compiled/ts-node path
      path.resolve(__dirname, '..', 'views'),
      // source path (helps when running via ts-node)
      path.resolve(process.cwd(), 'src', 'main', 'views'),
      // GOV.UK macros (e.g. govuk-frontend/govuk/components/.../macro.njk)
      path.resolve(process.cwd(), 'node_modules', 'govuk-frontend'),
    ];

    // Tell Express about all view paths
    app.set('views', viewPaths);
    app.set('view engine', 'njk');

    const env = nunjucks.configure(viewPaths, {
      autoescape: true,
      noCache: this.isDev,
      watch: this.isDev,
      express: app,
    });

    // Handy globals for templates
    env.addGlobal('serviceName', process.env.SERVICE_NAME || 'HMCTS Tasks');
    env.addGlobal('ENV', process.env.NODE_ENV || 'development');
  }
}