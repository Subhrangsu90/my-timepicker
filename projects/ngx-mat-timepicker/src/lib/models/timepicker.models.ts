export type TimeFormat = '12h' | '24h' | 12 | 24;

export type TimePickerMode = 'dial' | 'input';

export type TimePickerOrientation = 'vertical' | 'horizontal' | 'auto';

export type TimePickerStep = 'hour' | 'minute';

export type Period = 'AM' | 'PM';

export interface TimeValue {
  hour: number;
  minute: number;
  period?: Period;
}

export interface ClockDialNumber {
  value: number;
  display: string;
  angle: number;
  x: number;
  y: number;
  isInner?: boolean;
}

export interface TimepickerConfig {
  format?: TimeFormat;
  orientation?: TimePickerOrientation;
  mode?: TimePickerMode;
  min?: string | Date;
  max?: string | Date;
  stepMinute?: number;
  autoAdvance?: boolean;
  cancelLabel?: string;
  okLabel?: string;
  touchUi?: boolean;
  disabled?: boolean;
}
