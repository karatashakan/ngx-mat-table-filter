import { EventEmitter } from "@angular/core";
import { FormGroup, UntypedFormControl } from "@angular/forms";
import { FilterConfigInterface } from "../header-filter/interfaces/filter-config.interface";

export interface IFilter {
    filter: FilterConfigInterface | undefined;
    form: FormGroup;
    closable: EventEmitter<boolean>;
}