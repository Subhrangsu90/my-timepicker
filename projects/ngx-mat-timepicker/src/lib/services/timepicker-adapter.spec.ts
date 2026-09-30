import { TestBed } from '@angular/core/testing';
import { TimepickerAdapter } from './timepicker-adapter';

describe('TimepickerAdapter', () => {
  let service: TimepickerAdapter;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimepickerAdapter);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('normalizeFormat', () => {
    it('should return 24 for 24h format', () => {
      expect(service.normalizeFormat('24h')).toBe(24);
      expect(service.normalizeFormat(24)).toBe(24);
    });

    it('should return 12 for 12h format or undefined', () => {
      expect(service.normalizeFormat('12h')).toBe(12);
      expect(service.normalizeFormat(12)).toBe(12);
      expect(service.normalizeFormat(undefined)).toBe(12);
    });
  });

  describe('parse', () => {
    it('should parse 12-hour string with AM/PM', () => {
      const result = service.parse('07:30 PM', 12);
      expect(result.hour).toBe(7);
      expect(result.minute).toBe(30);
      expect(result.period).toBe('PM');
    });

    it('should parse 24-hour string', () => {
      const result = service.parse('19:45', 24);
      expect(result.hour).toBe(19);
      expect(result.minute).toBe(45);
    });

    it('should convert 24h to 12h with PM period if 12h format requested', () => {
      const result = service.parse('14:15', 12);
      expect(result.hour).toBe(2);
      expect(result.minute).toBe(15);
      expect(result.period).toBe('PM');
    });

    it('should handle 00:00 in 12h format as 12:00 AM', () => {
      const result = service.parse('00:00', 12);
      expect(result.hour).toBe(12);
      expect(result.minute).toBe(0);
      expect(result.period).toBe('AM');
    });
  });

  describe('format', () => {
    it('should format 12h time with period', () => {
      const str = service.format({ hour: 7, minute: 5, period: 'AM' }, 12);
      expect(str).toBe('07:05 AM');
    });

    it('should format 24h time without period', () => {
      const str = service.format({ hour: 20, minute: 0 }, 24);
      expect(str).toBe('20:00');
    });
  });

  describe('conversions', () => {
    it('should convert 24-hour to 12-hour', () => {
      expect(service.to12Hour(20)).toEqual({ hour: 8, period: 'PM' });
      expect(service.to12Hour(0)).toEqual({ hour: 12, period: 'AM' });
      expect(service.to12Hour(12)).toEqual({ hour: 12, period: 'PM' });
      expect(service.to12Hour(9)).toEqual({ hour: 9, period: 'AM' });
    });

    it('should convert 12-hour to 24-hour', () => {
      expect(service.to24Hour(8, 'PM')).toBe(20);
      expect(service.to24Hour(12, 'AM')).toBe(0);
      expect(service.to24Hour(12, 'PM')).toBe(12);
      expect(service.to24Hour(9, 'AM')).toBe(9);
    });
  });

  describe('toDate', () => {
    it('should convert 12h midnight (12:00 AM) to 00:00:00 Date', () => {
      const base = new Date(2026, 8, 30); // 30 Sep 2026
      const date = service.toDate({ hour: 12, minute: 0, period: 'AM' }, 12, base);
      expect(date.getHours()).toBe(0);
      expect(date.getMinutes()).toBe(0);
      expect(date.getSeconds()).toBe(0);
      expect(date.getFullYear()).toBe(2026);
    });

    it('should convert 24h midnight (00:00) to 00:00:00 Date', () => {
      const base = new Date(2026, 8, 30);
      const date = service.toDate({ hour: 0, minute: 0 }, 24, base);
      expect(date.getHours()).toBe(0);
      expect(date.getMinutes()).toBe(0);
      expect(date.getSeconds()).toBe(0);
    });

    it('should convert 12h PM time (11:30 PM) to 23:30 Date', () => {
      const date = service.toDate({ hour: 11, minute: 30, period: 'PM' }, 12);
      expect(date.getHours()).toBe(23);
      expect(date.getMinutes()).toBe(30);
    });
  });
});
