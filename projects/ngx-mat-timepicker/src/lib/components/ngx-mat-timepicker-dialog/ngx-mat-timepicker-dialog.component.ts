import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { A11yModule } from '@angular/cdk/a11y';
import {
  Period,
  TimeFormat,
  TimePickerMode,
  TimePickerOrientation,
  TimePickerStep,
  TimeValue,
} from '../../models/timepicker.models';
import { TimepickerAdapterService } from '../../services/timepicker-adapter.service';
import { TimepickerA11yService } from '../../services/timepicker-a11y.service';
import { NgxMatTimeDisplayComponent } from '../time-display/time-display.component';
import { NgxMatPeriodToggleComponent } from '../period-toggle/period-toggle.component';
import { NgxMatClockDialComponent } from '../clock-dial/clock-dial.component';
import { NgxMatTimeInputsComponent } from '../time-inputs/time-inputs.component';
import { NgxMatActionBarComponent } from '../action-bar/action-bar.component';

@Component({
  selector: 'ngx-mat-timepicker-dialog',
  standalone: true,
  imports: [
    CommonModule,
    A11yModule,
    NgxMatTimeDisplayComponent,
    NgxMatPeriodToggleComponent,
    NgxMatClockDialComponent,
    NgxMatTimeInputsComponent,
    NgxMatActionBarComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="timepicker-dialog"
      [class.horizontal-layout]="isLandscape()"
      cdkTrapFocus
      cdkTrapFocusAutoCapture
      role="dialog"
      aria-modal="true"
      aria-labelledby="tp-dialog-title"
      (keydown.escape)="onCancel()"
    >
      <!-- Headline / Title -->
      <div class="dialog-header">
        <span id="tp-dialog-title" class="dialog-headline">
          {{ mode() === 'dial' ? 'Select time' : 'Enter time' }}
        </span>
      </div>

      <!-- Main Content Area -->
      <div class="dialog-content" [class.horizontal-content]="isLandscape()">
        <!-- Left / Top Column: Time Display and Period Toggle -->
        <div class="display-column" [class.horizontal-display-col]="isLandscape()">
          <!-- Dial Mode: Time Display -->
          @if (mode() === 'dial') {
            <div class="display-and-period" [class.horizontal-period-below]="isLandscape()">
              <ngx-mat-time-display
                [hour]="currentHour()"
                [minute]="currentMinute()"
                [period]="currentPeriod()"
                [activeStep]="activeStep()"
                [mode]="mode()"
                [is24Hour]="is24Hour()"
                (stepChange)="onStepChange($event)"
              />

              <!-- Period Selector (if 12h) -->
              @if (!is24Hour()) {
                <div class="period-toggle-holder">
                  <ngx-mat-period-toggle
                    [period]="currentPeriod() ?? 'AM'"
                    [orientation]="isLandscape() ? 'horizontal' : 'vertical'"
                    (periodChange)="onPeriodChange($event)"
                  />
                </div>
              }
            </div>
          } @else {
            <!-- Input Mode: Interactive Inputs with Period Selector -->
            <div class="inputs-and-period" [class.horizontal-period-below]="isLandscape()">
              <ngx-mat-time-inputs
                [hour]="currentHour()"
                [minute]="currentMinute()"
                [period]="currentPeriod()"
                [is24Hour]="is24Hour()"
                (hourChange)="onHourValChange($event)"
                (minuteChange)="onMinuteValChange($event)"
              />

              @if (!is24Hour()) {
                <div class="period-toggle-holder">
                  <ngx-mat-period-toggle
                    [period]="currentPeriod() ?? 'AM'"
                    [orientation]="isLandscape() ? 'horizontal' : 'vertical'"
                    (periodChange)="onPeriodChange($event)"
                  />
                </div>
              }
            </div>
          }
        </div>

        <!-- Right / Bottom Area: Clock Dial (only in Dial mode) -->
        @if (mode() === 'dial') {
          <div class="dial-column">
            <ngx-mat-clock-dial
              [step]="activeStep()"
              [hour]="currentHour()"
              [minute]="currentMinute()"
              [period]="currentPeriod()"
              [is24Hour]="is24Hour()"
              [stepMinute]="stepMinute()"
              [autoAdvance]="autoAdvance()"
              (valueChange)="onDialValueChange($event)"
              (autoAdvanceStep)="onAutoAdvance()"
            />
          </div>
        }
      </div>

      <!-- Action Bar -->
      <ngx-mat-action-bar
        [mode]="mode()"
        [cancelLabel]="cancelLabel()"
        [okLabel]="okLabel()"
        (modeToggle)="toggleMode()"
        (cancel)="onCancel()"
        (confirm)="onConfirm()"
      />
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .timepicker-dialog {
      background-color: var(--ngx-mat-tp-container-bg, #ece6f0);
      border-radius: var(--ngx-mat-tp-container-shape, 28px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.14), 0 4px 6px rgba(0, 0, 0, 0.08);
      width: 328px;
      padding: 0;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      overflow: hidden;

      &.horizontal-layout {
        width: 568px;
      }
    }

    .dialog-header {
      padding: 24px 24px 20px 24px;
    }

    .dialog-headline {
      font-family: var(--mat-sys-typescale-label-medium-font, 'Roboto', sans-serif);
      font-size: 14px;
      line-height: 20px;
      font-weight: 500;
      letter-spacing: 0.1px;
      color: var(--ngx-mat-tp-headline-color, #49454f);
      user-select: none;
    }

    .dialog-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0 24px 16px 24px;
      box-sizing: border-box;

      &.horizontal-content {
        flex-direction: row;
        align-items: center;
        justify-content: space-around;
        padding: 0 24px 16px 24px;
      }
    }

    .display-column {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 24px;

      &.horizontal-display-col {
        margin-bottom: 0;
      }
    }

    .display-and-period,
    .inputs-and-period {
      display: flex;
      align-items: flex-start;
      gap: 12px;

      &.horizontal-period-below {
        flex-direction: column;
        align-items: center;
        gap: 16px;
      }
    }

    .period-toggle-holder {
      display: flex;
      align-items: center;
    }

    .dial-column {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `,
})
export class NgxMatTimepickerDialogComponent implements OnInit {
  private adapter = inject(TimepickerAdapterService);
  private a11y = inject(TimepickerA11yService);

  readonly initialTime = input<TimeValue | string | Date | null>(null);
  readonly format = input<TimeFormat>('12h');
  readonly orientation = input<TimePickerOrientation>('auto');
  readonly stepMinute = input<number>(1);
  readonly autoAdvance = input<boolean>(true);
  readonly cancelLabel = input<string>('Cancel');
  readonly okLabel = input<string>('OK');

  readonly timeSet = output<TimeValue>();
  readonly dialogClosed = output<void>();

  readonly mode = signal<TimePickerMode>('dial');
  readonly activeStep = signal<TimePickerStep>('hour');

  readonly currentHour = signal<number>(7);
  readonly currentMinute = signal<number>(0);
  readonly currentPeriod = signal<Period | undefined>('AM');

  readonly is24Hour = computed(() => {
    return this.adapter.normalizeFormat(this.format()) === 24;
  });

  readonly isLandscape = computed(() => {
    const ori = this.orientation();
    if (ori === 'horizontal') return true;
    if (ori === 'vertical') return false;
    // 'auto' detects viewport orientation
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(min-width: 600px) and (orientation: landscape)').matches;
    }
    return false;
  });

  ngOnInit(): void {
    const fmt = this.adapter.normalizeFormat(this.format());
    const parsed = this.adapter.parse(this.initialTime(), fmt);
    this.currentHour.set(parsed.hour);
    this.currentMinute.set(parsed.minute);
    this.currentPeriod.set(parsed.period);
  }

  onStepChange(step: TimePickerStep): void {
    this.activeStep.set(step);
    this.a11y.announceStep(step);
  }

  onPeriodChange(period: Period): void {
    this.currentPeriod.set(period);
  }

  onDialValueChange(event: { step: TimePickerStep; value: number }): void {
    if (event.step === 'hour') {
      this.currentHour.set(event.value);
    } else {
      this.currentMinute.set(event.value);
    }
  }

  onAutoAdvance(): void {
    if (this.activeStep() === 'hour') {
      this.activeStep.set('minute');
      this.a11y.announceStep('minute');
    }
  }

  onHourValChange(h: number): void {
    this.currentHour.set(h);
  }

  onMinuteValChange(m: number): void {
    this.currentMinute.set(m);
  }

  toggleMode(): void {
    const next = this.mode() === 'dial' ? 'input' : 'dial';
    this.mode.set(next);
  }

  onCancel(): void {
    this.dialogClosed.emit();
  }

  onConfirm(): void {
    const result: TimeValue = {
      hour: this.currentHour(),
      minute: this.currentMinute(),
      period: this.is24Hour() ? undefined : (this.currentPeriod() ?? 'AM'),
    };
    this.timeSet.emit(result);
    this.dialogClosed.emit();
  }
}
