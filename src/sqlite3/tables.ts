export const sqlTables = [
    "CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, name TEXT NOT NULL, groupName TEXT NOT NULL, apiKey TEXT NOT NULL, apiSecret TEXT NOT NULL, state INT NOT NULL);"
];

export const sqlAfterTables = [

];