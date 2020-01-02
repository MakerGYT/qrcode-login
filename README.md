# Scan QRcode to login
Refer to [扫描二维码分析](https://blog.makergyt.com/zh-CN/%E6%89%AB%E6%8F%8F%E4%BA%8C%E7%BB%B4%E7%A0%81%E5%88%86%E6%9E%90/)
![](https://cdn.blog.makergyt.com/images/study-scan_login-structure.jpg)
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
