import { Component, OnInit, signal, WritableSignal } from '@angular/core';
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
    #_data: WritableSignal<LogbookTableSelect[]> = signal([]);

    public readonly data = this.#_data.asReadonly();

    public ngOnInit(): void {
        // Add httpClient and call api
    }
}
