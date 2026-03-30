import { AfterViewInit, Component, EventEmitter, ViewChild } from '@angular/core';
import { IFilter } from '../../interfaces/filter.interface';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { MatDatepickerModule, MatDateRangePicker } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FilterConfigInterface } from '../../header-filter/interfaces/filter-config.interface';

@Component({
  selector: 'vex-date-range-filter',
  standalone: true,
  imports: [MatFormFieldModule, MatDatepickerModule, FormsModule, ReactiveFormsModule,],
  template: `
    <mat-form-field>
      <mat-label>Tarih aralığı girin</mat-label>
      <mat-date-range-input [formGroup]="form" [rangePicker]="picker">
        <input matStartDate formControlName="start" placeholder="Başlangıç tarihi">
        <input matEndDate formControlName="end" placeholder="Bitiş tarihi">
      </mat-date-range-input>
      <mat-hint>MM/DD/YYYY – MM/DD/YYYY</mat-hint>
      <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
      <mat-date-range-picker #picker></mat-date-range-picker>

      @if (form.controls['start'].hasError('matStartDateInvalid')) {
        <mat-error>Geçersiz başlangıç tarihi</mat-error>
      }
      @if (form.controls['end'].hasError('matEndDateInvalid')) {
        <mat-error>Geçersiz bitiş tarihi</mat-error>
      }
    </mat-form-field>
  `,
  styles: ``
})
export class DateRangeFilterComponent implements IFilter, AfterViewInit {
  
  closable: EventEmitter<boolean>;
  @ViewChild('picker', {read: MatDateRangePicker}) rangePicker: any;
  form: FormGroup;
  filter: FilterConfigInterface | undefined;

  constructor() {
    this.form = new FormGroup({
      start: new FormControl<Date | null>(null),
      end: new FormControl<Date | null>(null),
    });
    this.closable = new EventEmitter<boolean>(true);
  }
  

  ngAfterViewInit(): void {
    this.rangePicker.openedStream.subscribe(() => this.closable.emit(false));
    this.rangePicker.closedStream.subscribe(() => this.closable.emit(true));
  }

}
