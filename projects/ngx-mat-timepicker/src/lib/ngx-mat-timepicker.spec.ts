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

  it('should read value from registered input when opened', () => {
    const mockInput = {
      getInputValue: () => '04:45 PM',
    };
    component.registerInput(mockInput);
    component.open();

    expect(component.isOpen()).toBe(true);
    component.close();
    expect(component.isOpen()).toBe(false);
  });
});
