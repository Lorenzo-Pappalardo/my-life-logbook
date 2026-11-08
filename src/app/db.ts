import { HttpClient } from '@angular/common/http';
import { inject, Service, signal, WritableSignal } from '@angular/core';
import { LogbookTableSelect } from '../../db/schema';

@Service()
export class Db {
    private http = inject(HttpClient);

    #_data: WritableSignal<readonly LogbookTableSelect[]> = signal([]);

    public readonly data = this.#_data.asReadonly();

    public getLogbookEntries() {
        this.http.get<readonly LogbookTableSelect[]>('/api/logbook').subscribe(data => {
            this.#_data.set(data);
        });
    }
}
