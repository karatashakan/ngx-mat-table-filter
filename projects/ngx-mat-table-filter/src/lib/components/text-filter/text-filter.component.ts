import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { IFilter } from '../../interfaces/filter.interface';
import { FilterConfigInterface } from '../../header-filter/interfaces/filter-config.interface';

@Component({
  selector: 'vex-text-filter',
  standalone: true,
  template: `
    <form [formGroup]="form">
      <mat-form-field>
        <mat-label>Ara</mat-label>
        <input matInput type="text" formControlName="filter">
        @if (form.controls['filter'].value) {
          <button matSuffix mat-icon-button aria-label="Temizle" (click)="setValue(null)">
            <mat-icon>close</mat-icon>
          </button>
        }
      </mat-form-field>
    </form>
  `,
  styles: ``,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class TextFilterComponent implements IFilter, OnInit {
  closable: EventEmitter<boolean>;
  form: FormGroup;

  constructor() {
    this.form = new FormGroup({
      filter: new FormControl<string | null>(null)
    });
    this.closable = new EventEmitter<boolean>();
  }

  filter: FilterConfigInterface | undefined;

  ngOnInit(): void {
  }

  setValue(value: string | null): void {
    this.form.controls['filter'].setValue(value);
  }
}
