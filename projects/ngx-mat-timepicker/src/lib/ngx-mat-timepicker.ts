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

  readonly format = input<TimeFormat>('12h');
  readonly orientation = input<TimePickerOrientation>('auto');
  readonly stepMinute = input<number>(1);
  readonly autoAdvance = input<boolean>(true);
  readonly cancelLabel = input<string>('');
  readonly okLabel = input<string>('');
  readonly disabled = input<boolean>(false);
  readonly locale = input<string | undefined>(undefined);

  readonly timeSet = output<TimeValue>();
  readonly dateSet = output<Date>();
  readonly closed = output<void>();
  readonly opened = output<void>();

  private overlayRef: OverlayRef | null = null;
  private dialogComponentRef: ComponentRef<NgxMatTimepickerDialog> | null = null;

  readonly isOpen = signal<boolean>(false);
  private currentTimeValue: TimeValue | string | Date | null = null;
  private attachedInput: { getInputValue(): string | Date | TimeValue | null } | null = null;

  /**
   * Registers an input directive associated with this timepicker.
   */
  registerInput(input: { getInputValue(): string | Date | TimeValue | null } | null): void {
    this.attachedInput = input;
  }

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
      this.currentTimeValue = val;
      this.timeSet.emit(val);

      const fmt = this.adapter.normalizeFormat(this.format());
      const baseDate = this.currentTimeValue instanceof Date ? this.currentTimeValue : undefined;
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
