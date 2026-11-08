import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LogbookTableCreate } from '../../../db/schema';
import { Db } from '../db';
import { contexts } from './crud-form.model';

@Component({
    imports: [],
    selector: 'app-crud-form',
    styleUrl: './crud-form.css',
    templateUrl: './crud-form.html'
})
export class CrudForm {
    private readonly activatedRoute = inject(ActivatedRoute);
    private router = inject(Router);
    private readonly db = inject(Db);

    public readonly contexts = contexts;
    public readonly isCreate: boolean = this.activatedRoute.snapshot.params['id'] === undefined;

    public onSubmit(event: SubmitEvent): void {
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

        this.db.saveEntry(entry).subscribe(() => {
            this.router.navigate(['']);
        });
    }
}
