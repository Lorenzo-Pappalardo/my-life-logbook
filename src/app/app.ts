import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Topbar } from './topbar/topbar';

@Component({
    selector: 'app-root',
    styleUrl: './app.css',
    templateUrl: './app.html',
    imports: [Topbar, RouterOutlet]
})
export class App {}
