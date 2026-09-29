import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxMatPeriodToggleComponent } from './period-toggle.component';

describe('NgxMatPeriodToggleComponent', () => {
  let component: NgxMatPeriodToggleComponent;
  let fixture: ComponentFixture<NgxMatPeriodToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxMatPeriodToggleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NgxMatPeriodToggleComponent);
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
