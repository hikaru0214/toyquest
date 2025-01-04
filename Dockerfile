# FROM php:8.2-apache
FROM ubuntu:20.04

RUN apt-get update -y && apt-get install -y \
software-properties-common \
&& add-apt-repository ppa:ondrej/php \
&& apt-get update && apt-get install -y \
curl \
apache2 \
libapache2-mod-php8.2 \
php8.2 \
php8.2-mysql \
php8.2-pdo \
mysql-client \
vim \
php8.2-redis \
redis \
php-pear \
php-dev \
gcc \
make \
&& apt-get clean 

RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
&& apt-get install -y nodejs \
&& apt-get clean

RUN a2enmod rewrite
# 公開ディレクトリの設定
WORKDIR /var/www/html

COPY ./BrowserGame /var/www/html/BrowserGame
COPY ./NodeApp /var/www/html/NodeApp

RUN cd /var/www/html/NodeApp \
&& npm i redis \
cookie-parser

# ポートを公開
EXPOSE 80
# ポートを公開
EXPOSE 3000
# Apacheを起動するコマンド
CMD ["apachectl", "-D", "FOREGROUND"]