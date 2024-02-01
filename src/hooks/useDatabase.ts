import { db } from '@/lib/db';
import { useEffect, useState } from 'react';
import Database from 'tauri-plugin-sql-api';

type DatabaseSelectType = Parameters<InstanceType<typeof Database>['select']>;

export const useDatabase = <T>(
  ...[query, values]: DatabaseSelectType
): {
  refresh: () => void;
  data: T | null;
} => {
  const [data, setData] = useState<T | null>(null);

  const select = async () => {
    const result: T = await db.select(query, values);
    setData(result);
  };

  useEffect(() => {
    if (!window.__TAURI__) throw new Error('Cannot access DB inside browser');

    setTimeout(() => {
      select();
    }, 500);
  }, []);

  return {
    refresh: () => {
      select();
    },
    data,
  };
};
