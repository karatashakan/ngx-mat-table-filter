import { TestBed } from '@angular/core/testing';

import { NgxMatTableFilterService } from './ngx-mat-table-filter.service';

describe('NgxMatTableFilterService', () => {
  let service: NgxMatTableFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxMatTableFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
