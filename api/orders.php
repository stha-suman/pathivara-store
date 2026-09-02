<?php
require_once __DIR__ . '/common.php';
$p = db();
$m = $_SERVER['REQUEST_METHOD'];
if ($m === 'POST') {
    customer();
    $d = request_json();
    $profile = customer_data();
    $name = $profile['name'];
    $ph = $profile['phone'];
    $ad = $profile['address'];
    $ref = clean((string) ($d['ref'] ?? ''), 60);
    if (!$name || !phone_ok($ph) || strlen($ad) < 5 || !$ref || !is_array($d['items'] ?? null))
        json_response(['error' => 'Invalid order'], 422);
    $q = $p->prepare("INSERT INTO orders(reference,customer_name,phone,address,city,note,subtotal,status,items_json,created_at,updated_at)VALUES(?,?,?,?,?,?,?,?,?,?,?)");
    try {
        $q->execute([$ref, $name, $ph, $ad, $profile['city'], clean((string) ($d['note'] ?? ''), 1000), max(0, (int) ($d['subtotal'] ?? 0)), 'New', json_encode($d['items'], JSON_UNESCAPED_UNICODE), date('c'), date('c')]);
    } catch (Throwable $e) {
        json_response(['error' => 'Order reference already exists'], 409);
    }
    json_response(['ok' => true], 201);
}
protect();
if ($m === 'GET') {
    $rows = $p->query("SELECT * FROM orders ORDER BY id DESC")->fetchAll(PDO::FETCH_ASSOC);
    foreach ($rows as &$r) {
        $r['id'] = (int) $r['id'];
        $r['subtotal'] = (int) $r['subtotal'];
        $r['items'] = json_decode($r['items_json'], true) ?: [];
        unset($r['items_json']);
    }
    json_response($rows);
}
if ($m === 'PUT') {
    $s = (string) (request_json()['status'] ?? '');
    if (!in_array($s, ['New', 'Confirmed', 'Processing', 'Ready', 'Delivered', 'Cancelled'], true))
        json_response(['error' => 'Invalid status'], 422);
    $q = $p->prepare("UPDATE orders SET status=?,updated_at=? WHERE id=?");
    $q->execute([$s, date('c'), (int) ($_GET['id'] ?? 0)]);
    json_response(['ok' => true]);
}
if ($m === 'DELETE') {
    $q = $p->prepare("DELETE FROM orders WHERE id=?");
    $q->execute([(int) ($_GET['id'] ?? 0)]);
    json_response(['ok' => true]);
}
json_response(['error' => 'Method not allowed'], 405);
