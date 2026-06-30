// ✅ NON mockare @/services/api - usiamo l'implementazione reale
import { 
  fetchCoordinates, 
  fetchDegreeBySignAndDegree, 
  fetchRandomDegree, 
  ApiError 
} from '@/services/api';

// ✅ Usa il fetch globale
const mockFetch = global.fetch as jest.Mock;

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // ✅ Assicurati che fetch sia mockato
    mockFetch.mockReset();
  });

  describe('fetchRandomDegree', () => {
    it('fetches random degree successfully', async () => {
      const mockData = [{ sign: 'Aries', degree: 15, title: 'Random Symbol' }];
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const result = await fetchRandomDegree();
      expect(result).toEqual(mockData);
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('throws ApiError on HTTP error', async () => {
      mockFetch.mockResolvedValue({ ok: false, status: 500 });
      await expect(fetchRandomDegree()).rejects.toThrow(ApiError);
    });

    it('throws ApiError on network error', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));
      await expect(fetchRandomDegree()).rejects.toThrow(ApiError);
    });

    it('throws ApiError on invalid JSON response', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.reject(new Error('Invalid JSON')),
      });
      await expect(fetchRandomDegree()).rejects.toThrow(ApiError);
    });
  });

  describe('fetchDegreeBySignAndDegree', () => {
    it('fetches degree by sign and degree successfully', async () => {
      const mockData = { sign: 'Aries', degree: 15, title: 'Search Result' };
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const result = await fetchDegreeBySignAndDegree('Aries', 15);
      expect(result).toEqual(mockData);
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('throws error on failed request', async () => {
      mockFetch.mockResolvedValue({ ok: false, status: 404 });
      await expect(fetchDegreeBySignAndDegree('Aries', 99)).rejects.toThrow(ApiError);
    });
  });

  describe('fetchCoordinates', () => {
    it('fetches coordinates successfully', async () => {
      const mockData = [{
        place_id: '123',
        display_name: 'Rome, Italy',
        lat: '41.9028',
        lon: '12.4964',
      }];
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const result = await fetchCoordinates('Rome');
      expect(result).toEqual([{
        id: '123',
        name: 'Rome, Italy',
        lat: '41.9028',
        lon: '12.4964',
      }]);
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('handles AbortSignal correctly', async () => {
      const abortController = new AbortController();
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([]),
      });

      await fetchCoordinates('Rome', abortController.signal);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('Rome'),
        expect.objectContaining({
          signal: abortController.signal,
        })
      );
    });

    it('handles empty results', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([]),
      });
      const result = await fetchCoordinates('Nowhere');
      expect(result).toEqual([]);
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });
});