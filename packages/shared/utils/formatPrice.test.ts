import { describe, it, expect } from 'vitest';
import { formatPaiseToINR } from './formatPrice';

describe('formatPaiseToINR', () => {
  it('formats paise to INR currency string', () => {
    expect(formatPaiseToINR(118000)).toBe('₹1,180.00');
    expect(formatPaiseToINR(0)).toBe('₹0.00');
    expect(formatPaiseToINR(487200)).toBe('₹4,872.00');
  });

  it('formats large amounts using Indian lakh grouping (en-IN locale)', () => {
    expect(formatPaiseToINR(12345600)).toBe('₹1,23,456.00');
    expect(formatPaiseToINR(10000000)).toBe('₹1,00,000.00');
  });
});
