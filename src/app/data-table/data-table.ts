import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LogbookTableSelect } from '../../../db/schema';
import { ImpactPipe } from '../impact-pipe';

@Component({
    imports: [RouterLink, ImpactPipe],
    selector: 'app-data-table',
    styleUrl: './data-table.css',
    templateUrl: './data-table.html'
})
export class DataTable implements OnInit {
    #_data: undefined | readonly LogbookTableSelect[];
    public get data() {
        return this.#_data;
    }

    public ngOnInit(): void {
        this.#_data = [
            {
                id: 1,
                title: 'row1',
                description: null,
                context: 'Life',
                impact: true,
                startDate: new Date().toISOString(),
                endDate: new Date().toISOString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 2,
                title: 'row2',
                description: null,
                context: 'Life',
                impact: false,
                startDate: new Date().toISOString(),
                endDate: new Date().toISOString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];
    }
}
