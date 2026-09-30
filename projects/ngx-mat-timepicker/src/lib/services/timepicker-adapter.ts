import { inject, Injectable, LOCALE_ID } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDateFormats } from '@angular/material/core';
import { Period, TimeFormat, TimeValue } from '../models/timepicker.model';
import { NgxMatTimepickerIntl } from './timepicker-intl';

@Injectable({
  providedIn: 'root',
})
export class TimepickerAdapter {
  private _dateAdapter = inject<DateAdapter<unknown> | null>(DateAdapter, { optional: true });
  private _matDateLocale = inject<string | null>(MAT_DATE_LOCALE, { optional: true });
  private _dateFormats = inject<MatDateFormats | null>(MAT_DATE_FORMATS, { optional: true });
  private _localeId = inject(LOCALE_ID);
  private _intl = inject(NgxMatTimepickerIntl);

  /**
   * Returns active locale code (from DateAdapter, MAT_DATE_LOCALE, or LOCALE_ID)
   */
  getLocale(): string {
    if (this._dateAdapter) {
      const adapterLocale = (this._dateAdapter as unknown as { locale?: string }).locale;
      if (adapterLocale) return adapterLocale;
    }
    return this._matDateLocale || this._localeId || 'en-US';
  }

  /**
   * Normalizes the format to 12 or 24
   */
  normalizeFormat(format: TimeFormat | undefined): 12 | 24 {
    if (format === '24h' || format === 24) {
      return 24;
    }
    return 12;
  }

  /**
   * Retrieves localized AM/PM labels for the given or active locale
   */
  getPeriodLabels(locale?: string): { am: string; pm: string } {
    const loc = locale || this.getLocale();
    try {
      // Use Intl to extract localized AM/PM designations
      const formatter = new Intl.DateTimeFormat(loc, { hour: 'numeric', hour12: true });
      const amDate = new Date(2026, 0, 1, 9, 0, 0); // 9:00 AM
      const pmDate = new Date(2026, 0, 1, 21, 0, 0); // 9:00 PM

      const amParts = formatter.formatToParts(amDate);
      const pmParts = formatter.formatToParts(pmDate);

      const amPart = amParts.find((p) => p.type === 'dayPeriod')?.value;
      const pmPart = pmParts.find((p) => p.type === 'dayPeriod')?.value;

      return {
        am: amPart || this._intl.amLabel,
        pm: pmPart || this._intl.pmLabel,
      };
    } catch {
      return {
        am: this._intl.amLabel,
        pm: this._intl.pmLabel,
      };
    }
  }

  /**
   * Parse input value (string, Date, DateAdapter date instance, or TimeValue) to TimeValue
   */
  parse(value: unknown, format: 12 | 24 = 12): TimeValue {
    if (!value) {
      return this.fromDateTime(new Date(), format);
    }

    // Check if input is supported by DateAdapter (Moment, Luxon, DateFns, etc.)
    if (this._dateAdapter && this._dateAdapter.isDateInstance(value)) {
      const rawHour = (this._dateAdapter as unknown as { getHours?: (d: unknown) => number }).getHours?.(value) ??
        (value instanceof Date ? value.getHours() : 0);
      const rawMinute = (this._dateAdapter as unknown as { getMinutes?: (d: unknown) => number }).getMinutes?.(value) ??
        (value instanceof Date ? value.getMinutes() : 0);
      return this.fromHourMinute(rawHour, rawMinute, format);
    }

    if (value instanceof Date) {
      return this.fromDateTime(value, format);
    }

    if (typeof value === 'object' && value !== null && 'hour' in value && 'minute' in value) {
      return this.normalizeTimeValue(value as TimeValue, format);
    }

    if (typeof value === 'string') {
      const trimmed = value.trim();
      const periods = this.getPeriodLabels();

      // Flexible regex accepting English or localized period strings (AM/PM, a.m./p.m., 오전/오후, etc.)
      const match = trimmed.match(/^(\d{1,2})[:.](\d{2})(?:\s*(.+))?$/);
      if (match) {
        let hour = parseInt(match[1], 10);
        const minute = parseInt(match[2], 10);
        const periodStr = match[3]?.trim();

        let period: Period | undefined = undefined;
        if (periodStr) {
          const upper = periodStr.toUpperCase();
          if (
            upper.includes('P') ||
            upper.includes('PM') ||
            upper.includes(periods.pm.toUpperCase())
          ) {
            period = 'PM';
          } else {
            period = 'AM';
          }
        }

        if (format === 12) {
          if (!period) {
            period = hour >= 12 ? 'PM' : 'AM';
            hour = hour % 12 || 12;
          } else {
            hour = hour % 12 || 12;
          }
          return { hour, minute, period };
        } else {
          // 24h format
          if (period) {
            if (period === 'PM' && hour < 12) hour += 12;
            if (period === 'AM' && hour === 12) hour = 0;
          }
          return { hour: Math.min(23, Math.max(0, hour)), minute: Math.min(59, Math.max(0, minute)) };
        }
      }
    }

    return this.fromDateTime(new Date(), format);
  }

