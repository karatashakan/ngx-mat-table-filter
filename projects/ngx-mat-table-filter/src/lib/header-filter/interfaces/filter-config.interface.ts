import { MatColumnDef } from "@angular/material/table";

export interface FilterConfigInterface {
    title?: string | undefined;
    type: 'text' | 'select' | 'date' | 'daterange' | 'selection' | null;
    multiple?: boolean;
    options?: {value: string | number | boolean, text: string, checked?: boolean}[],
    columnDef?: MatColumnDef;
    filterName?: string | undefined;
}