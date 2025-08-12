import * as path from 'path';
import { Application } from 'express';
import nunjucks from 'nunjucks';

export class Nunjucks {
  constructor(private developmentMode: boolean) { }

  enableFor(app: Application): void {
    const viewsDir = path.join(__dirname, '..', '..', 'views');
    const govukDir = path.join(process.cwd(), 'node_modules', 'govuk-frontend');

    app.set('view engine', 'njk');

    nunjucks.configure([viewsDir, govukDir], {
      autoescape: true,
      express: app,
      noCache: this.developmentMode,
      watch: this.developmentMode,
    });
  }
}