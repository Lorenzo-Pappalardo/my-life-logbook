import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { contexts } from './crud-form.model';

@Component({
    imports: [],
    selector: 'app-crud-form',
    styleUrl: './crud-form.css',
    templateUrl: './crud-form.html'
})
export class CrudForm {
    private readonly activatedRoute = inject(ActivatedRoute);

    public readonly contexts = contexts;
    public readonly isCreate: boolean = this.activatedRoute.snapshot.params['id'] === undefined;
}
