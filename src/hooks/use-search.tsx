"use client"

import { apiFetch } from '@/lib/api-fetch'
import { fileArray } from '@/validators/media_validator'
import { useEffect, useState } from 'react'
import zod from 'zod'
import { useSearchStore } from './use-search-store'
import { useSearchContext } from '@/components/context/search-bar-context'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

const DEBOUNCE_DELAY = 500;

const UseSearch = () => {
  const { results, setResults } = useSearchStore();
  const { query, setQuery } = useSearchContext();
  const [isLoading, setIsLoading] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const queryParam = searchParams.get("query");
useEffect(()=>{
  setIsLoading(true);
},[query])
  // Sync queryParam from URL to Context when pathname is /search
  useEffect(() => {
    if (pathname === '/search' && queryParam !== query) {
      setQuery(queryParam || '');
    }
  }, [queryParam, pathname]);

  // Perform search when query changes
  useEffect(() => {
    // Don't search if query is empty or we're not on /search
    if (!query || query.trim() === '' || pathname !== '/search') {
      setResults([]);
      return;
    }

    const handler = setTimeout(async () => {
      try {
        setIsLoading(true);
  if (results.length > 0 && queryParam=== query) {
    setIsLoading(false);
    return;
  }
         if( pathname !== '/search'){
             router.push('/search?query='+query)
         }
        // Prevent pushing the same query again
        if (queryParam !== query) {
          router.replace(`/search?query=${encodeURIComponent(query)}`);
        }
        const response = await apiFetch<zod.infer<typeof fileArray>>(
          `/v1/media/search?query=${encodeURIComponent(query)}`,
          { method: "GET" },
          fileArray
        );
       
        setResults(response);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(handler);
  }, [query, pathname]);

  return { results, isLoading };
};

export default UseSearch;
