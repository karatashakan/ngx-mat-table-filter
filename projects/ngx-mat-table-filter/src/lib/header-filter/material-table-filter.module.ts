import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialTableFilterDirective } from './material-table-filter.directive';
import { FilterHeaderDirective } from '../../components/vex-table-header-filter/directives/filter-header.directive';
import { SelectFilterComponent } from './widgets/select-filter/select-filter.component';
import { MatSelectModule } from '@angular/material/select';
import { DateRangeFilterComponent } from './widgets/date-range-filter/date-range-filter.component';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TextFilterComponent } from './widgets/text-filter/text-filter.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    MaterialTableFilterDirective, 
    FilterHeaderDirective, 
    SelectFilterComponent, DateRangeFilterComponent, TextFilterComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatNativeDateModule,
    MatDatepickerModule
  ],
  exports: [
    MaterialTableFilterDirective, 
    FilterHeaderDirective,
    SelectFilterComponent
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'tr-TR'}
  ]
})
export class MaterialTableFilterModule { }
