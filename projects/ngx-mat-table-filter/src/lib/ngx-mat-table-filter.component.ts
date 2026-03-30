import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { AfterViewInit, Component, ComponentRef, EventEmitter, Inject, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { FilterConfigInterface } from './header-filter/interfaces/filter-config.interface';
import { Filter } from './directives/vex-filter.directive';
import { DateRangeFilterComponent } from './components/date-range-filter/date-range-filter.component';
import { SelectionFilterComponent } from './components/selection-filter/selection-filter.component';
import { TextFilterComponent } from './components/text-filter/text-filter.component';
import { IFilter } from './interfaces/filter.interface';

@Component({
  selector: 'lib-ngx-mat-table-filter',
  imports: [
    MatButtonModule,
    MatDividerModule,
    FormsModule, ReactiveFormsModule, MatCheckboxModule
  ],
  template: `
    <div class="card overflow-y-auto">
        <div class="p-2">
            <h5>{{data.title}}</h5>
            <ng-template #template></ng-template>
        </div>
        <mat-divider></mat-divider>
        <div class="flex items-center justify-between gap-5 py-2 px-3">
            <button mat-stroked-button (click)="apply()">Apply</button>
            <button mat-stroked-button (click)="cancel($event)">Cancel</button>
        </div>
    </div>
  `,
  styles: ``
})
export class NgxMatTableFilterComponent implements AfterViewInit {

  form: FormGroup;
  public readonly valueChange: EventEmitter<Filter>;

  @ViewChild('template', { read: ViewContainerRef }) templateViewContainerRef = <ViewContainerRef>{};

  constructor(
    public dialogRef: DialogRef<string>,
    @Inject(DIALOG_DATA) public data: FilterConfigInterface,
    private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({});
    this.valueChange = new EventEmitter();
  }


  ngAfterViewInit(): void {

    const filterList: { typeName: string, componentType: Type<IFilter> }[] = [
      {
        typeName: 'text',
        componentType: TextFilterComponent
      },
      {
        typeName: 'selection',
        componentType: SelectionFilterComponent
      },
      {
        typeName: 'daterange',
        componentType: DateRangeFilterComponent
      }
    ];

    for (let i = 0; i < filterList.length; i++) {
      if (filterList[i].typeName === this.data.type) {
        this._registerControl(filterList[i].componentType);
        break;
      }
    }

  }

  private _registerControl<C>(component: Type<IFilter>): ComponentRef<IFilter> {
    const componentRef = this.templateViewContainerRef.createComponent(component);
    componentRef.instance.filter = this.data;
    this.form.registerControl(this.data.columnDef?.name!!, componentRef.instance.form);

    componentRef.instance.closable.subscribe((closable: boolean) => this.dialogRef.disableClose = !closable);

    return componentRef;
  }

  apply(): void {
    const filterValue = this.form.value[this.data.columnDef?.name!!] ?? null;

    const filter: Filter = new Filter();
    filter.field = this.data.filterName || this.data.columnDef?.name!!;
    filter.op = this.data.multiple ? 'or' : 'equal';

    if (this.data.type === 'selection') {
      const vals = filterValue.filter as any[];
      const options = this.data.options ?? [];
      options.forEach((value: any, index: number) => {
        filterValue.filter[index] = filterValue.filter[index] ? options[index].value : null;
      });
      filter.value = filterValue === null ? null : filterValue.filter.filter((item: any) => item !== null);
    } else {
      filter.value = filterValue.filter;
    }

    this.valueChange.emit(filter);
    this.dialogRef.close();
  }

  cancel($event: any): void {
    $event.stopPropagation();
    this.dialogRef.close();
  }

}
