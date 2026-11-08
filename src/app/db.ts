import { HttpClient } from '@angular/common/http';
import { inject, Service, signal, WritableSignal } from '@angular/core';
import { LogbookTableCreate, LogbookTableRead } from '../../db/schema';

@Service()
export class Db {
    private http = inject(HttpClient);

    #_data: WritableSignal<readonly LogbookTableRead[]> = signal([]);

    public readonly data = this.#_data.asReadonly();

    public getLogbookEntries() {
        this.http.get<readonly LogbookTableRead[]>('/api/logbook').subscribe(data => {
            this.#_data.set(data);
        });
    }

    public saveEntry(entry: LogbookTableCreate) {
        return this.http.post<void>('/api/logbook/create', entry);
    }
}
