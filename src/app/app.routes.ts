import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./data-table/data-table').then(m => m.DataTable)
    },
    {
        path: 'create',
        loadComponent: () => import('./crud-form/crud-form').then(m => m.CrudForm)
    },
    {
        path: 'edit/:id',
        loadComponent: () => import('./crud-form/crud-form').then(m => m.CrudForm)
    },
    {
        path: '**',
        redirectTo: ''
    }
];
