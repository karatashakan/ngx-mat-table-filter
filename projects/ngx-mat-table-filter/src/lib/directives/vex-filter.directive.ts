import { Directive, EventEmitter } from '@angular/core';

export class Filter {
  field: string | undefined;
  op: string | undefined;
  value: string | any[] | undefined
};

@Directive({
  selector: '[vexFilter]',
  standalone: true
})
export class VexFilterDirective {

  filterRules: Filter[];

  readonly valueChange: EventEmitter<Filter[]>;

  constructor() {
    this.filterRules = [];
    this.valueChange = new EventEmitter();
  }

  addFilterRule(rule: Filter): void {
    this._deleteFilterRule(rule);

    this.filterRules.push(rule);
    this.emitChanges();
  }

  removeFilterRule(rule: Filter): void {
    this._deleteFilterRule(rule);
    this.emitChanges();
  }

  private _deleteFilterRule(rule: Filter) {
    const filteredRules: Filter[] = this.filterRules
    .filter(existingRule => existingRule.field === rule.field);

    for (let i = 0; i < filteredRules.length; i++) {
      this.filterRules.splice(this.filterRules.indexOf(filteredRules[i]), 1);
    }
  }

  private emitChanges(): void {
    this.valueChange.emit(this.filterRules);
  }

}
