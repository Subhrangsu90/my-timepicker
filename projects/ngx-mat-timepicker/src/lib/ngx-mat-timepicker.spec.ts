import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxMatTimepicker } from './ngx-mat-timepicker';

describe('NgxMatTimepicker', () => {
  let component: NgxMatTimepicker;
  let fixture: ComponentFixture<NgxMatTimepicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxMatTimepicker],
    }).compileComponents();

    fixture = TestBed.createComponent(NgxMatTimepicker);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
