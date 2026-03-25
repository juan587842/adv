import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export type QueryStatus = 'idle' | 'loading' | 'success' | 'error';

interface UseSupabaseQueryResult<T> {
  data: T | null;
  error: Error | null;
  status: QueryStatus;
  isLoading: boolean;
  refetch: () => Promise<void>;
}

export function useSupabaseQuery<T>(
  queryFn: (supabase: ReturnType<typeof createClient>) => Promise<{ data: T | null; error: any }>,
  deps: any[] = []
): UseSupabaseQueryResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<QueryStatus>('idle');

  const supabase = createClient();

  const fetchData = async () => {
    setStatus('loading');
    setError(null);
    try {
      const { data: resultData, error: queryError } = await queryFn(supabase);
      if (queryError) throw queryError;
      setData(resultData);
      setStatus('success');
    } catch (err: any) {
      console.error('Supabase query error:', err);
      setError(err instanceof Error ? err : new Error(err.message || 'Unknown error occurred'));
      setStatus('error');
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return {
    data,
    error,
    status,
    isLoading: status === 'loading',
    refetch: fetchData
  };
}
