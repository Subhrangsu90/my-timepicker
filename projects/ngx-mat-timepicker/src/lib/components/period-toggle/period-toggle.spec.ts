import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxMatPeriodToggle } from './period-toggle';

describe('NgxMatPeriodToggle', () => {
  let component: NgxMatPeriodToggle;
  let fixture: ComponentFixture<NgxMatPeriodToggle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxMatPeriodToggle],
    }).compileComponents();

    fixture = TestBed.createComponent(NgxMatPeriodToggle);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('period', 'AM');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display AM as selected initially', () => {
    const amButton = fixture.nativeElement.querySelector('button[aria-label="AM"]');
    expect(amButton.classList.contains('selected')).toBe(true);
  });

  it('should emit periodChange when PM clicked', () => {
    let emitted: string | undefined;
    component.periodChange.subscribe((val) => (emitted = val));

    const pmButton = fixture.nativeElement.querySelector('button[aria-label="PM"]');
    pmButton.click();

    expect(emitted).toBe('PM');
  });
});
