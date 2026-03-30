import { AfterViewInit, Directive, ElementRef, EventEmitter, HostListener, Input, Renderer2, ViewContainerRef } from "@angular/core";
import { MatColumnDef } from "@angular/material/table";
import { FilterConfigInterface } from "../header-filter/interfaces/filter-config.interface";
import { Dialog } from "@angular/cdk/dialog";
import { ConnectedPosition, Overlay } from "@angular/cdk/overlay";
import { Filter, VexFilterDirective } from "./vex-filter.directive";
import { NgxMatTableFilterComponent } from "../ngx-mat-table-filter.component";

@Directive({
    selector: '[filterHeader]'
})
export class FilterHeaderDirective implements AfterViewInit {

    columnData: FilterConfigInterface | undefined;
    dialog!: HTMLDivElement;
    readonly filter: EventEmitter<any> = new EventEmitter();
    @Input() filterHeader: FilterConfigInterface | undefined;

    @HostListener('document:click', ['$event'])
    clickOut(event: any) {
      const target: HTMLElement = <HTMLElement>event.target;
      if (this.dialog && target.id !== this.dialog.id) {
        const existingDialog = this.filterContainer();
        if (existingDialog) {
          existingDialog.remove();
        }
      }
    }

    constructor(
                private el: ElementRef,
                private renderer: Renderer2,
                private host: MatColumnDef,
                private dlgService: Dialog,
                private overlay: Overlay,
                private viewContainerRef: ViewContainerRef,
                private vexFilter: VexFilterDirective) {
    }
  
    ngAfterViewInit(): void {

      if (this.filterHeader) {
        this.filterHeader.columnDef = this.host;

        this.columnData = this.filterHeader;
        this.columnData.options = this.filterHeader && this.filterHeader.options ? this.filterHeader.options : []
  
        this.appendFilterIcon();
      }

    }

    filterContainer(): HTMLElement | null {
      const _s = document.getElementsByClassName('filter-parent');
      let e: HTMLElement = null!;
      if (_s.length > 0) {
        e = <HTMLElement>_s[0];
      }

      return e;
    }
  
    private appendFilterIcon() {
      const filterIcon = document.createElement('a');
      filterIcon.setAttribute('href', 'javascript: void(0);');
      filterIcon.innerHTML = this.filterIcon;
      filterIcon.style.setProperty('margin-left', '10px');
      filterIcon.style.setProperty('cursor', 'pointer');

      const container = this.el.nativeElement.querySelector('.mat-sort-header-container');
      container.appendChild(filterIcon);
 
      this.renderer.listen(filterIcon, 'click', (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const element = <Element>this.el.nativeElement;

        const positions: ConnectedPosition[] = [{originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top'}];
        const positionStrategy = this.overlay.position().flexibleConnectedTo(element).withPositions(positions);
    
        const config = {
          data: this.columnData,
          hasBackdrop: false,
          panelClass: ['card', 'overflow-y-auto', 'filter-container'],
          positionStrategy,
          autoFocus: false
        };

        // this.host.headerCell.template.elementRef
        const ref = this.dlgService.open(NgxMatTableFilterComponent, config);
        ref.outsidePointerEvents.subscribe((event: MouseEvent) => {
          if (!ref.disableClose) {
            ref.close();
          }
        });

        if (ref.componentInstance === null) {
          return;
        }

        ref.componentInstance.valueChange.subscribe((filterRule: Filter) => {
          filterRule.value !== null ? 
          this.vexFilter.addFilterRule(filterRule) : this.vexFilter.removeFilterRule(filterRule);
          if (ref.disableClose) {
            ref.close();
          }
        });

      });
  
    }
  
    get filterIcon() {
      return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-filter" viewBox="0 0 16 16"> <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/> </svg>';
    }

}