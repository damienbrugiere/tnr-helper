use tauri_plugin_sql::{Migration, MigrationKind};

fn main() {
    let migrations = vec![
        // Migration pour créer la table test_results
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
                    flaky INTEGER NOT NULL,
                    gitlab_issue_id TEXT,
                    gitlab_project_id TEXT,
                    video TEXT,
                    expected TEXT,
                    result TEXT,
                    date INTEGER NOT NULL
                );
            ",
            kind: MigrationKind::Up,
        },
        // Migration pour ajouter la table campaign et faire un lien avec test_results
        Migration {
            version: 2,
            description: "add_campaign_table_and_foreign_key",
            sql: "
                CREATE TABLE campaign (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    failed_count INTEGER,
                    success_count INTEGER,
                    total_count INTEGER,
                    date INTEGER NOT NULL
                );

                CREATE TABLE test_results_new (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    scenario_id TEXT NOT NULL,
                    scenario_name TEXT NOT NULL,
                    error_message TEXT,
                    uri TEXT NOT NULL,
                    flaky INTEGER NOT NULL,
                    gitlab_issue_id INTEGER,
                    gitlab_project_id INTEGER,
                    video TEXT,
                    expected TEXT,
                    result TEXT,
                    date INTEGER NOT NULL,
                    campaign_id INTEGER,
                    FOREIGN KEY (campaign_id) REFERENCES campaign (id)
                    ON DELETE SET NULL ON UPDATE CASCADE
                );

                INSERT INTO test_results_new (
                    id, scenario_id, scenario_name, error_message, uri, flaky,
                    gitlab_issue_id, gitlab_project_id, video, expected, result, date
                )
                SELECT
                    id, scenario_id, scenario_name, error_message, uri, flaky,
                    gitlab_issue_id, gitlab_project_id, video, expected, result, date
                FROM test_results;

                DROP TABLE test_results;

                ALTER TABLE test_results_new RENAME TO test_results;
            ",
            kind: MigrationKind::Up,
        },
        Migration {
            version: 3,
            description: "create_issue_template",
            sql: "
                CREATE TABLE issue_template (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT,
                    title TEXT,
                    flaky INTEGER,
                    description TEXT,
                    project_id INTEGER
                );

                INSERT INTO issue_template(flaky,name) VALUES (1,'Issue Flaky'),(0, 'Issue bug projet Pilot') ;
            ",
            kind: MigrationKind::Up,
        },       
         Migration {
            version: 4,
            description: "create_config",
            sql: "
                CREATE TABLE config (
                    id INTEGER PRIMARY KEY,
                    base_url TEXT,
                    api_key TEXT
                );

                INSERT INTO config(id, base_url, api_key) VALUES (1,'https://gitlab.com/api/v4', 'glpat-weCSsMue8KSJqf77-cRF') ;
            ",
            kind: MigrationKind::Up,
        },
    ];

    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:mydatabase.db", migrations)
                .build(),
        )
        .run(tauri::generate_context!())
        .expect("error while running Tauri application");
}
