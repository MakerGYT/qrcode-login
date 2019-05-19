module.exports = {
  httpPort: process.env.PORT || 8080,
  mysqlConfig: {
    host: '114.115.180.168',
    user: 'test',
    password: 'test',
    database: 'user'
  },
  authPage: {
    "login": "weapp/pages/auth/auth?key=",
    "init": "weapp/pages/index/index?key="
  },
  expire: 60
}