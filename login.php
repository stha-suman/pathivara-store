<?php
require_once __DIR__ . '/api/common.php';
session_start_safe();
if (!empty($_SESSION['admin_id'])) {
    header('Location: admin.html');
    exit;
}
$e = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $u = clean($_POST['username'] ?? '', 40);
    $pw = (string) ($_POST['password'] ?? '');
    $q = db()->prepare("SELECT * FROM admins WHERE username=?");
    $q->execute([$u]);
    $a = $q->fetch(PDO::FETCH_ASSOC);
    if ($a && password_verify($pw, $a['password_hash'])) {
        session_regenerate_id(true);
        $_SESSION['admin_id'] = $a['id'];
        $_SESSION['admin_user'] = $a['username'];
        $_SESSION['csrf'] = bin2hex(random_bytes(32));
        header('Location: admin.html');
        exit;
    }
    $e = 'Invalid username or password.';
}
?><!doctype html>
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Pathivara Admin Login</title>
<style>
    body {
        font-family: system-ui;
        background: #f5f3ef;
        display: grid;
        place-items: center;
        min-height: 100vh
    }

    .card {
        background: white;
        padding: 30px;
        border-radius: 18px;
        width: min(420px, 90%)
    }

    label {
        display: block;
        margin: 14px 0;
        font-weight: 700
    }

    input {
        display: block;
        width: 100%;
        padding: 11px;
        margin-top: 6px;
        box-sizing: border-box
    }

    button {
        width: 100%;
        padding: 12px;
        background: #201e1b;
        color: white;
        border: 0;
        border-radius: 8px
    }

    .err {
        color: #b44f46
    }
</style>
<div class="card">
    <h1>Pathivara Store</h1>
    <p>Secure Admin Login</p>
    <form method="post"><label>Username<input name="username" required></label><label>Password<input name="password"
                type="password" required></label>
        <p class="err"><?= htmlspecialchars($e) ?></p><button>Sign In</button>
    </form>
</div>