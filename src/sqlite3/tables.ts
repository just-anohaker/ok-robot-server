export const sqlTables = [
    "create table if not exists users (id text primary key, name text not null, groupName text not null, apiKey text not null, apiSecret text not null, state integer not null);"
];

export const sqlAfterTables = [

];