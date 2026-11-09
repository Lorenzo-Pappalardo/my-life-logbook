import { HttpClient } from '@angular/common/http';
import { inject, Service, signal, WritableSignal } from '@angular/core';
import { LogbookTableCreate, LogbookTableRead, LogbookTableUpdate } from '../../db/schema';

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

    public getLogbookEntry(id: number) {
        return this.http.get<LogbookTableRead>(`/api/logbook/${id}`);
    }

    public saveEntry(entry: LogbookTableCreate) {
        return this.http.post<void>('/api/logbook/create', entry);
    }

    public editEntry(entry: LogbookTableUpdate) {
        return this.http.put<void>(`/api/logbook/edit`, entry);
    }

    public deleteEntry(id: number) {
        return this.http.delete<void>(`/api/logbook/delete/${id}`);
    }
}
