import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'vex-date-range-filter',
  template: `
    <div class="relative">
      <div (click)="picker.open()" class="absolute inset-y-0 left-0 flex items-center pointer-events-none">
      <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" viewBox="-0.5 0 15 15" xmlns="http://www.w3.org/2000/svg" fill="#6b7280"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill="#6b7280" fill-rule="evenodd" d="M61,154.006845 C61,153.45078 61.4499488,153 62.0068455,153 L73.9931545,153 C74.5492199,153 75,153.449949 75,154.006845 L75,165.993155 C75,166.54922 74.5500512,167 73.9931545,167 L62.0068455,167 C61.4507801,167 61,166.550051 61,165.993155 L61,154.006845 Z M62,157 L74,157 L74,166 L62,166 L62,157 Z M64,152.5 C64,152.223858 64.214035,152 64.5046844,152 L65.4953156,152 C65.7740451,152 66,152.231934 66,152.5 L66,153 L64,153 L64,152.5 Z M70,152.5 C70,152.223858 70.214035,152 70.5046844,152 L71.4953156,152 C71.7740451,152 72,152.231934 72,152.5 L72,153 L70,153 L70,152.5 Z" transform="translate(-61 -152)"></path> </g></svg>
      </div>
      <mat-datepicker #picker></mat-datepicker>
      <input [formControl]="control" matInput [matDatepicker]="picker" (click)="picker.open()" type="text" placeholder="Filtrele" class="appearance-none border-0 w-full pl-5 text-gray-700 leading-tight focus:outline-none" />
    </div>
  `,
  styles: [
  ]
})
export class DateRangeFilterComponent {
  control: FormControl = new FormControl('', [Validators.minLength(3)]);
}
