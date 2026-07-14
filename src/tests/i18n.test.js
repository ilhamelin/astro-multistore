import { describe, it, expect } from 'vitest';
import { CURRENCY_RATES, CATEGORY_MAPPING, TRANSLATIONS } from '../i18n';

describe('i18n Configuration and Dictionary', () => {
  describe('CURRENCY_RATES', () => {
    it('should define base USD rate as 1.0', () => {
      expect(CURRENCY_RATES['$']).toBe(1.0);
    });

    it('should define correct exchange rates for EUR, MXN, and CLP', () => {
      expect(CURRENCY_RATES['€']).toBe(0.92);
      expect(CURRENCY_RATES['MXN$']).toBe(18.0);
      expect(CURRENCY_RATES['CLP$']).toBe(900.0);
    });
  });

  describe('CATEGORY_MAPPING', () => {
    it('should correctly map categories to English and Spanish translations', () => {
      expect(CATEGORY_MAPPING['Todos']).toEqual({ es: 'Todos', en: 'All' });
      expect(CATEGORY_MAPPING['Peripherals']).toEqual({ es: 'Periféricos', en: 'Peripherals' });
      expect(CATEGORY_MAPPING['Breads']).toEqual({ es: 'Panes', en: 'Breads' });
    });
  });

  describe('TRANSLATIONS Dictionaries', () => {
    it('should contain dictionaries for es and en', () => {
      expect(TRANSLATIONS).toHaveProperty('es');
      expect(TRANSLATIONS).toHaveProperty('en');
    });

    it('should have matching translation keys for core UI terms in Spanish and English', () => {
      const coreKeys = [
        'search_placeholder',
        'enter',
        'logout',
        'cart_title',
        'wishlist_title',
        'price_label',
        'out_of_stock'
      ];

      coreKeys.forEach(key => {
        expect(TRANSLATIONS.es).toHaveProperty(key);
        expect(TRANSLATIONS.en).toHaveProperty(key);
      });
    });
  });
});
