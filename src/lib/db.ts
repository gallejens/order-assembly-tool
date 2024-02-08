import Database from 'tauri-plugin-sql-api';

export let db: Database;

const getDb = async () => {
  if (!window.__TAURI__) {
    console.warn('Cannot access DB inside browser');
    return new Database('');
  }

  return Database.load('sqlite:data.db');
};

// top level await not fully supported in some instances
(async () => {
  db = await getDb();
})();

