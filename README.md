# Pathivara Store — Stage 5

This version uses a PHP/SQLite backend for products, orders and settings.

## Admin
Run `setup.php` once to create an administrator, then sign in at `login.php`. Customers can create accounts and sign in at `account.php`; checkout uses their saved delivery details.

## Dashboard features
- Product count and low-stock overview
- Recent orders
- Product catalog management
- Add/edit/delete products
- Price and stock management
- Product image URL management
- Order list and search
- Order status: New, Confirmed, Processing, Ready, Delivered, Cancelled
- Store settings

## Setup

Follow `STAGE5-SETUP.md`. The old `admin/index.html` address now forwards to the secure login page so there is only one product-management dashboard.
