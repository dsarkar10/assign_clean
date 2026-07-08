import { describe, it, expect } from 'vitest';
import { toINR } from './formatPrice';

describe('toINR', () => {
  it('converts paise to INR format', () => {
    expect(toINR(118000)).toBe('₹1,180.00');
    expect(toINR(0)).toBe('₹0.00');
    expect(toINR(487200)).toBe('₹4,872.00');
  });

  it('uses Indian lakh grouping', () => {
    expect(toINR(12345600)).toBe('₹1,23,456.00');
    expect(toINR(10000000)).toBe('₹1,00,000.00');
  });
});
