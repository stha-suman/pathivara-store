# Stage 5 — Real Backend

Requires PHP 8.1+ and PDO SQLite.

1. Upload the complete project to a PHP-enabled server.
2. Ensure `data/` and `uploads/` are writable by PHP.
3. Visit `/setup.php` once and create a strong admin account.
4. Delete/rename `setup.php` after setup.
5. Visit `/login.php` for the secure admin login.
6. Admin dashboard: `/admin.html`.
7. Customer orders are saved to SQLite and appear in the dashboard.
8. Use HTTPS in production.
9. Products created, edited or deleted in the dashboard are immediately used by the public shop, product and cart pages.
10. If you forget the password while developing locally, use `/reset-password.php` from the same computer. It is blocked for remote visitors and does not delete store data.

Stage 5 replaces browser-only admin authentication/order storage with server-side SQLite, secure password hashing, sessions and CSRF checks.

Note: The public catalog still has the existing static product list. The next integration can make shop/product pages read the same database catalog live.
