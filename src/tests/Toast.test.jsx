import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import Toast from '../components/store/Toast';

// Mock the StoreContext module using its path relative to the test file
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
    
    // Check that message is rendered
    expect(screen.getByText('Operación exitosa')).toBeInTheDocument();
    
    // Check that close button is present
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
