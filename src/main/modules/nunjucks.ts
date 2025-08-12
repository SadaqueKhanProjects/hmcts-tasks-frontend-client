// src/main/modules/nunjucks.ts
import * as path from 'path';
import nunjucks from 'nunjucks';
import { Application } from 'express';

export class Nunjucks {
    constructor(private isDev: boolean) { }

    enableFor(app: Application): void {
        // Add multiple search paths for Nunjucks templates, including GOV.UK components
        const paths = [
            path.join(__dirname, '../views'),
            path.join(__dirname, '../../node_modules/govuk-frontend'),
            path.join(__dirname, '../../node_modules/govuk-frontend/govuk'),
            path.join(__dirname, '../../node_modules/govuk-frontend/govuk/components')
        ];

        const env = nunjucks.configure(paths, {
            autoescape: true,
            express: app,
            watch: this.isDev,
            noCache: this.isDev
        });

        // Allow referencing macros without worrying about path issues
        app.set('view engine', 'njk');

        env.addGlobal('assetPath', '/assets');
    }
}