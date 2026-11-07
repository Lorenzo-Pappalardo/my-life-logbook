import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
    {
        path: '',
        renderMode: RenderMode.Server
    },
    {
        path: 'create',
        renderMode: RenderMode.Server
    },
    {
        path: 'edit/:id',
        renderMode: RenderMode.Server
    },
    {
        path: '**',
        renderMode: RenderMode.Server
    }
];
