import { useQuery } from '@tanstack/react-query';
import { fetchDegreeBySignAndDegree, fetchRandomDegree } from '@/services/api';

export const useRandomDegree = () =>
  useQuery({
    queryKey: ['degree', 'random'],
    queryFn: () => fetchRandomDegree(),
    select: (data) => (Array.isArray(data) ? data[0] : data),
  });

export const useSearchDegree = (sign: string, degree: number) =>
  useQuery({
    queryKey: ['degree', 'search', sign, degree],
    queryFn: () => fetchDegreeBySignAndDegree(sign, degree),
    enabled: !!sign && !!degree,
  });