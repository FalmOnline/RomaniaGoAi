// "use client";

// src/hooks/useAttractions.tsx
import useSWR from 'swr'; // Correct way to import useSWR in swr v2.x

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useAttractions() {
  const { data, error } = useSWR('/api/attractions', fetcher);

  return {
    attractions: data,
    isLoading: !error && !data,
    isError: error,
  };
}
