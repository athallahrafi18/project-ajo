# Gunakan base image PHP dengan Apache
FROM php:8.2-apache

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libonig-dev \
    libxml2-dev \
    zip unzip git curl \
    libzip-dev \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    && docker-php-ext-install pdo_mysql zip mbstring

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy seluruh isi project Laravel
COPY . .

# Install dependencies
RUN composer install --no-dev --optimize-autoloader

# Set permission folder
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Aktifkan mod_rewrite
RUN a2enmod rewrite

# Konfigurasi Apache untuk Laravel
RUN echo '<Directory /var/www/html/public>\n\
    AllowOverride All\n\
</Directory>' >> /etc/apache2/apache2.conf

# Expose port 80
EXPOSE 80

CMD ["apache2-foreground"]
