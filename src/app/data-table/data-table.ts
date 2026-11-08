import { Component, inject, OnInit, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LogbookTableRead } from '../../../db/schema';
import { Db } from '../db';
import { ImpactPipe } from '../impact-pipe';

@Component({
    imports: [RouterLink, ImpactPipe],
    selector: 'app-data-table',
    styleUrl: './data-table.css',
    templateUrl: './data-table.html'
})
export class DataTable implements OnInit {
    private readonly db = inject(Db);

    public readonly data: Signal<readonly LogbookTableRead[]> = this.db.data;

    public ngOnInit() {
        this.db.getLogbookEntries();
    }
}
