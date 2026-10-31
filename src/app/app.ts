import { Component } from '@angular/core';
import { Topbar } from './topbar/topbar';

@Component({
    selector: 'app-root',
    styleUrl: './app.css',
    templateUrl: './app.html',
    imports: [Topbar]
})
export class App {}
