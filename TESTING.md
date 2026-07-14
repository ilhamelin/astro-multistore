# Documentación de Pruebas Unitarias y de Componentes

Este documento detalla la estructura, configuración y código de las pruebas unitarias y de componentes implementadas en el proyecto **Astro Multi-store** utilizando **Vitest** y **React Testing Library**.

---

## 🚀 Cómo Ejecutar las Pruebas

Los scripts de prueba se configuran en el archivo `package.json` y se pueden ejecutar mediante NPM:

```bash
# Ejecutar todas las pruebas una sola vez
npm run test

# Ejecutar las pruebas en modo de observación (watch mode) para desarrollo continuo
npm run test:watch
```

---

## ⚙️ Configuración del Entorno

La infraestructura de pruebas utiliza las siguientes herramientas:
- **Vitest**: Un test runner rápido impulsado por Vite.
- **JSDOM**: Un entorno de DOM simulado para emular el navegador al renderizar componentes React.
- **React Testing Library**: Utilidades para renderizar y consultar componentes sin depender de detalles de implementación.
- **jest-dom**: Matchers personalizados (como `.toBeInTheDocument()`) para realizar aserciones de DOM legibles.

### 1. Archivo de Configuración de Vitest (`vitest.config.ts`)
Este archivo le dice a Vitest que utilice el entorno `jsdom` y cargue el archivo de inicialización global:

```typescript
/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/tests/setup.ts'],
  },
});
```

### 2. Archivo de Setup Global (`src/tests/setup.ts`)
Configura las extensiones de `jest-dom` y limpia el DOM virtual de React después de cada test individual:

```typescript
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});
```

---

## 🧪 Pruebas Implementadas

### 1. Pruebas Unitarias (`src/tests/i18n.test.js`)
Prueba las lógicas puras de traducción, correspondencia de categorías y tasas de conversión de monedas definidas en `src/i18n.js`.

```javascript
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
```

---

### 2. Pruebas de Componentes (`src/tests/Toast.test.jsx`)
Prueba la interactividad del componente de notificación flotante (`Toast.jsx`). Como el componente depende del contexto global de la tienda (`StoreContext`), mockea el hook `useStore` para controlar el estado expuesto al componente en cada test.

```javascript
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import Toast from '../components/store/Toast';

// Mock del módulo StoreContext usando su ruta relativa al archivo de pruebas
const mockUseStore = vi.fn();
vi.mock('../context/StoreContext', () => ({
  useStore: () => mockUseStore()
}));

describe('Toast Component', () => {
  const mockSetToast = vi.fn();
  const mockTheme = {
    colors: {
      cardBg: 'bg-slate-900',
      accent: 'bg-cyan-500',
      button: 'bg-cyan-600'
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render nothing if toast is null', () => {
    mockUseStore.mockReturnValue({
      toast: null,
      setToast: mockSetToast,
      currentTheme: mockTheme
    });

    const { container } = render(<Toast />);
    expect(container.firstChild).toBeNull();
  });

  it('should render success toast with correct text and styles', () => {
    mockUseStore.mockReturnValue({
      toast: { message: 'Operación exitosa', type: 'success' },
      setToast: mockSetToast,
      currentTheme: mockTheme
    });

    render(<Toast />);
    
    // Verifica que el mensaje se renderice
    expect(screen.getByText('Operación exitosa')).toBeInTheDocument();
    
    // Verifica que el botón de cerrar esté presente
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should render error toast with correct text', () => {
    mockUseStore.mockReturnValue({
      toast: { message: 'Ocurrió un error', type: 'error' },
      setToast: mockSetToast,
      currentTheme: mockTheme
    });

    render(<Toast />);
    expect(screen.getByText('Ocurrió un error')).toBeInTheDocument();
  });

  it('should call setToast(null) when close button is clicked', () => {
    mockUseStore.mockReturnValue({
      toast: { message: 'Mensaje de prueba', type: 'info' },
      setToast: mockSetToast,
      currentTheme: mockTheme
    });

    render(<Toast />);
    
    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);
    
    expect(mockSetToast).toHaveBeenCalledTimes(1);
    expect(mockSetToast).toHaveBeenCalledWith(null);
  });
});
```

---

## 📊 Resultados de la Ejecución

A continuación se muestra una captura del output de la consola tras ejecutar los tests en el proyecto:

```
 RUN  v4.1.10 C:/Users/benja/.gemini/antigravity-ide/scratch/astro-multistore

 ✓ src/tests/i18n.test.js (5 tests) 14ms
 ✓ src/tests/Toast.test.jsx (4 tests) 657ms
     ✓ should render success toast with correct text and styles  521ms

 Test Files  2 passed (2)
      Tests  9 passed (9)
   Start at  15:19:34
   Duration  7.61s
```
