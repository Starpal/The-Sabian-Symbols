import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useRandomDegree, useSearchDegree } from '@/hooks/use-degree';

// ✅ Mock delle API
jest.mock('@/services/api', () => ({
  fetchDegreeBySignAndDegree: jest.fn(),
  fetchRandomDegree: jest.fn(),
}));

import { fetchDegreeBySignAndDegree, fetchRandomDegree } from '@/services/api';

const mockFetchRandomDegree = fetchRandomDegree as jest.Mock;
const mockFetchDegreeBySignAndDegree = fetchDegreeBySignAndDegree as jest.Mock;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { 
        retry: false,
        gcTime: 0,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('use-degree hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useRandomDegree', () => {
    it('fetches a random degree successfully', async () => {
      const mockData = { sign: 'Aries', degree: 15, title: 'Random Symbol' };
      mockFetchRandomDegree.mockResolvedValue(mockData);

      const { result } = renderHook(() => useRandomDegree(true), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.data).toEqual(mockData);
      });
      expect(mockFetchRandomDegree).toHaveBeenCalledTimes(1);
    });

    it('is disabled when enabled is false', () => {
      const { result } = renderHook(() => useRandomDegree(false), {
        wrapper: createWrapper(),
      });
      expect(result.current.isLoading).toBe(false);
      expect(mockFetchRandomDegree).not.toHaveBeenCalled();
    });

    it('handles array response correctly', async () => {
      const mockData = [{ sign: 'Aries', degree: 15, title: 'Random Symbol' }];
      mockFetchRandomDegree.mockResolvedValue(mockData);

      const { result } = renderHook(() => useRandomDegree(true), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.data).toEqual(mockData[0]);
      });
    });

    it('handles error state', async () => {
      const error = new Error('API Error');
      mockFetchRandomDegree.mockRejectedValue(error);

      const { result } = renderHook(() => useRandomDegree(true), {
        wrapper: createWrapper(),
      });

      // ✅ Usa una condizione che sicuramente si verifica
      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      }, { timeout: 2000 });
      
      expect(result.current.error).toBeDefined();
    });
  });

  describe('useSearchDegree', () => {
    it('fetches a specific degree successfully', async () => {
      const mockData = { sign: 'Aries', degree: 15, title: 'Search Result' };
      mockFetchDegreeBySignAndDegree.mockResolvedValue(mockData);

      const { result } = renderHook(
        () => useSearchDegree('Aries', 15, true),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.data).toEqual(mockData);
      });
      expect(mockFetchDegreeBySignAndDegree).toHaveBeenCalledWith('Aries', 15);
    });

    it('is disabled when sign or degree is missing', () => {
      const { result } = renderHook(
        () => useSearchDegree('', 0, true),
        { wrapper: createWrapper() }
      );
      expect(result.current.isLoading).toBe(false);
      expect(mockFetchDegreeBySignAndDegree).not.toHaveBeenCalled();
    });

    it('caches results correctly', async () => {
      const mockData = { sign: 'Aries', degree: 15, title: 'Cached Result' };
      mockFetchDegreeBySignAndDegree.mockResolvedValue(mockData);

      const { result, rerender } = renderHook(
        () => useSearchDegree('Aries', 15, true),
        { wrapper: createWrapper() }
      );

      await waitFor(() => {
        expect(result.current.data).toEqual(mockData);
      });

      rerender(() => useSearchDegree('Aries', 15, true));
      expect(mockFetchDegreeBySignAndDegree).toHaveBeenCalledTimes(1);
    });
  });
});