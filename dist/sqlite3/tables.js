"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sqlTables = [
    "create table if not exists users (id text primary key, name text not null, groupName text not null, httpKey text not null, httpSecret text not null, passphrase text not null, state integer not null);",
    `create table if not exists orders (
        "order_id" primary key,
        "acct_key" text,
        "client_oid" text,
        "created_at" text,
        "filled_notional" text,
        "filled_size"text,
        "funds" text,
        "instrument_id"text,
        "notional" text,
        "order_type"text,
        "price" text,
        "price_avg" text,
        "product_id" text,
        "side" text,
        "size" text,
        "status" text,
        "state" text,
        "timestamp" text,
        "type" text);`,
    `create table if not exists warnings (
            "wid" text primary key,
            "acct_key" text ,
            "instrument_id" text ,
            "filepath" text ,
            "maxprice" text ,
            "minprice" text ,
            "utime" text ,
            "pecent" text ,
            "status" text,
            "timestamp" text,
            "type" text);`
];
exports.sqlAfterTables = [];