  /**
   * Convert hour (0..23) and minute (0..59) to TimeValue
   */
  fromHourMinute(rawHours: number, minutes: number, format: 12 | 24): TimeValue {
    if (format === 24) {
      return { hour: rawHours, minute: minutes };
    }
    const period: Period = rawHours >= 12 ? 'PM' : 'AM';
    const hour = rawHours % 12 || 12;
    return { hour, minute: minutes, period };
  }

  /**
   * Convert a Date object to TimeValue
   */
  fromDateTime(date: Date, format: 12 | 24): TimeValue {
    return this.fromHourMinute(date.getHours(), date.getMinutes(), format);
  }

  /**
   * Convert TimeValue to formatted display string with localization support
   */
  format(time: TimeValue, format: 12 | 24, locale?: string): string {
    const paddedMinute = time.minute.toString().padStart(2, '0');

    if (format === 24) {
      const paddedHour = time.hour.toString().padStart(2, '0');
      return `${paddedHour}:${paddedMinute}`;
    }

    const paddedHour = time.hour.toString().padStart(2, '0');
    const periods = this.getPeriodLabels(locale);
    const periodLabel = time.period === 'PM' ? periods.pm : periods.am;
    return `${paddedHour}:${paddedMinute} ${periodLabel}`;
  }

  /**
   * Converts a 12-hour or 24-hour TimeValue into total minutes from start of day (0..1439)
   */
  toMinutesOfDay(time: TimeValue, format: 12 | 24): number {
    let hour = time.hour;
    if (format === 12) {
      const period = time.period ?? 'AM';
      if (period === 'PM' && hour < 12) hour += 12;
      if (period === 'AM' && hour === 12) hour = 0;
    }
    return hour * 60 + time.minute;
  }

  /**
   * Check if a time value is within min and max boundaries
   */
  isWithinRange(
    time: TimeValue,
    format: 12 | 24,
    min?: string | Date,
    max?: string | Date
  ): boolean {
    const timeMinutes = this.toMinutesOfDay(time, format);

    if (min) {
      const minVal = this.parse(min, format);
      const minMinutes = this.toMinutesOfDay(minVal, format);
      if (timeMinutes < minMinutes) return false;
    }

    if (max) {
      const maxVal = this.parse(max, format);
      const maxMinutes = this.toMinutesOfDay(maxVal, format);
      if (timeMinutes > maxMinutes) return false;
    }

    return true;
  }

  /**
   * Convert 24-hour hour into 12-hour representation with period
   */
  to12Hour(hour24: number): { hour: number; period: Period } {
    const period: Period = hour24 >= 12 ? 'PM' : 'AM';
    const hour = hour24 % 12 || 12;
    return { hour, period };
  }

  /**
   * Convert 12-hour hour and period into 24-hour hour
   */
  to24Hour(hour12: number, period: Period): number {
    let hour = hour12 % 12;
    if (period === 'PM') hour += 12;
    return hour;
  }

  private normalizeTimeValue(value: TimeValue, format: 12 | 24): TimeValue {
    let hour = value.hour;
    const minute = Math.min(59, Math.max(0, value.minute));

    if (format === 12) {
      let period = value.period ?? 'AM';
      if (hour > 12) {
        period = 'PM';
        hour = hour % 12 || 12;
      } else if (hour === 0) {
        hour = 12;
      }
      return { hour, minute, period };
    }

    return { hour: Math.min(23, Math.max(0, hour)), minute };
  }

  /**
   * Convert a TimeValue to a JavaScript Date object, applying hours and minutes to a base Date
   * (or today's date if omitted). Preserves the local timezone (e.g. GMT+0530).
   */
  toDate(time: TimeValue, format: 12 | 24 = 12, baseDate?: Date): Date {
    const d = baseDate ? new Date(baseDate.getTime()) : new Date();
    let hours = time.hour;
    if (format === 12) {
      hours = this.to24Hour(time.hour, time.period ?? 'AM');
    }
    d.setHours(hours, time.minute, 0, 0);
    return d;
  }
}

/** @deprecated Use `TimepickerAdapter` instead. */
export { TimepickerAdapter as TimepickerAdapterService };
