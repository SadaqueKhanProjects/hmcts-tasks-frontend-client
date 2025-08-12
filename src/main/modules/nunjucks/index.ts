import path from 'path';
import nunjucks from 'nunjucks';
import { Express } from 'express';

export class Nunjucks {
  constructor(private readonly isDev: boolean) { }

  enableFor(app: Express): void {
    app.set('view engine', 'njk');

    const viewsDir = path.join(__dirname, '..', 'views');
    const govukRoot = path.join(process.cwd(), 'node_modules', 'govuk-frontend');
    const govukDir = path.join(govukRoot, 'govuk');                // e.g. node_modules/govuk-frontend/govuk
    const govukComponents = path.join(govukDir, 'components');     // e.g. .../govuk/components

    const loaders: nunjucks.ILoader[] = [
      // Your app views
      new nunjucks.FileSystemLoader(viewsDir, { noCache: this.isDev }),
      new nunjucks.FileSystemLoader(path.join(viewsDir, 'govuk'), { noCache: this.isDev }),

      // GOV.UK component and root folders
      new nunjucks.FileSystemLoader(govukComponents, { noCache: this.isDev }),
      new nunjucks.FileSystemLoader(govukDir, { noCache: this.isDev }),

      // (Optional) allow absolute imports starting with node_modules/
      new nunjucks.FileSystemLoader(path.join(process.cwd(), 'node_modules'), { noCache: this.isDev }),
    ];

    const env = new nunjucks.Environment(loaders, {
      autoescape: true,
      noCache: this.isDev,
      throwOnUndefined: false,
    });

    env.express(app);
  }
}