use tauri_plugin_sql::{Migration, MigrationKind};

fn main() {
    let migrations = vec![
        // Définir vos migrations ici
        Migration {
            version: 1,
            description: "create_initial_tables",
            sql: "
                CREATE TABLE test_results (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    scenario_id TEXT NOT NULL,
                    scenario_name TEXT NOT NULL,
                    error_message TEXT,
                    uri TEXT NOT NULL,
                    flaky INTEGER NOT NULL,  -- 0 (faux) ou 1 (vrai)
                    gitlab_issue_id TEXT,
                    gitlab_project_id TEXT,
                    video TEXT,
                    expected TEXT,
                    result TEXT,
                    date INTEGER NOT NULL -- Timestamp
                );
            ",
            kind: MigrationKind::Up,
        }
    ];

    tauri::Builder::default()
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:mydatabase.db", migrations)
                .build()
        )
        .run(tauri::generate_context!())
        .expect("error while running Tauri application");
}
