<?php
require_once __DIR__ . '/api/common.php';
session_start_safe();
$p = db();
$exists = (int) $p->query("SELECT COUNT(*) FROM admins")->fetchColumn();
$msg = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST' && !$exists) {
    $u = clean($_POST['username'] ?? '', 40);
    $pw = (string) ($_POST['password'] ?? '');
    if (!preg_match('/^[A-Za-z0-9_.-]{3,40}$/', $u) || strlen($pw) < 10)
        $msg = 'Use a 3-40 character username and a password of at least 10 characters.';
    else {
        $q = $p->prepare("INSERT INTO admins(username,password_hash,created_at)VALUES(?,?,?)");
        $q->execute([$u, password_hash($pw, PASSWORD_DEFAULT), date('c')]);
        header('Location: login.php');
        exit;
    }
}
?><!doctype html>
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Pathivara Setup</title>
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
    <h1>Pathivara Store</h1><?php if ($exists): ?>
        <p>Setup is already complete. Delete <b>setup.php</b> after installation.</p><a href="login.php">Admin
            Login</a><?php else: ?>
        <p>Create your secure administrator account.</p>
        <form method="post"><label>Username<input name="username" required></label><label>Password<input name="password"
                    type="password" minlength="10" required></label>
            <p class="err"><?= htmlspecialchars($msg) ?></p><button>Create Admin</button>
        </form><?php endif; ?>
</div>