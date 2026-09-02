<?php require_once __DIR__ . '/common.php';
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
session_start_safe();
if (($_GET['action'] ?? 'me') === 'me')
    json_response(['authenticated' => !empty($_SESSION['admin_id']), 'username' => $_SESSION['admin_user'] ?? null, 'csrf' => csrf()]);
json_response(['error' => 'Unknown action'], 400);
