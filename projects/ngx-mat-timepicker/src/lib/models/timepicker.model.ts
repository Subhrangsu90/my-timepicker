/**
 * Supported time format options:
 * - `'12h'` or `12`: 12-hour format with AM/PM selection.
 * - `'24h'` or `24`: 24-hour military format with concentric dials.
 */
export type TimeFormat = '12h' | '24h' | 12 | 24;

/**
 * Visual display mode for the timepicker:
 * - `'dial'`: Interactive circular clock dial face.
 * - `'input'`: Accessible numerical text inputs.
 */
export type TimePickerMode = 'dial' | 'input';

/**
 * Layout orientation:
 * - `'vertical'`: Standard portrait view.
 * - `'horizontal'`: Widescreen landscape view.
 * - `'auto'`: Dynamically selected based on screen dimensions.
 */
export type TimePickerOrientation = 'vertical' | 'horizontal' | 'auto';

/**
 * The currently active selection step on the clock dial (`'hour'` or `'minute'`).
 */
export type TimePickerStep = 'hour' | 'minute';

/**
 * Meridiem period designation (`'AM'` or `'PM'`).
 */
export type Period = 'AM' | 'PM';

/**
 * Object representing an extracted or confirmed time value.
 */
export interface TimeValue {
  /** Hour value (1-12 in 12h mode, 0-23 in 24h mode). */
  hour: number;
  /** Minute value (0-59). */
  minute: number;
  /** Meridiem period designation ('AM' or 'PM', omitted in 24h mode). */
  period?: Period;
}

/**
 * Represents a single number position and coordinate on the circular clock face.
 */
export interface ClockDialNumber {
  /** Numeric value of the hour or minute. */
  value: number;
  /** Formatted string representation on the dial. */
  display: string;
  /** Angle in degrees (0 - 360). */
  angle: number;
  /** X coordinate inside the SVG dial. */
  x: number;
  /** Y coordinate inside the SVG dial. */
  y: number;
  /** Whether this number is on the inner concentric ring (used in 24h dial for 13-24/00). */
  isInner?: boolean;
}

/**
 * Global or component-level configuration options for `NgxMatTimepicker`.
 */
export interface TimepickerConfig {
  /** Preferred time format. */
  format?: TimeFormat;
  /** Preferred layout orientation. */
  orientation?: TimePickerOrientation;
  /** Initial mode ('dial' or 'input'). */
  mode?: TimePickerMode;
  /** Minimum selectable time. */
  min?: string | Date;
  /** Maximum selectable time. */
  max?: string | Date;
  /** Minute stepping interval. */
  stepMinute?: number;
  /** Whether to advance from hour to minute automatically. */
  autoAdvance?: boolean;
  /** Custom label for the cancel button. */
  cancelLabel?: string;
  /** Custom label for the OK button. */
  okLabel?: string;
  /** Whether touch UI optimizations are enabled. */
  touchUi?: boolean;
  /** Whether interaction is disabled. */
  disabled?: boolean;
}
