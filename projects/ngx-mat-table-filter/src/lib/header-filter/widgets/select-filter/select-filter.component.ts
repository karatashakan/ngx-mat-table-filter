import { Component, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_SELECT_CONFIG } from '@angular/material/select';

@Component({
  selector: 'vex-select-filter',
  template: `
  <div class="vex-filter-icon flex items-center pointer-events-none">
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-filter" viewBox="0 0 16 16"> <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/> </svg>
  </div>
    <mat-select [formControl]="control" [panelClass]="'mat-primary'" class="dropdown-filter" [multiple]="multiple" [hideSingleSelectionIndicator]="true">
      <mat-option *ngFor="let option of options" [value]="option.value">{{ option.text }}</mat-option>
    </mat-select>
  `,
  styles: [],
  providers: [
    {
      provide: MAT_SELECT_CONFIG,
      useValue: {overlayPanelClass: 'filter-options-fix-width', disableOptionCentering: true}
    }
  ]
})
export class SelectFilterComponent {

  @Input() multiple: boolean = false;
  @Input() options: any[] = [];

  control: FormControl = new FormControl(null, [Validators.minLength(3)]);

}
