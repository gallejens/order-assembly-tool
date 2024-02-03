import { db } from '@/lib/db';
import { useEffect, useRef, useState } from 'react';
import Database from 'tauri-plugin-sql-api';

type DatabaseSelectType = Parameters<InstanceType<typeof Database>['select']>;

const ARTIFICIAL_DELAY = 0;

export const useDatabase = <T>(
  ...[query, values = []]: DatabaseSelectType
): {
  refresh: () => Promise<void>;
  data: T | null;
} => {
  const [data, setData] = useState<T | null>(null);
  const promiseResolveRej = useRef<(() => void) | null>(null);

  const executeQuery = async () => {
    const promise = new Promise<T | null>((res, rej) => {
      let timeout: number | null = null;

      promiseResolveRej.current = () => {
        if (timeout !== null) {
          clearTimeout(timeout);
        }
        rej('Cancelled');
      };

      db.select<T>(query, values).then(result => {
        timeout = setTimeout(() => {
          res(result);
        }, ARTIFICIAL_DELAY);
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
