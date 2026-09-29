import { Injectable } from '@angular/core';
import { Period, TimeFormat, TimeValue } from '../models/timepicker.models';

@Injectable({
  providedIn: 'root',
})
export class TimepickerAdapterService {
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
   * Parse input value (string, Date, or TimeValue) to TimeValue
   */
  parse(value: string | Date | TimeValue | null | undefined, format: 12 | 24 = 12): TimeValue {
    if (!value) {
      const now = new Date();
      return this.fromDateTime(now, format);
    }

    if (value instanceof Date) {
      return this.fromDateTime(value, format);
    }

    if (typeof value === 'object' && 'hour' in value && 'minute' in value) {
      return this.normalizeTimeValue(value, format);
    }

    if (typeof value === 'string') {
      const trimmed = value.trim();
      // Match patterns like "07:30", "7:30 PM", "14:25", "11:00am"
      const match = trimmed.match(/^(\d{1,2}):(\d{2})(?:\s*([aApP][mM]))?$/);
      if (match) {
        let hour = parseInt(match[1], 10);
        const minute = parseInt(match[2], 10);
        let period: Period | undefined = match[3] ? (match[3].toUpperCase() as Period) : undefined;

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
   * Convert a Date object to TimeValue
   */
  fromDateTime(date: Date, format: 12 | 24): TimeValue {
    const rawHours = date.getHours();
    const minutes = date.getMinutes();

    if (format === 24) {
      return { hour: rawHours, minute: minutes };
    }

    const period: Period = rawHours >= 12 ? 'PM' : 'AM';
    const hour = rawHours % 12 || 12;
    return { hour, minute: minutes, period };
  }

  /**
   * Convert TimeValue to formatted display string
   */
  format(time: TimeValue, format: 12 | 24): string {
    const paddedMinute = time.minute.toString().padStart(2, '0');

    if (format === 24) {
      const paddedHour = time.hour.toString().padStart(2, '0');
      return `${paddedHour}:${paddedMinute}`;
    }

    const paddedHour = time.hour.toString().padStart(2, '0');
    const period = time.period ?? 'AM';
    return `${paddedHour}:${paddedMinute} ${period}`;
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
}
