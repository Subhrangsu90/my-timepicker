import {
  Directive,
  ElementRef,
  forwardRef,
  HostListener,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgxMatTimepicker } from '../ngx-mat-timepicker';
import { TimepickerAdapterService } from '../services/timepicker-adapter.service';
import { TimeValue } from '../models/timepicker.models';

@Directive({
  selector: 'input[ngxMatTimepicker]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxMatTimepickerInputDirective),
      multi: true,
    },
  ],
})
export class NgxMatTimepickerInputDirective implements ControlValueAccessor, OnInit, OnDestroy {
  private elementRef = inject(ElementRef<HTMLInputElement>);
  private adapter = inject(TimepickerAdapterService);

  readonly ngxMatTimepicker = input.required<NgxMatTimepicker>();

  readonly timeChange = output<string>();

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  private timeSetSub: { unsubscribe(): void } | null = null;
  private parsedValue: TimeValue | null = null;

  ngOnInit(): void {
    const picker = this.ngxMatTimepicker();
    this.timeSetSub = picker.timeSet.subscribe((time: TimeValue) => {
      this.parsedValue = time;
      const fmt = this.adapter.normalizeFormat(picker.format());
      const formatted = this.adapter.format(time, fmt);
      this.elementRef.nativeElement.value = formatted;
      this.onChange(formatted);
      this.timeChange.emit(formatted);
    });
  }

  ngOnDestroy(): void {
    this.timeSetSub?.unsubscribe();
  }

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement)?.value ?? '';
    this.onChange(value);
    this.timeChange.emit(value);
  }

  @HostListener('blur')
  onBlur(): void {
    this.onTouched();
    const raw = this.elementRef.nativeElement.value;
    if (raw) {
      const picker = this.ngxMatTimepicker();
      const fmt = this.adapter.normalizeFormat(picker.format());
      const parsed = this.adapter.parse(raw, fmt);
      this.parsedValue = parsed;
      const formatted = this.adapter.format(parsed, fmt);
      this.elementRef.nativeElement.value = formatted;
      this.onChange(formatted);
    }
  }

  writeValue(value: string | Date | TimeValue | null): void {
    if (!value) {
      this.elementRef.nativeElement.value = '';
      this.parsedValue = null;
      return;
    }
    const picker = this.ngxMatTimepicker();
    const fmt = this.adapter.normalizeFormat(picker?.format?.() ?? 12);
    const parsed = this.adapter.parse(value, fmt);
    this.parsedValue = parsed;
    this.elementRef.nativeElement.value = this.adapter.format(parsed, fmt);
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.elementRef.nativeElement.disabled = isDisabled;
  }

  getParsedValue(): TimeValue | null {
    return this.parsedValue;
  }
}
