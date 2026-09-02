<?php
require_once __DIR__ . '/api/common.php';

$localAddresses = ['127.0.0.1', '::1'];
if (!in_array($_SERVER['REMOTE_ADDR'] ?? '', $localAddresses, true)) {
    http_response_code(403);
    exit('This password-reset page can only be used on the local computer.');
}

session_start_safe();
$error = '';
$success = '';
$adminUsers = db()->query('SELECT username FROM admins ORDER BY id')->fetchAll(PDO::FETCH_COLUMN);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $token = (string) ($_POST['csrf'] ?? '');
    $username = clean((string) ($_POST['username'] ?? ''), 40);
    $password = (string) ($_POST['password'] ?? '');

    if (!hash_equals($_SESSION['csrf'] ?? '', $token)) {
        $error = 'Your form expired. Reload the page and try again.';
    } elseif (!preg_match('/^[A-Za-z0-9_.-]{3,40}$/', $username) || strlen($password) < 10) {
        $error = 'Enter your username and a new password with at least 10 characters.';
    } else {
        $statement = db()->prepare('UPDATE admins SET password_hash=? WHERE username=?');
        $statement->execute([password_hash($password, PASSWORD_DEFAULT), $username]);
        if ($statement->rowCount()) {
            $_SESSION = [];
            session_destroy();
            $success = 'Password updated. You can now sign in.';
        } else {
            $error = 'No admin account was found with that username.';
        }
    }
}
?><!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Reset Pathivara Admin Password</title>
    <style>
      body { font-family: system-ui; background: #f5f3ef; display: grid; place-items: center; min-height: 100vh; margin: 0; }
      .card { background: #fff; border-radius: 18px; padding: 30px; width: min(420px, 90%); box-sizing: border-box; }
      label { display: block; margin: 14px 0; font-weight: 700; }
      input { box-sizing: border-box; display: block; width: 100%; margin-top: 6px; padding: 11px; }
      button { width: 100%; padding: 12px; background: #201e1b; color: #fff; border: 0; border-radius: 8px; cursor: pointer; }
      .error { color: #b44f46; } .success { color: #276749; } .note { color: #666; font-size: .9rem; }
    </style>
  </head>
  <body>
    <main class="card">
      <h1>Reset admin password</h1>
      <p class="note">This tool only works on this computer and does not remove products or orders.</p>
      <?php if ($adminUsers): ?>
        <p class="note">Local admin username<?= count($adminUsers) === 1 ? '' : 's' ?>: <strong><?= htmlspecialchars(implode(', ', $adminUsers)) ?></strong></p>
      <?php else: ?>
        <p class="error">No administrator exists in this local database yet. <a href="setup.php">Create one in setup</a>.</p>
      <?php endif; ?>
      <?php if ($success): ?>
        <p class="success"><?= htmlspecialchars($success) ?></p>
        <p><a href="login.php">Go to admin login</a></p>
      <?php else: ?>
        <form method="post">
          <input type="hidden" name="csrf" value="<?= htmlspecialchars(csrf()) ?>" />
          <label>Admin username<input name="username" autocomplete="username" required /></label>
          <label>New password<input name="password" type="password" minlength="10" autocomplete="new-password" required /></label>
          <p class="error"><?= htmlspecialchars($error) ?></p>
          <button>Update password</button>
        </form>
        <p><a href="login.php">Back to login</a></p>
      <?php endif; ?>
    </main>
  </body>
</html>
