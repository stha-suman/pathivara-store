<?php require_once __DIR__ . '/api/common.php';
session_start_safe();
$_SESSION = [];
session_destroy();
header('Location: login.php');
exit;