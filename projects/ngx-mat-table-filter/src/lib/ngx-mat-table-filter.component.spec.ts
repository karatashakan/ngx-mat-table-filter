import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxMatTableFilterComponent } from './ngx-mat-table-filter.component';

describe('NgxMatTableFilterComponent', () => {
  let component: NgxMatTableFilterComponent;
  let fixture: ComponentFixture<NgxMatTableFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxMatTableFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxMatTableFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
