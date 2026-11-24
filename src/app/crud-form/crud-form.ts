import { Component, inject, OnDestroy, OnInit } from '@angular/core';
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
export class CrudForm implements OnInit, OnDestroy {
    #activatedRoute = inject(ActivatedRoute);
    #router = inject(Router);
    #db = inject(Db);
    #formBuilder = inject(FormBuilder);
    #intervalId?: ReturnType<typeof setTimeout>;

    public readonly contexts = contexts;
    public readonly id: string = this.#activatedRoute.snapshot.params['id'];
    public readonly logbookForm = this.#formBuilder.group({
        title: ['', Validators.required],
        description: [''],
        context: ['', Validators.required],
        startDate: ['', Validators.required],
        endDate: [''],
        impact: ['', Validators.required]
    });

    public ngOnInit() {
        if (this.id !== undefined) {
            const entry = this.#db.data().find(entry => entry.id.toString() === this.id);

            if (entry !== undefined) {
                this.logbookForm.patchValue({
                    title: entry.title,
                    description: entry.description,
                    context: entry.context,
                    startDate: unprettifyDate(entry.startDate),
                    endDate: unprettifyDate(entry.endDate),
                    impact: entry.impact.toString()
                });

                console.log('Incremental save enabled');
                this.#intervalId = setInterval(() => {
                    this.onEdit(false);
                    console.log('Incremental save performed');
                }, 30000);
            }
        }
    }

    public ngOnDestroy() {
        if (this.#intervalId !== undefined) {
            clearInterval(this.#intervalId);
        }
    }

    public onSubmit() {
        if (this.id === undefined) {
            this.#db.saveEntry(this.getEntryPayload()).subscribe(() => {
                this.#router.navigate(['']);
            });
        } else {
            this.onEdit();
        }
    }

    public onDelete() {
        this.#db.deleteEntry(Number(this.id)).subscribe(() => {
            this.#router.navigate(['']);
        });
    }

    private getEntryPayload(): LogbookTableCreate {
        return {
            title: this.logbookForm.get('title')?.value as string,
            description: this.logbookForm.get('description')?.value as string,
            context: this.logbookForm.get('context')?.value as string,
            startDate: this.logbookForm.get('startDate')?.value as string,
            endDate: this.logbookForm.get('endDate')?.value as string,
            impact: this.logbookForm.get('impact')?.value === 'true'
        };
    }

    private onEdit(navigate = true) {
        const entry = this.getEntryPayload();

        this.#db
            .editEntry({
                id: Number(this.id),
                ...entry
            } satisfies LogbookTableUpdate)
            .subscribe(() => {
                if (navigate) this.#router.navigate(['']);
            });
    }
}
