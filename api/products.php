<?php
require_once __DIR__ . '/common.php';
$p = db();
$m = $_SERVER['REQUEST_METHOD'];

function product_data(array $d): array
{
    $name = clean((string) ($d['name'] ?? ''), 120);
    $category = clean((string) ($d['category'] ?? ''), 30);
    if (!$name || !in_array($category, ['Men', 'Women', 'Kids', 'Sarees'], true))
        json_response(['error' => 'Please provide a product name and valid category.'], 422);

    $normaliseList = static function ($value, int $limit): array {
        if (!is_array($value)) return [];
        $items = [];
        foreach (array_slice($value, 0, $limit) as $item) {
            $item = clean((string) $item, 50);
            if ($item !== '') $items[] = $item;
        }
        return array_values(array_unique($items));
    };

    return [
        $name,
        $category,
        max(0, (int) ($d['price'] ?? 0)),
        max(0, (int) ($d['stock'] ?? 0)),
        clean((string) ($d['image'] ?? ''), 500),
        clean((string) ($d['description'] ?? ''), 3000),
        json_encode($normaliseList($d['sizes'] ?? [], 20), JSON_UNESCAPED_UNICODE),
        json_encode($normaliseList($d['colors'] ?? [], 20), JSON_UNESCAPED_UNICODE),
    ];
}

if ($m === 'GET') {
    $rows = $p->query("SELECT * FROM products WHERE active=1 ORDER BY id DESC")->fetchAll(PDO::FETCH_ASSOC);
    foreach ($rows as &$r) {
        $r['id'] = (int) $r['id'];
        $r['price'] = (int) $r['price'];
        $r['stock'] = (int) $r['stock'];
        $r['sizes'] = json_decode($r['sizes'], true) ?: [];
        $r['colors'] = json_decode($r['colors'], true) ?: [];
    }
    json_response($rows);
}
protect();
if ($m === 'POST') {
    $d = request_json();
    [$n, $c, $price, $stock, $image, $description, $sizes, $colors] = product_data($d);
    $q = $p->prepare("INSERT INTO products(name,category,price,stock,image,description,sizes,colors,created_at,updated_at)VALUES(?,?,?,?,?,?,?,?,?,?)");
    $q->execute([$n, $c, $price, $stock, $image, $description, $sizes, $colors, date('c'), date('c')]);
    json_response(['id' => $p->lastInsertId()], 201);
}
if ($m === 'PUT') {
    $id = (int) ($_GET['id'] ?? 0);
    if ($id < 1) json_response(['error' => 'Invalid product ID.'], 422);
    $d = request_json();
    [$name, $category, $price, $stock, $image, $description, $sizes, $colors] = product_data($d);
    $q = $p->prepare("UPDATE products SET name=?,category=?,price=?,stock=?,image=?,description=?,sizes=?,colors=?,updated_at=? WHERE id=?");
    $q->execute([$name, $category, $price, $stock, $image, $description, $sizes, $colors, date('c'), $id]);
    if (!$q->rowCount()) json_response(['error' => 'Product not found.'], 404);
    json_response(['ok' => true]);
}
if ($m === 'DELETE') {
    $id = (int) ($_GET['id'] ?? 0);
    if ($id < 1) json_response(['error' => 'Invalid product ID.'], 422);
    $q = $p->prepare("UPDATE products SET active=0,updated_at=? WHERE id=?");
    $q->execute([date('c'), $id]);
    if (!$q->rowCount()) json_response(['error' => 'Product not found.'], 404);
    json_response(['ok' => true]);
}
json_response(['error' => 'Method not allowed'], 405);
