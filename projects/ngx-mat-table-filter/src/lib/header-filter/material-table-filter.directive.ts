import { ApplicationRef, ComponentRef, EventEmitter, Injector, OnChanges, OnInit, QueryList, Renderer2, SimpleChanges, createComponent } from '@angular/core';
import { AfterViewInit } from '@angular/core';
import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { MatColumnDef, MatTable } from '@angular/material/table';
import { SelectFilterComponent } from './widgets/select-filter/select-filter.component';
import { DateRangeFilterComponent } from './widgets/date-range-filter/date-range-filter.component';
import { TextFilterComponent } from './widgets/text-filter/text-filter.component';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FilterConfigInterface } from './interfaces/filter-config.interface';
import { delay } from 'rxjs';

@Directive({
  selector: '[vexMaterialTableFilter]',
  providers: []
})
export class MaterialTableFilterDirective implements AfterViewInit, OnInit, OnChanges {

  @Input() filterDefaults: any = {};
  renderedColumns: HTMLTableCellElement[] = [];
  valueChanges: EventEmitter<any> = new EventEmitter();
  filterFormGroup: FormGroup;
  columns: FilterConfigInterface[] = [];
  readonly filter: EventEmitter<any> = new EventEmitter();
  @Input() vexMaterialTableFilter: string[] = [];
  constructor(
              private el: ElementRef,
              private renderer: Renderer2,
              private host: MatTable<any>,
              private injector: Injector,
              private formBuilder: FormBuilder
    ) {
      this.filterFormGroup = this.formBuilder.group({});
  }

  ngOnInit(): void {
    this.filterFormGroup.valueChanges.subscribe((value: any) => {
      this.valueChanges.next(this.filterFormGroup.value);
    });
  }

  ngAfterViewInit(): void {
    this.createFilters();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('vexMaterialTableFilter')) {
      const current: string[] = changes['vexMaterialTableFilter'].currentValue;
      const previous: string[] = changes['vexMaterialTableFilter'].previousValue;

      if (previous && current) {

        const addedColumns = current.filter(col => previous.indexOf(col) === -1);
        const removedColumns = previous.filter(col => current.indexOf(col) === -1);

        if (current.length > previous.length) {
          // Add filter
          
        } else if (current.length < previous.length) {
          // Remove filter
          // class of element will be check to remove a filter from thead
          removedColumns.forEach((col: string) => {
            this.filterFormGroup.removeControl(col);
          });
        }

        //this.createFilters();
      }
    }
  }

  removeControl(): void {
    const thead = this.el.nativeElement.getElementsByTagName('thead')[0];
  }

  createFilters(): void {
    const columnList = this.getAllColumns();
    // console.log(columnList.toArray());

    const thead = this.el.nativeElement.getElementsByTagName('thead')[0];
    // const theadRow = thead.firstChild;
    // const columns = theadRow.getElementsByTagName('th');

    const rowClassList: string[] = ['mat-mdc-row', 'cdk-row'];
    const colClassList: string[] = ['vex-mat-filter-col', 'mat-mdc-cell', 'mdc-data-table__cell'];
    const emptyColClassList: string[] = ['vex-mat-filter-col', 'mdc-data-table__cell', 'mat-mdc-cell'];

    const filterRow = document.createElement('tr');
    rowClassList.forEach(className => filterRow.classList.add(className));

    this.vexMaterialTableFilter.forEach((columnProperty: string) => {
      const filterColumn = this.columns.find((column: FilterConfigInterface) => column.columnDef && column.columnDef.name === columnProperty);

      const col = document.createElement('th');

      if (filterColumn && filterColumn.columnDef) {
        const appRef = this.injector.get(ApplicationRef);
        const environmentInjector = appRef.injector;

        let componentRef: ComponentRef<any>;
        let widget: any;
        let widgetContainer: any;

        widgetContainer = document.createElement('div');
        widgetContainer.classList.add('vex-mat-filter-widget');
        widgetContainer.classList.add('flex');
        // widgetContainer.classList.add('items-center');
        widgetContainer.classList.add('relative');
        col.appendChild(widgetContainer);

        const isMultiple = filterColumn.multiple ?? false;
        const controlName = isMultiple ? `${filterColumn.columnDef.name}[]` : filterColumn.columnDef.name;
        const defaultFilter = this.filterDefaults.hasOwnProperty(controlName) 
        ? this.filterDefaults[controlName] : null;

        switch(filterColumn.type) {
          case 'select':

            componentRef = createComponent(SelectFilterComponent, {
              environmentInjector: environmentInjector,
              hostElement: widgetContainer
            });

            appRef.attachView(componentRef.hostView);
            componentRef.instance.options = filterColumn.options ?? [];
            componentRef.instance.multiple = isMultiple;
            
            // componentRef.instance.control.patchValue(defaultFilter);
            componentRef.instance.control.reset(defaultFilter, {onlySelf: true, emitEvent: false});

            this.filterFormGroup.addControl(controlName, new FormControl());
            
            componentRef.instance.control.valueChanges.subscribe((value: string) => {
              if (filterColumn.columnDef) {
                this.filterFormGroup.get(controlName)?.patchValue(value);
              }
            });
            
            break;
          case 'daterange':

            componentRef = createComponent(DateRangeFilterComponent, {
              environmentInjector: environmentInjector,
              hostElement: widgetContainer
            });

            appRef.attachView(componentRef.hostView);

            componentRef.instance.control.reset(defaultFilter);

            this.filterFormGroup.addControl(controlName, new FormControl());

            componentRef.instance.control.valueChanges.subscribe((value: string) => {
              if (filterColumn.columnDef) {
                this.filterFormGroup.get(controlName)?.patchValue(value);
              }
            });

            break;
          default:

            componentRef = createComponent(TextFilterComponent, {
              environmentInjector: environmentInjector,
              hostElement: widgetContainer
            });

            this.filterFormGroup.addControl(controlName, new FormControl());

            componentRef.instance.control.valueChanges.pipe(delay(700)).subscribe((value: string) => {
              if (filterColumn.columnDef && componentRef.instance.control.valid) {
                this.filterFormGroup.get(controlName)?.patchValue(value);
              }
            });

            appRef.attachView(componentRef.hostView);

            componentRef.instance.control.reset(defaultFilter, {onlySelf: true, emitEvent: false});
            
            break;
        }

        colClassList.forEach(className => col.classList.add(className));
      } else {
        emptyColClassList.forEach(className => col.classList.add(className));
      }

      filterRow.appendChild(col);
      this.renderedColumns.push(col);

    });

    // !!!table width problem occurres when activated custom filter row. Fixed by input width: 100%
    thead.appendChild(filterRow);
    this.filterFormGroup.reset(this.filterDefaults);
  }

  getAllColumns(): QueryList<MatColumnDef> {
    return <QueryList<MatColumnDef>>this.host._contentColumnDefs;
  }

  addColumn(column: FilterConfigInterface): void {
    this.columns.push(column);
  }

  get value() {
    return this.filterFormGroup.value;
  }

  @HostListener('mouseenter') onMouseEnter() {
  }

  @HostListener('mouseleave') onMouseLeave() {
  }
}
