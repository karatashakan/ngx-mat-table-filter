import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { IFilter } from '../../interfaces/filter.interface';
import { FilterConfigInterface } from '../../header-filter/interfaces/filter-config.interface';
import { NgFor, NgIf } from '@angular/common';

export interface Option {
  text: string;
  value: string | number | boolean;
  checked?: boolean;
  children?: Option[];
}

@Component({
  selector: 'vex-selection-filter',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    MatDividerModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule
  ],
  template: `
    <form [formGroup]="form">
      <section *ngIf="model">
          <span>
              <mat-checkbox
                          [checked]="allComplete"
                          [color]="'primary'"
                          [indeterminate]="isIndeterminate()"
                          (change)="setAll($event.checked)">
              {{model.text}}
              </mat-checkbox>
          </span>
          <mat-divider class="my-1"></mat-divider>
          <span>
              <ul formArrayName="filter" class="list-inside">
                  <li class="pl-5" *ngFor="let child of model.children; let i = index;">
                  <mat-checkbox [color]="'primary'"
                                [formControlName]="i"
                                (ngModelChange)="updateAllComplete()">
                      {{child.text}}
                  </mat-checkbox>
                  </li>
              </ul>
          </span>
      </section>
    </form>
  `,
  styles: ``
})
export class SelectionFilterComponent implements IFilter, OnInit {
  closable: EventEmitter<boolean>;
  form: FormGroup;

  get model(): Option {
    const _model = {
      text: 'Tümünü Seç',
      value: false,
      children: this.filter ? this.filter.options : []
    };
    // _model.children?.forEach(o => o.checked = o.checked);
    return _model;
  }

  constructor() {
    this.form = new FormGroup({
      filter: new FormArray([])
    });
    this.closable = new EventEmitter<boolean>();
  }

  filter: FilterConfigInterface | undefined;

  allComplete: boolean = false;

  ngOnInit(): void {
    const formArray = new FormArray((this.model.children || []).map(_=> new FormControl(_.checked)));
    this.form.setControl('filter', formArray);
  }

  updateAllComplete() {
    const allControls = (this.form.controls['filter'] as FormArray).controls;
    const checkedControls = allControls.filter(t => t.value);
    this.allComplete =  checkedControls.length > 0 && checkedControls.length === allControls.length;
  }

  isIndeterminate(): boolean {
    if (this.model.children == null) {
      return false;
    }
    const allControls = (this.form.controls['filter'] as FormArray).controls;
    const checkedControls = allControls.filter(t => t.value);
    return checkedControls.length > 0 && checkedControls.length < allControls.length;
  }

  setAll(completed: boolean) {
    if (this.model.children == null) {
      return;
    }

    const arr = this.form.controls['filter'] as FormArray;
    arr.controls.forEach(t => t.setValue(completed));
  }
}
