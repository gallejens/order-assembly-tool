import { db } from '@/lib/db';
import { QUERIES, type Queries } from '@/queries';
import { useEffect, useRef, useState } from 'react';

export const useDatabase = <T extends keyof Queries>(
  queryName: T,
  values: unknown[] = []
): {
  refresh: () => Promise<void>;
  data: Queries[T] | null;
} => {
  const [data, setData] = useState<Queries[T] | null>(null);
  const promiseResolveRej = useRef<(() => void) | null>(null);

  const executeQuery = async () => {
    const promise = new Promise<Queries[T]>((res, rej) => {
      const timeout: number | null = null;

      promiseResolveRej.current = () => {
        if (timeout !== null) {
          clearTimeout(timeout);
        }
        rej('Cancelled');
      };

      db.select<Queries[T]>(QUERIES[queryName], values).then(result => {
        res(result);
      });
    });

    try {
      const result = await promise;
      setData(result);
      promiseResolveRej.current = null;
    } catch (e: unknown) {
      //
    }
  };

  useEffect(() => {
    if (!window.__TAURI__) throw new Error('Cannot access DB inside browser');

    setData(null);
    executeQuery();

    return () => {
      if (promiseResolveRej.current) {
        promiseResolveRej.current();
      }
    };
  }, [...values]);

  return {
    refresh: executeQuery,
    data,
  };
};
