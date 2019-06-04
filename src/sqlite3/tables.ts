export const sqlTables = [
    "create table if not exists users (id text primary key, name text not null, groupName text not null, httpKey text not null, httpSecret text not null, passphrase text not null, state integer not null);"
];

export const sqlAfterTables = [

];