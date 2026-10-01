import { Component, signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { form, FormField } from '@angular/forms/signals';
import { NgxMatTimepickerInput } from './ngx-mat-timepicker-input';
import { NgxMatTimepicker } from '../ngx-mat-timepicker';

@Component({
  standalone: true,
  imports: [FormField, NgxMatTimepickerInput, NgxMatTimepicker],
  template: `
    <input [ngxMatTimepicker]="picker" [formField]="bookingForm.launchTime" />
    <ngx-mat-timepicker #picker />
  `,
})
class TestSignalFormsApiComponent {
  readonly model = signal({
    launchTime: '07:30 AM',
  });
  readonly bookingForm = form(this.model);
  readonly picker = viewChild.required<NgxMatTimepicker>('picker');
}

@Component({
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgxMatTimepickerInput, NgxMatTimepicker],
  template: `
    <input [ngxMatTimepicker]="picker" [(ngModel)]="timeSignal" />
    <ngx-mat-timepicker #picker />
  `,
})
class TestSignalFormComponent {
  readonly timeSignal = signal('08:30 AM');
}

@Component({
  standalone: true,
  imports: [NgxMatTimepickerInput, NgxMatTimepicker],
  template: `
    <input
      #inputEl
      [ngxMatTimepicker]="picker"
      [value]="pureSignal()"
      (timeChange)="pureSignal.set($event)"
    />
    <ngx-mat-timepicker #picker />
  `,
})
class TestPureSignalComponent {
  readonly pureSignal = signal('09:45 AM');
}

describe('NgxMatTimepickerInput with Signals', () => {
  it('should support two-way signal binding via [(ngModel)]', async () => {
    await TestBed.configureTestingModule({
      imports: [TestSignalFormComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestSignalFormComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.value).toBe('08:30 AM');

    // Update signal from code
    fixture.componentInstance.timeSignal.set('10:15 PM');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(input.value).toBe('10:15 PM');
  });

  it('should support pure signal binding via (timeChange)', async () => {
    await TestBed.configureTestingModule({
      imports: [TestPureSignalComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestPureSignalComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.value).toBe('09:45 AM');

    input.value = '11:00 AM';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(fixture.componentInstance.pureSignal()).toBe('11:00 AM');
  });

  it('should support Angular Signal Forms [formField] binding', async () => {
    await TestBed.configureTestingModule({
      imports: [TestSignalFormsApiComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestSignalFormsApiComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.value).toBe('07:30 AM');

    // Update model signal
    fixture.componentInstance.model.update((m) => ({ ...m, launchTime: '06:15 PM' }));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(input.value).toBe('06:15 PM');

    // Simulating user picking/typing a new time
    input.value = '08:45 PM';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.model().launchTime).toBe('08:45 PM');

    // Simulating time confirmed from picker dialog
    fixture.componentInstance.picker().timeSet.emit({ hour: 9, minute: 30, period: 'AM' });
    fixture.detectChanges();

    expect(fixture.componentInstance.model().launchTime).toBe('09:30 AM');
    expect(input.value).toBe('09:30 AM');
  });
});

