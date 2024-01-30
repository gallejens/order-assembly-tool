import Database from 'tauri-plugin-sql-api';

const getDb = async () => {
  if (!window.__TAURI__) {
    throw new Error('Cannot access DB inside browser');
  }

  return Database.load('sqlite:test.db');
};

export const db = getDb();
