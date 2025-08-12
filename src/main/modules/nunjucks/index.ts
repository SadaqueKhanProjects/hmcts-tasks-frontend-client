import path from 'path';
import nunjucks from 'nunjucks';
import { Express } from 'express';

export class Nunjucks {
  constructor(private readonly isDev: boolean) { }

  enableFor(app: Express): void {
    const viewsDir = path.join(__dirname, '..', 'views');
    const nodeModules = path.join(process.cwd(), 'node_modules');
    const govukRoot = path.join(nodeModules, 'govuk-frontend');
    const govukDir = path.join(govukRoot, 'govuk');
    const govukComponents = path.join(govukDir, 'components');

    // Make sure Express knows where your app views live
    app.set('view engine', 'njk');
    app.set('views', viewsDir);

    const loaders: nunjucks.ILoader[] = [
      // Your app views (e.g. layout.njk, error.njk, task pages)
      new nunjucks.FileSystemLoader(viewsDir, { noCache: this.isDev }),
      // Optional: if you have local overrides in views/govuk/*
      new nunjucks.FileSystemLoader(path.join(viewsDir, 'govuk'), { noCache: this.isDev }),

      // GOV.UK Frontend macros – support both import styles:
      // 1) {% from "govuk-frontend/govuk/components/button/macro.njk" %}
      new nunjucks.FileSystemLoader(nodeModules, { noCache: this.isDev }),
      // 2) {% from "govuk/components/button/macro.njk" %}
      new nunjucks.FileSystemLoader(govukComponents, { noCache: this.isDev }),
      new nunjucks.FileSystemLoader(govukDir, { noCache: this.isDev }),
    ];

    const env = new nunjucks.Environment(loaders, {
      autoescape: true,
      noCache: this.isDev,
      throwOnUndefined: false,
      watch: this.isDev,
    });

    // Example globals (handy in layouts)
    env.addGlobal('serviceName', 'HMCTS Tasks');

    env.express(app);
  }
}