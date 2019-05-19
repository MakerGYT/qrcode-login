# Scan QRcode to login
[![GitHub issues](https://img.shields.io/github/issues/MakerGYT/qrcode-login.svg)](https://github.com/MakerGYT/qrcode-login/issues)
[![GitHub license](https://img.shields.io/github/license/MakerGYT/qrcode-login.svg)](https://github.com/MakerGYT/qrcode-login)
## server
express

```sh
cnpm i
# config.js
module.exports = {
  httpPort: process.env.PORT || 8080,
  mysqlConfig: {
    host: '',
    user: '',
    password: '',
    database: ''
  },
  authPage: {
    "login": "weapp/pages/auth/auth?key=",
    "init": "weapp/pages/index/index?key="
  },
  expire: 60
}
```
mysql
```sh
mysql -u root -p
create database <qrcode>;
create user '<qrcode>'@'%' identified by '<qrcode>'; 
grant all on <qrcode>.* to  '<qrcode>'@'%';
flush privileges;
use <qrcode>;
source db.sql
```
redis
```sh
redis-server
```
## client
create-react-app
```sh
cnpm i
# src/config.js
module.exports = {
  clientUrl: "http://localhost:3000/", # domain
  serverUrl: "http://localhost:8080/", # server
}
```
## weapp
```sh
# project.config.json
"appid": "",
# client/config.js
module.exports = {
  clientUrl: "http://localhost:3000/", # domain
  serverUrl: "http://localhost:8080/", # server
  debug: true,
}
```
upload deploy cloud