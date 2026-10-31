import { Component } from '@angular/core';
import { Topbar } from './topbar/topbar';
import { DataTable } from './data-table/data-table';

@Component({
    selector: 'app-root',
    styleUrl: './app.css',
    templateUrl: './app.html',
    imports: [Topbar, DataTable]
})
export class App {}
