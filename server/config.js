module.exports = {
  httpPort: process.env.PORT || 8080,
  mysqlConfig: {
    host: '127.0.0.1',
    user: 'root',
    password: '123456',
    database: 'user'
  },
  authPage: {
    "login": "weapp/pages/auth/auth?key=",
    "init": "weapp/pages/index/index?key="
  },
  expire: 60
}