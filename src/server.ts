import { AngularNodeAppEngine, createNodeRequestHandler, isMainModule, writeResponseToNodeResponse } from '@angular/ssr/node';
import { json } from 'body-parser';
import { eq } from 'drizzle-orm';
import express from 'express';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { getDbConnection } from '../db/index';
import { fromCSV, prettifyDate } from '../db/prettify-date';
import { logbookTable, LogbookTableCreate, LogbookTableRead, LogbookTableUpdate } from '../db/schema';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
app.use(json());
const angularApp = new AngularNodeAppEngine();
const db = getDbConnection();

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

app.post('/api/import', async (req, res) => {
    let { f: filename } = req.body as { f: string };

    const matches = /from_csv-\d{4}_\d{2}_\d{2}\.json/g.exec(filename);
    const invalid = matches === null;

    const fullPath = `./src/import/entries/${filename}`;
    const missing = !existsSync(fullPath);
    if (invalid || missing) {
        res.status(400).send(invalid ? 'Invalid filename' : 'File not found');
        return;
    }

    const entries = JSON.parse(readFileSync(fullPath, { encoding: 'utf8' })) as readonly LogbookTableRead[];
    for (const entry of entries) {
        entry.startDate = fromCSV(entry.startDate);
        entry.endDate = fromCSV(entry.endDate);
        entry.createdAt = fromCSV(entry.createdAt);
        entry.updatedAt = fromCSV(entry.updatedAt);

        console.log(await db.insert(logbookTable).values(entry).run());
    }

    res.status(201).send();
});

app.get('/api/logbook', async (req, res) => {
    const data: readonly LogbookTableRead[] = (await db.select().from(logbookTable).all()).sort(
        (a, b) => Date.parse(b.startDate) - Date.parse(a.startDate)
    );

    // TO-DO: Add validation with Zod

    res.json(data);
});

app.post('/api/logbook/create', async (req, res) => {
    const payload = req.body as LogbookTableCreate;

    // TO-DO: Add validation with Zod

    payload.startDate = prettifyDate(payload.startDate);
    payload.endDate = prettifyDate(payload.endDate);

    console.log(await db.insert(logbookTable).values(payload).run());

    res.status(201).send();
});

app.put('/api/logbook/edit', async (req, res) => {
    const payload = req.body as LogbookTableUpdate;

    // TO-DO: Add validation with Zod

    payload.startDate = prettifyDate(payload.startDate);
    payload.endDate = prettifyDate(payload.endDate);
    payload.updatedAt = prettifyDate(new Date());

    if (payload.id != undefined) console.log(await db.update(logbookTable).set(payload).where(eq(logbookTable.id, payload.id)));

    res.status(200).send();
});

app.delete('/api/logbook/delete/:id', async (req, res) => {
    console.log(await db.delete(logbookTable).where(eq(logbookTable.id, Number(req.params['id']))));

    res.status(200).send();
});

/**
 * Serve static files from /browser
 */
app.use(
    express.static(browserDistFolder, {
        maxAge: '1y',
        index: false,
        redirect: false
    })
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
    angularApp
        .handle(req)
        .then(response => (response ? writeResponseToNodeResponse(response, res) : next()))
        .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
    const port = process.env['PORT'] || 4000;
    app.listen(port, error => {
        if (error) {
            throw error;
        }

        console.log(`Node Express server listening on http://localhost:${port}`);
    });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
