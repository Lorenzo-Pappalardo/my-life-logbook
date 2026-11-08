import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LogbookTableCreate, LogbookTableUpdate } from '../../../db/schema';
import { Db } from '../db';
import { contexts } from './crud-form.model';

@Component({
    imports: [],
    selector: 'app-crud-form',
    styleUrl: './crud-form.css',
    templateUrl: './crud-form.html'
})
export class CrudForm implements OnInit {
    private readonly activatedRoute = inject(ActivatedRoute);
    private router = inject(Router);
    private readonly db = inject(Db);

    public readonly contexts = contexts;
    public readonly id: string = this.activatedRoute.snapshot.params['id'];

    public ngOnInit() {
        if (this.id !== undefined) {
            const entry = this.db.data()[Number(this.id) - 1];
        }
    }

    public onSubmit(event: SubmitEvent) {
        event.stopPropagation();
        event.preventDefault();

        const data = new FormData(event.target as HTMLFormElement);

        const entry: LogbookTableCreate = {
            title: data.get('title') as string,
            description: data.get('description') as string,
            context: data.get('context') as string,
            startDate: data.get('start-date') as string,
            endDate: data.get('end-date') as string,
            impact: data.get('impact') === 'true'
        };

        if (this.id === undefined) {
            this.db.saveEntry(entry).subscribe(() => {
                this.router.navigate(['']);
            });
        } else {
            this.db
                .editEntry({
                    id: Number(this.id),
                    ...entry
                } satisfies LogbookTableUpdate)
                .subscribe(() => {
                    this.router.navigate(['']);
                });
        }
    }
}
