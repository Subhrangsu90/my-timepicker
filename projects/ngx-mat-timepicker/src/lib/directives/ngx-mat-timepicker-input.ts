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
import { TimepickerAdapter } from '../services/timepicker-adapter';
import { TimeValue } from '../models/timepicker.model';

/**
 * Directive that connects a native text `<input>` element with an `NgxMatTimepicker`.
 *
 * Implements `ControlValueAccessor` to seamlessly support Angular Reactive Forms
 * (`[formControl]`) and Template-Driven Forms (`[(ngModel)]`).
 */
@Directive({
  selector: 'input[ngxMatTimepicker]',
  exportAs: 'ngxMatTimepickerInput',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxMatTimepickerInput),
      multi: true,
    },
  ],
})
export class NgxMatTimepickerInput implements ControlValueAccessor, OnInit, OnDestroy {
  private elementRef = inject(ElementRef<HTMLInputElement>);
  private adapter = inject(TimepickerAdapter);

  /**
   * The `NgxMatTimepicker` instance associated with this input element.
   */
  readonly ngxMatTimepicker = input.required<NgxMatTimepicker>();

  /**
   * The format of the value emitted to the attached form control.
   * - `'auto'`: Automatically detects whether to emit a string or native `Date` object based on initial value.
   * - `'string'`: Always emits formatted time strings (e.g. `'07:00 AM'`).
   * - `'date'`: Always emits a native JavaScript `Date` instance with time components updated.
   * @default 'auto'
   */
  readonly valueType = input<'auto' | 'string' | 'date'>('auto');

  /**
   * Emits whenever the raw text value of the input changes.
   */
  readonly timeChange = output<string>();

  /**
   * Emits whenever the time changes, represented as an updated JavaScript `Date` instance.
   */
  readonly dateChange = output<Date>();

  private onChange: (value: string | Date) => void = () => {};
  private onTouched: () => void = () => {};

  private timeSetSub: { unsubscribe(): void } | null = null;
  private parsedValue: TimeValue | null = null;
  private originalDate: Date | null = null;
  private isDateMode = false;

  /**
   * Initializes the input directive, registers with the timepicker, and subscribes to time confirmations.
   */
  ngOnInit(): void {
    const picker = this.ngxMatTimepicker();
    picker.registerInput(this);

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

  /**
   * Cleans up time subscriptions and unregisters from the associated timepicker instance.
   */
  ngOnDestroy(): void {
    this.timeSetSub?.unsubscribe();
    const picker = this.ngxMatTimepicker();
    if (picker) {
      picker.registerInput(null);
    }
  }

  /**
   * Handles user keystroke input events on the native text field.
   * @param event The native input Event.
   */
  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const raw = (event.target as HTMLInputElement)?.value ?? '';
    const picker = this.ngxMatTimepicker();
    const fmt = this.adapter.normalizeFormat(picker.format());
    this.timeChange.emit(raw);

    if (raw.trim()) {
      try {
        this.parsedValue = this.adapter.parse(raw.trim(), fmt);
      } catch {
        // Ignore parsing errors while user is actively typing
      }
    } else {
      this.parsedValue = null;
    }

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

  /**
   * Handles blur events to format the final entered text according to the active time format.
   */
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

  /**
   * Sets the input's value programmatically (from Angular form bindings).
   * @param value A string, native Date object, or TimeValue.
   */
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

  /**
   * Registers a callback function to be executed when the form control value changes.
   * @param fn The callback function.
   */
  registerOnChange(fn: (value: string | Date) => void): void {
    this.onChange = fn;
  }

  /**
   * Registers a callback function to be executed when the input field is blurred.
   * @param fn The callback function.
   */
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /**
   * Disables or enables the native `<input>` element when the form control status changes.
   * @param isDisabled Whether the control is disabled.
   */
  setDisabledState(isDisabled: boolean): void {
    this.elementRef.nativeElement.disabled = isDisabled;
  }

  /**
   * Retrieves the current input value (from native input text, cached Date, or parsed TimeValue).
   * Used by `NgxMatTimepicker` to synchronize the dialog when opened.
   */
  getInputValue(): string | Date | TimeValue | null {
    const raw = this.elementRef.nativeElement.value?.trim();
    if (raw) {
      return raw;
    }
    if (this.originalDate) {
      return this.originalDate;
    }
    return this.parsedValue;
  }

  /**
   * Retrieves the parsed `TimeValue` representation of the current input value.
   */
  getParsedValue(): TimeValue | null {
    return this.parsedValue;
  }
}

/** @deprecated Use `NgxMatTimepickerInput` instead. */
export { NgxMatTimepickerInput as NgxMatTimepickerInputDirective };
