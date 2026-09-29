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
} from './models/timepicker.models';
import { NgxMatTimepickerDialogComponent } from './components/ngx-mat-timepicker-dialog/ngx-mat-timepicker-dialog.component';
import { TimepickerAdapterService } from './services/timepicker-adapter.service';

@Component({
  selector: 'ngx-mat-timepicker',
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
  private adapter = inject(TimepickerAdapterService);

  readonly format = input<TimeFormat>('12h');
  readonly orientation = input<TimePickerOrientation>('auto');
  readonly stepMinute = input<number>(1);
  readonly autoAdvance = input<boolean>(true);
  readonly cancelLabel = input<string>('Cancel');
  readonly okLabel = input<string>('OK');
  readonly disabled = input<boolean>(false);

  readonly timeSet = output<TimeValue>();
  readonly closed = output<void>();
  readonly opened = output<void>();

  private overlayRef: OverlayRef | null = null;
  private dialogComponentRef: ComponentRef<NgxMatTimepickerDialogComponent> | null = null;

  readonly isOpen = signal<boolean>(false);
  private currentTimeValue: TimeValue | string | Date | null = null;

  open(initialValue?: TimeValue | string | Date | null): void {
    if (this.disabled() || this.isOpen()) {
      return;
    }

    if (initialValue !== undefined) {
      this.currentTimeValue = initialValue;
    }

    const overlayConfig = new OverlayConfig({
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-dark-backdrop',
      panelClass: 'ngx-mat-timepicker-overlay-panel',
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
      scrollStrategy: this.overlay.scrollStrategies.block(),
    });

    this.overlayRef = this.overlay.create(overlayConfig);
    const portal = new ComponentPortal(NgxMatTimepickerDialogComponent, this.viewContainerRef);
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

    // Subscriptions
    instance.timeSet.subscribe((val: TimeValue) => {
      this.currentTimeValue = val;
      this.timeSet.emit(val);
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
