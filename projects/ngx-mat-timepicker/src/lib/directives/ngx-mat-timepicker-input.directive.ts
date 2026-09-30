import {
  computed,
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
  exportAs: 'ngxMatTimepickerInput',
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

  readonly valueType = input<'auto' | 'string' | 'date'>('auto');

  readonly timeChange = output<string>();
  readonly dateChange = output<Date>();

  private onChange: (value: string | Date) => void = () => {};
  private onTouched: () => void = () => {};

  private timeSetSub: { unsubscribe(): void } | null = null;
  private parsedValue: TimeValue | null = null;
  private originalDate: Date | null = null;
  private isDateMode = false;

  ngOnInit(): void {
    const picker = this.ngxMatTimepicker();
    this.timeSetSub = picker.timeSet.subscribe((time: TimeValue) => {
      this.parsedValue = time;
      const fmt = this.adapter.normalizeFormat(picker.format());
      const formatted = this.adapter.format(time, fmt);
      this.elementRef.nativeElement.value = formatted;

      const dateObj = this.adapter.toDate(time, fmt, this.originalDate ?? undefined);
      this.originalDate = dateObj;
      this.dateChange.emit(dateObj);

      const emitAsDate = this.valueType() === 'date' || (this.valueType() === 'auto' && this.isDateMode);
      if (emitAsDate) {
        this.onChange(dateObj);
      } else {
        this.onChange(formatted);
      }
      this.timeChange.emit(formatted);
    });
  }

  ngOnDestroy(): void {
    this.timeSetSub?.unsubscribe();
  }

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const raw = (event.target as HTMLInputElement)?.value ?? '';
    const picker = this.ngxMatTimepicker();
    const fmt = this.adapter.normalizeFormat(picker.format());
    this.timeChange.emit(raw);

    const emitAsDate = this.valueType() === 'date' || (this.valueType() === 'auto' && this.isDateMode);
    if (emitAsDate && raw) {
      const parsed = this.adapter.parse(raw, fmt);
      const dateObj = this.adapter.toDate(parsed, fmt, this.originalDate ?? undefined);
      this.originalDate = dateObj;
      this.onChange(dateObj);
      this.dateChange.emit(dateObj);
    } else {
      this.onChange(raw);
    }
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

      const dateObj = this.adapter.toDate(parsed, fmt, this.originalDate ?? undefined);
      this.originalDate = dateObj;
      this.dateChange.emit(dateObj);

      const emitAsDate = this.valueType() === 'date' || (this.valueType() === 'auto' && this.isDateMode);
      if (emitAsDate) {
        this.onChange(dateObj);
      } else {
        this.onChange(formatted);
      }
    }
  }

  writeValue(value: string | Date | TimeValue | null): void {
    if (!value) {
      this.elementRef.nativeElement.value = '';
      this.parsedValue = null;
      this.originalDate = null;
      return;
    }

    if (value instanceof Date) {
      this.isDateMode = true;
      this.originalDate = new Date(value.getTime());
    } else if (typeof value === 'string') {
      this.isDateMode = false;
    }

    const picker = this.ngxMatTimepicker();
    const fmt = this.adapter.normalizeFormat(picker?.format?.() ?? 12);
    const parsed = this.adapter.parse(value, fmt);
    this.parsedValue = parsed;
    this.elementRef.nativeElement.value = this.adapter.format(parsed, fmt);
  }

  registerOnChange(fn: (value: string | Date) => void): void {
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
