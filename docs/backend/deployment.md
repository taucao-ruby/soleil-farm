# 🚀 Backend Deployment Guide

Instructions for deploying Soleil Farm backend to production.

---

## Deployment Checklist

- [ ] Set `APP_ENV=production`
- [ ] Set `APP_DEBUG=false`
- [ ] Generate production `APP_KEY`
- [ ] Configure database credentials
- [ ] Run migrations
- [ ] Configure web server (Nginx/Apache)
- [ ] Set up SSL certificate
- [ ] Configure caching
- [ ] Set up job queue (optional)
- [ ] Configure logging

---

## Step 1: Server Requirements

| Requirement | Minimum |
|-------------|---------|
| PHP | 8.2+ |
| MySQL | 8.0+ |
| Nginx/Apache | Latest |
| Composer | 2.0+ |
| RAM | 1 GB |
| Storage | 10 GB |

### Required PHP Extensions
- BCMath, Ctype, cURL, DOM, Fileinfo
- JSON, Mbstring, OpenSSL, PCRE
- PDO (MySQL), Tokenizer, XML

---

## Step 2: Clone & Install

```bash
git clone <repository-url> /var/www/soleil-farm
cd /var/www/soleil-farm/backend
composer install --no-dev --optimize-autoloader
```

---

## Step 3: Environment Configuration

```bash
cp .env.example .env
```

Edit `.env` for production:
```env
APP_NAME="Soleil Farm"
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=https://your-domain.com

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=soleil_farm
DB_USERNAME=soleil_user
DB_PASSWORD=secure_password_here

LOG_CHANNEL=daily
LOG_LEVEL=error

CACHE_DRIVER=file
SESSION_DRIVER=file
QUEUE_CONNECTION=sync
```

Generate key:
```bash
php artisan key:generate
```

---

## Step 4: Database Setup

```sql
CREATE DATABASE soleil_farm CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'soleil_user'@'localhost' IDENTIFIED BY 'secure_password_here';
GRANT ALL PRIVILEGES ON soleil_farm.* TO 'soleil_user'@'localhost';
FLUSH PRIVILEGES;
```

Run migrations:
```bash
php artisan migrate --force
php artisan db:seed --force
```

---

## Step 5: Optimize for Production

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
composer dump-autoload --optimize
```

---

## Step 6: Set Permissions

```bash
sudo chown -R www-data:www-data /var/www/soleil-farm
sudo chmod -R 755 /var/www/soleil-farm
sudo chmod -R 775 /var/www/soleil-farm/backend/storage
sudo chmod -R 775 /var/www/soleil-farm/backend/bootstrap/cache
```

---

## Step 7: Nginx Configuration

Create `/etc/nginx/sites-available/soleil-farm`:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/soleil-farm/backend/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;
    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/soleil-farm /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## Step 8: SSL Certificate (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## Step 9: Verify Deployment

```bash
curl https://your-domain.com/api/v1/dashboard/stats
```

---

## Maintenance Commands

### Clear Caches
```bash
php artisan optimize:clear
```

### Rebuild Caches
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Run Migrations
```bash
php artisan migrate --force
```

### View Logs
```bash
tail -f storage/logs/laravel.log
```

---

## Updating Production

```bash
git pull origin main
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

## Security Recommendations

1. **Use HTTPS only** - Redirect HTTP to HTTPS
2. **Strong database password** - Use randomly generated password
3. **Firewall** - Only allow ports 22, 80, 443
4. **Regular updates** - Keep PHP and dependencies updated
5. **Backup database** - Daily automated backups
6. **Monitor logs** - Set up log monitoring

---

*See also: [Installation Guide](installation.md) | [Development Guide](development.md)*
