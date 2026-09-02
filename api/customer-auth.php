<?php
require_once __DIR__ . '/common.php';
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
session_start_safe();
$p = db();
$action = $_GET['action'] ?? 'me';

if ($_SERVER['REQUEST_METHOD'] === 'GET' && $action === 'me') {
    $profile = customer_data();
    json_response(['authenticated' => $profile['id'] > 0, 'customer' => $profile]);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST')
    json_response(['error' => 'Method not allowed'], 405);

$d = request_json();
if ($action === 'logout') {
    unset($_SESSION['customer_id'], $_SESSION['customer_name'], $_SESSION['customer_phone'], $_SESSION['customer_address'], $_SESSION['customer_city']);
    json_response(['ok' => true]);
}

if ($action === 'login') {
    $phone = clean((string) ($d['phone'] ?? ''), 30);
    $password = (string) ($d['password'] ?? '');
    $q = $p->prepare('SELECT * FROM customers WHERE phone=?');
    $q->execute([$phone]);
    $c = $q->fetch(PDO::FETCH_ASSOC);
    if (!$c || !password_verify($password, $c['password_hash']))
        json_response(['error' => 'Invalid phone number or password.'], 422);
    session_regenerate_id(true);
    $_SESSION['customer_id'] = $c['id'];
    $_SESSION['customer_name'] = $c['name'];
    $_SESSION['customer_phone'] = $c['phone'];
    $_SESSION['customer_address'] = $c['address'];
    $_SESSION['customer_city'] = $c['city'];
    json_response(['ok' => true, 'customer' => customer_data()]);
}

if ($action === 'register') {
    $name = clean((string) ($d['name'] ?? ''), 120);
    $phone = clean((string) ($d['phone'] ?? ''), 30);
    $address = clean((string) ($d['address'] ?? ''), 500);
    $city = clean((string) ($d['city'] ?? ''), 120);
    $password = (string) ($d['password'] ?? '');
    if (strlen($name) < 2 || !phone_ok($phone) || strlen($address) < 5 || strlen($password) < 6)
        json_response(['error' => 'Enter a name, valid Nepal mobile number, address, and password of at least 6 characters.'], 422);
    try {
        $q = $p->prepare('INSERT INTO customers(name,phone,address,city,password_hash,created_at,updated_at) VALUES(?,?,?,?,?,?,?)');
        $now = date('c');
        $q->execute([$name, $phone, $address, $city, password_hash($password, PASSWORD_DEFAULT), $now, $now]);
    } catch (Throwable $e) {
        json_response(['error' => 'An account with this phone number already exists.'], 409);
    }
    $id = (int) $p->lastInsertId();
    session_regenerate_id(true);
    $_SESSION['customer_id'] = $id;
    $_SESSION['customer_name'] = $name;
    $_SESSION['customer_phone'] = $phone;
    $_SESSION['customer_address'] = $address;
    $_SESSION['customer_city'] = $city;
    json_response(['ok' => true, 'customer' => customer_data()], 201);
}

json_response(['error' => 'Unknown action'], 400);
