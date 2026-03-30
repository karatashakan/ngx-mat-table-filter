import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'vex-text-filter',
  template: `
    <div class="vex-filter-icon absolute inset-y-0 left-0 flex items-center pointer-events-none">
      <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
    </div>
    <input type="text" [formControl]="control" class="filter-input text-filter focus:outline-none" placeholder="Filtrele" />
  `,
  styles: [
    '.text-filter { margin-left: 30px }'
  ]
})
export class TextFilterComponent {
  control: FormControl = new FormControl('', [Validators.minLength(3)]);
}
