<?php
require_once __DIR__ . '/db.php';
function json_response($d, int $s = 200): never
{
    http_response_code($s);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($d, JSON_UNESCAPED_UNICODE);
    exit;
}
function request_json(): array
{
    $d = json_decode(file_get_contents('php://input'), true);
    return is_array($d) ? $d : [];
}
function session_start_safe(): void
{
    if (session_status() !== PHP_SESSION_ACTIVE) {
        $secure = !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';
        session_set_cookie_params(['httponly' => true, 'samesite' => 'Lax', 'secure' => $secure, 'path' => '/']);
        session_start();
    }
}
function csrf(): string
{
    session_start_safe();
    if (empty($_SESSION['csrf']))
        $_SESSION['csrf'] = bin2hex(random_bytes(32));
    return $_SESSION['csrf'];
}
function admin(): void
{
    session_start_safe();
    if (empty($_SESSION['admin_id']))
        json_response(['error' => 'Authentication required'], 401);
}
function customer(): void
{
    session_start_safe();
    if (empty($_SESSION['customer_id']))
        json_response(['error' => 'Customer login required'], 401);
}
function customer_data(): array
{
    session_start_safe();
    return [
        'id' => (int) ($_SESSION['customer_id'] ?? 0),
        'name' => $_SESSION['customer_name'] ?? null,
        'phone' => $_SESSION['customer_phone'] ?? null,
        'address' => $_SESSION['customer_address'] ?? null,
        'city' => $_SESSION['customer_city'] ?? null,
    ];
}
function protect(): void
{
    admin();
    $t = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    if (!$t || !hash_equals($_SESSION['csrf'] ?? '', $t))
        json_response(['error' => 'Invalid CSRF token'], 419);
}
function clean(string $v, int $n = 500): string
{
    return mb_substr(trim($v), 0, $n);
}
function phone_ok(string $p): bool
{
    $p = preg_replace('/[\s-]+/', '', $p);
    return (bool) preg_match('/^(?:\+977)?9[678]\d{8}$/', $p);
}
