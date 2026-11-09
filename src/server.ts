import { AngularNodeAppEngine, createNodeRequestHandler, isMainModule, writeResponseToNodeResponse } from '@angular/ssr/node';
import { json } from 'body-parser';
import { eq } from 'drizzle-orm';
import express from 'express';
import { join } from 'node:path';
import { getDbConnection } from '../db/index';
import { prettifyDate } from '../db/prettify-date';
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

app.get('/api/logbook', async (req, res) => {
    const data: readonly LogbookTableRead[] = await db.select().from(logbookTable).all();

    // TO-DO: Add validation with Zod

    res.json(data);
});

app.post('/api/logbook/create', async (req, res) => {
    const payload = req.body as LogbookTableCreate;

    // TO-DO: Add validation with Zod

    payload.startDate = prettifyDate(payload.startDate);
    payload.endDate = prettifyDate(payload.endDate);

    console.log(await db.insert(logbookTable).values(payload).run());

    res.sendStatus(201);
});

app.put('/api/logbook/edit', async (req, res) => {
    const payload = req.body as LogbookTableUpdate;

    // TO-DO: Add validation with Zod

    if (payload.id != undefined) console.log(await db.update(logbookTable).set(payload).where(eq(logbookTable.id, payload.id)));

    res.sendStatus(200);
});

app.delete('/api/logbook/:id', async (req, res) => {
    res.sendStatus(200);
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
