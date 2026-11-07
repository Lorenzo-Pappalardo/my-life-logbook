import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
    {
        path: '',
        renderMode: RenderMode.Prerender
    },
    {
        path: 'create',
        renderMode: RenderMode.Prerender
    },
    {
        path: 'edit/:id',
        renderMode: RenderMode.Prerender
    },
    {
        path: '**',
        renderMode: RenderMode.Prerender
    }
];
