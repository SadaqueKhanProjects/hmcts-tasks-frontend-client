import path from 'path';
import nunjucks from 'nunjucks';
import { Express } from 'express';

export class Nunjucks {
  constructor(private readonly isDev: boolean) { }

  enableFor(app: Express): void {
    const viewsDir = path.join(__dirname, '..', 'views');

    // node_modules roots
    const nodeModules = path.join(process.cwd(), 'node_modules');
    const govukRoot = path.join(nodeModules, 'govuk-frontend'); // <-- new
    const govukDir = path.join(govukRoot, 'govuk');
    const govukComponents = path.join(govukDir, 'components');

    app.set('view engine', 'njk');
    app.set('views', viewsDir);

    const loaders: nunjucks.ILoader[] = [
      // Load "govuk/template.njk" as govuk-frontend/govuk/template.njk
      new nunjucks.FileSystemLoader(govukRoot, { noCache: this.isDev }),      // <-- key fix
      // Load "govuk/components/*"
      new nunjucks.FileSystemLoader(govukComponents, { noCache: this.isDev }),
      new nunjucks.FileSystemLoader(govukDir, { noCache: this.isDev }),
      // Fallback to node_modules (allows "govuk-frontend/..." absolute paths)
      new nunjucks.FileSystemLoader(nodeModules, { noCache: this.isDev }),
      // Your app views
      new nunjucks.FileSystemLoader(viewsDir, { noCache: this.isDev }),
      // Optional: your overrides (if you have any)
      new nunjucks.FileSystemLoader(path.join(viewsDir, 'app-govuk-overrides'), { noCache: this.isDev }),
    ];

    const env = new nunjucks.Environment(loaders, {
      autoescape: true,
      noCache: this.isDev,
      throwOnUndefined: false,
      watch: this.isDev,
    });

    env.addGlobal('serviceName', 'HMCTS Tasks');
    env.express(app);
  }
}