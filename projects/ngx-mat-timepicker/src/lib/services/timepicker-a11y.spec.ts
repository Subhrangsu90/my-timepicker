import { TestBed } from '@angular/core/testing';
import { TimepickerA11y } from './timepicker-a11y';

describe('TimepickerA11y', () => {
  let service: TimepickerA11y;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimepickerA11y);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('handleStepKeyboardNav for hours', () => {
    it('should increment hour with ArrowUp in 12h format', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      const next = service.handleStepKeyboardNav(event, 7, 'hour', 12);
      expect(next).toBe(8);
    });

    it('should wrap 12 to 1 with ArrowUp in 12h format', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      const next = service.handleStepKeyboardNav(event, 12, 'hour', 12);
      expect(next).toBe(1);
    });

    it('should decrement hour with ArrowDown in 12h format', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      const next = service.handleStepKeyboardNav(event, 7, 'hour', 12);
      expect(next).toBe(6);
    });

    it('should wrap 1 to 12 with ArrowDown in 12h format', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      const next = service.handleStepKeyboardNav(event, 1, 'hour', 12);
      expect(next).toBe(12);
    });

    it('should increment hour with ArrowRight in 24h format', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      const next = service.handleStepKeyboardNav(event, 23, 'hour', 24);
      expect(next).toBe(0);
    });

    it('should jump to min/max with Home/End in 12h format', () => {
      const homeEvent = new KeyboardEvent('keydown', { key: 'Home' });
      const endEvent = new KeyboardEvent('keydown', { key: 'End' });

      expect(service.handleStepKeyboardNav(homeEvent, 7, 'hour', 12)).toBe(1);
      expect(service.handleStepKeyboardNav(endEvent, 7, 'hour', 12)).toBe(12);
    });

    it('should jump to min/max with Home/End in 24h format', () => {
      const homeEvent = new KeyboardEvent('keydown', { key: 'Home' });
      const endEvent = new KeyboardEvent('keydown', { key: 'End' });

      expect(service.handleStepKeyboardNav(homeEvent, 15, 'hour', 24)).toBe(0);
      expect(service.handleStepKeyboardNav(endEvent, 15, 'hour', 24)).toBe(23);
    });
  });

  describe('handleStepKeyboardNav for minutes', () => {
    it('should increment minute by step with ArrowUp', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      const next = service.handleStepKeyboardNav(event, 15, 'minute', 12, 1);
      expect(next).toBe(16);
    });

    it('should increment minute by 5 with PageUp', () => {
      const event = new KeyboardEvent('keydown', { key: 'PageUp' });
      const next = service.handleStepKeyboardNav(event, 15, 'minute', 12);
      expect(next).toBe(20);
    });

    it('should decrement minute by 5 with PageDown', () => {
      const event = new KeyboardEvent('keydown', { key: 'PageDown' });
      const next = service.handleStepKeyboardNav(event, 15, 'minute', 12);
      expect(next).toBe(10);
    });

    it('should wrap 59 to 0 with ArrowUp', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      const next = service.handleStepKeyboardNav(event, 59, 'minute', 12, 1);
      expect(next).toBe(0);
    });

    it('should wrap 0 to 59 with ArrowDown', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      const next = service.handleStepKeyboardNav(event, 0, 'minute', 12, 1);
      expect(next).toBe(59);
    });
  });
});
