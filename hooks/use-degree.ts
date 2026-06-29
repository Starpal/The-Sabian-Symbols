import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { fetchDegreeBySignAndDegree, fetchRandomDegree } from "@/services/api";
import { Degree } from "@/types/api";

export const useRandomDegree = () => {
  const sessionKey = useRef(Date.now()).current;
  return useQuery({
    queryKey: ["degree", "random", sessionKey],
    queryFn: () => fetchRandomDegree(),
    select: (data): Degree => (Array.isArray(data) ? data[0] : data),
    staleTime: 0, // considera i dati subito "vecchi" — refetch ad ogni mount
    gcTime: 0, // elimina dalla cache subito dopo unmount — niente memoria
  });
};

export const useSearchDegree = (sign: string, degree: number) =>
  useQuery({
    queryKey: ["degree", "search", sign, degree],
    queryFn: () => fetchDegreeBySignAndDegree(sign, degree),
    enabled: !!sign && !!degree,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
