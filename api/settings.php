<?php require_once __DIR__ . '/common.php';
$p = db();
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $o = [];
    foreach ($p->query("SELECT key,value FROM settings") as $r)
        $o[$r['key']] = $r['value'];
    json_response($o);
}
protect();
$d = request_json();
foreach (['name', 'phone', 'location', 'whatsapp'] as $k) {
    $q = $p->prepare("INSERT INTO settings(key,value)VALUES(?,?)ON CONFLICT(key)DO UPDATE SET value=excluded.value");
    $q->execute([$k, clean((string) ($d[$k] ?? ''), 200)]);
}
json_response(['ok' => true]);