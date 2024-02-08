// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod migrations;
use tauri_plugin_sql::{Migration, MigrationKind};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn get_migrations() -> Vec<Migration> {
    let mut migrations: Vec<Migration> = Vec::new();

    for (i, mig) in migrations::MIGRATIONS.into_iter().enumerate() {
        migrations.push(Migration {
            version: i as i64 + 1,
            description: mig.description,
            sql: mig.sql,
            kind: MigrationKind::Up,
        });
    }

    return migrations;
}

fn main() {
    let migrations = get_migrations();

    let builder = tauri::Builder::default();

    let sqlite_plugin = tauri_plugin_sql::Builder::default()
        .add_migrations("sqlite:data.db", migrations)
        .build();

    let app = builder
        .plugin(sqlite_plugin)
        .invoke_handler(tauri::generate_handler![greet]);

    app.run(tauri::generate_context!())
        .expect("error while running tauri application");
}
