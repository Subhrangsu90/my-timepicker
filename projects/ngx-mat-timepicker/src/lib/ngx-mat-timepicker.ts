import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  inject,
  input,
  OnDestroy,
  output,
  signal,
  ViewContainerRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  TimeFormat,
  TimePickerMode,
  TimePickerOrientation,
  TimeValue,
} from './models/timepicker.model';
import { NgxMatTimepickerDialog } from './components/ngx-mat-timepicker-dialog/ngx-mat-timepicker-dialog';
import { TimepickerAdapter } from './services/timepicker-adapter';

/**
 * Component responsible for managing and displaying the Material Design 3 timepicker dialog overlay.
 *
 * It connects to an associated input directive via `[ngxMatTimepicker]` and can be triggered
 * programmatically or through `<ngx-mat-timepicker-toggle>`.
 */
@Component({
  selector: 'ngx-mat-timepicker',
  exportAs: 'ngxMatTimepicker',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ``,
  styles: `
    :host {
      display: none;
    }
  `,
})
export class NgxMatTimepicker implements OnDestroy {
  private overlay = inject(Overlay);
  private viewContainerRef = inject(ViewContainerRef);
  private adapter = inject(TimepickerAdapter);

  /**
   * The time format to display on the dial and parse inputs with.
   * - `'12h'` or `12`: 12-hour format with AM/PM toggle.
   * - `'24h'` or `24`: 24-hour military format with concentric dials (1-12 and 13-24).
   * @default '12h'
   */
  readonly format = input<TimeFormat>('12h');

  /**
   * Layout orientation of the timepicker dialog.
   * - `'auto'`: Dynamically picks landscape or portrait based on viewport aspect ratio.
   * - `'vertical'`: Standard portrait layout with top time tiles and bottom dial.
   * - `'horizontal'`: Widescreen landscape layout with side-by-side time display and dial.
   * @default 'auto'
   */
  readonly orientation = input<TimePickerOrientation>('auto');

  /**
   * Step increment for minute selection on the clock dial (e.g., 1, 5, 10, 15).
   * @default 1
   */
  readonly stepMinute = input<number>(1);

  /**
   * Whether selecting an hour on the dial automatically advances the view to minute selection.
   * @default true
   */
  readonly autoAdvance = input<boolean>(true);

  /**
   * Custom label for the cancel button in the dialog action bar.
   * If not set, falls back to `NgxMatTimepickerIntl.cancelLabel`.
   */
  readonly cancelLabel = input<string>('');

  /**
   * Custom label for the confirmation/OK button in the dialog action bar.
   * If not set, falls back to `NgxMatTimepickerIntl.okLabel`.
   */
  readonly okLabel = input<string>('');

  /**
   * Whether the timepicker is disabled from opening.
   * @default false
   */
  readonly disabled = input<boolean>(false);

  /**
   * BCP-47 locale identifier used for date/number formatting and localized AM/PM periods (e.g. `'es-ES'`).
   * If omitted, the application-wide locale or DateAdapter locale is used.
   */
  readonly locale = input<string | undefined>(undefined);

  /**
   * Emits the confirmed `TimeValue` object ({ hour, minute, period }) when the user accepts a time.
   */
  readonly timeSet = output<TimeValue>();

  /**
   * Emits the confirmed time as a native JavaScript `Date` instance with hours and minutes set,
   * preserving the date component and local timezone.
   */
  readonly dateSet = output<Date>();

  /**
   * Emits when the timepicker dialog overlay has closed.
   */
  readonly closed = output<void>();

  /**
   * Emits when the timepicker dialog overlay has opened.
   */
  readonly opened = output<void>();

  private overlayRef: OverlayRef | null = null;
  private dialogComponentRef: ComponentRef<NgxMatTimepickerDialog> | null = null;

  /**
   * Signal indicating whether the timepicker dialog overlay is currently open and visible.
   */
  readonly isOpen = signal<boolean>(false);

  private currentTimeValue: TimeValue | string | Date | null = null;
  private attachedInput: { getInputValue(): string | Date | TimeValue | null } | null = null;

  /**
   * Registers an input directive associated with this timepicker.
   * Called automatically by `NgxMatTimepickerInput`.
   * @param input The input directive instance or null when unregistering.
   */
  registerInput(input: { getInputValue(): string | Date | TimeValue | null } | null): void {
    this.attachedInput = input;
  }

  /**
   * Opens the timepicker dialog overlay.
   * If an initial value is provided, it seeds the dialog. Otherwise, it retrieves the
   * current value from the registered input.
   * @param initialValue Optional initial time to display in the dialog.
   */
  open(initialValue?: TimeValue | string | Date | null): void {
    if (this.disabled() || this.isOpen()) {
      return;
    }

    if (initialValue !== undefined && initialValue !== null) {
      this.currentTimeValue = initialValue;
    } else if (this.attachedInput) {
      const currentInputVal = this.attachedInput.getInputValue();
      if (currentInputVal !== null && currentInputVal !== undefined && currentInputVal !== '') {
        this.currentTimeValue = currentInputVal;
      }
    }

    const overlayConfig = new OverlayConfig({
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-dark-backdrop',
      panelClass: 'ngx-mat-timepicker-overlay-panel',
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
      scrollStrategy: this.overlay.scrollStrategies.block(),
    });

    this.overlayRef = this.overlay.create(overlayConfig);
    const portal = new ComponentPortal(NgxMatTimepickerDialog, this.viewContainerRef);
    this.dialogComponentRef = this.overlayRef.attach(portal);

    // Bind inputs to dialog instance
    const instance = this.dialogComponentRef.instance;
    this.dialogComponentRef.setInput('initialTime', this.currentTimeValue);
    this.dialogComponentRef.setInput('format', this.format());
    this.dialogComponentRef.setInput('orientation', this.orientation());
    this.dialogComponentRef.setInput('stepMinute', this.stepMinute());
    this.dialogComponentRef.setInput('autoAdvance', this.autoAdvance());
    this.dialogComponentRef.setInput('cancelLabel', this.cancelLabel());
    this.dialogComponentRef.setInput('okLabel', this.okLabel());
    this.dialogComponentRef.setInput('locale', this.locale());

    // Subscriptions
    instance.timeSet.subscribe((val: TimeValue) => {
      const baseDate = this.currentTimeValue instanceof Date ? this.currentTimeValue : undefined;
      this.currentTimeValue = val;
      this.timeSet.emit(val);

      const fmt = this.adapter.normalizeFormat(this.format());
      const dateObj = this.adapter.toDate(val, fmt, baseDate);
      this.dateSet.emit(dateObj);
    });

    instance.dialogClosed.subscribe(() => {
      this.close();
    });

    this.overlayRef.backdropClick().subscribe(() => {
      this.close();
    });

    this.isOpen.set(true);
    this.opened.emit();
  }

  /**
   * Closes the timepicker dialog overlay and destroys the active CDK overlay instance.
   */
  close(): void {
    if (!this.isOpen()) {
      return;
    }

    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
      this.dialogComponentRef = null;
    }

    this.isOpen.set(false);
    this.closed.emit();
  }

  ngOnDestroy(): void {
    this.close();
  }
}
