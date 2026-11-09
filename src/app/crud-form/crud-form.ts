import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { unprettifyDate } from '../../../db/prettify-date';
import { LogbookTableCreate, LogbookTableUpdate } from '../../../db/schema';
import { Db } from '../db';
import { contexts } from './crud-form.model';

@Component({
    imports: [ReactiveFormsModule],
    selector: 'app-crud-form',
    styleUrl: './crud-form.css',
    templateUrl: './crud-form.html'
})
export class CrudForm implements OnInit {
    private readonly activatedRoute = inject(ActivatedRoute);
    private router = inject(Router);
    private readonly db = inject(Db);
    private formBuilder = inject(FormBuilder);

    public readonly contexts = contexts;
    public readonly id: string = this.activatedRoute.snapshot.params['id'];
    public readonly logbookForm = this.formBuilder.group({
        title: ['', Validators.required],
        description: [''],
        context: ['', Validators.required],
        startDate: ['', Validators.required],
        endDate: [''],
        impact: ['', Validators.required]
    });

    public ngOnInit() {
        if (this.id !== undefined) {
            const entry = this.db.data().find(entry => entry.id.toString() === this.id);

            if (entry !== undefined)
                this.logbookForm.patchValue({
                    title: entry.title,
                    description: entry.description,
                    context: entry.context,
                    startDate: unprettifyDate(entry.startDate),
                    endDate: unprettifyDate(entry.endDate),
                    impact: entry.impact.toString()
                });
        }
    }

    public onSubmit() {
        const entry: LogbookTableCreate = {
            title: this.logbookForm.get('title')?.value as string,
            description: this.logbookForm.get('description')?.value as string,
            context: this.logbookForm.get('context')?.value as string,
            startDate: this.logbookForm.get('startDate')?.value as string,
            endDate: this.logbookForm.get('endDate')?.value as string,
            impact: this.logbookForm.get('impact')?.value === 'true'
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
