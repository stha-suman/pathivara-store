<?php
declare(strict_types=1);
function db(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO)
        return $pdo;
    $dir = __DIR__ . '/../data';
    if (!is_dir($dir))
        mkdir($dir, 0755, true);
    $pdo = new PDO('sqlite:' . $dir . '/pathivara.sqlite');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->exec('PRAGMA foreign_keys=ON');
    return $pdo;
}
function init_db(): void
{
    $p = db();
    $p->exec("CREATE TABLE IF NOT EXISTS admins(id INTEGER PRIMARY KEY AUTOINCREMENT,username TEXT UNIQUE NOT NULL,password_hash TEXT NOT NULL,created_at TEXT NOT NULL)");
    $p->exec("CREATE TABLE IF NOT EXISTS customers(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL,phone TEXT UNIQUE NOT NULL,address TEXT NOT NULL,city TEXT NOT NULL DEFAULT '',password_hash TEXT NOT NULL,created_at TEXT NOT NULL,updated_at TEXT NOT NULL)");
    $p->exec("CREATE TABLE IF NOT EXISTS products(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL,category TEXT NOT NULL,price INTEGER NOT NULL,stock INTEGER NOT NULL,image TEXT NOT NULL DEFAULT '',description TEXT NOT NULL DEFAULT '',sizes TEXT NOT NULL DEFAULT '[]',colors TEXT NOT NULL DEFAULT '[]',active INTEGER NOT NULL DEFAULT 1,created_at TEXT NOT NULL,updated_at TEXT NOT NULL)");
    $p->exec("CREATE TABLE IF NOT EXISTS orders(id INTEGER PRIMARY KEY AUTOINCREMENT,reference TEXT UNIQUE NOT NULL,customer_name TEXT NOT NULL,phone TEXT NOT NULL,address TEXT NOT NULL,city TEXT NOT NULL DEFAULT '',note TEXT NOT NULL DEFAULT '',subtotal INTEGER NOT NULL, status TEXT NOT NULL DEFAULT 'New',items_json TEXT NOT NULL,created_at TEXT NOT NULL,updated_at TEXT NOT NULL)");
    $p->exec("CREATE TABLE IF NOT EXISTS settings(key TEXT PRIMARY KEY,value TEXT NOT NULL)");
}
init_db();
