import Database from 'tauri-plugin-sql-api';

const getDb = async () => {
  if (!window.__TAURI__) {
    console.warn('Cannot access DB inside browser');
    return new Database('');
  }

  return Database.load('sqlite:data.db');
};

export const db = await getDb();

