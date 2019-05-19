# error
## jquery ajax/ axios跨域
Access to XMLHttpRequest at 'http://localhost:8000/?uuid=276e2ec0-719c-11e9-9087-839929aff691' from origin 'http://localhost:3000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
## fetch
Error: Unexpected end of input
```js
// client/app.js
var url = basicUrl + '?uuid=' + uuidv1();
    var options = {
      mode: 'no-cors',
    };  
    fetch(url, options)
    .then(res => res.json())
    .then(
      (result) => {
        console.log(result)
        this.setState({
          isLoaded: true,
          key: result
        });
      },
      (error) => {
        
        this.setState({
          isLoaded: true,
          error
        });
      }
    )
// server/app.js
app.use(bodyParser.json());
app.get('/', function(req, res) {
  var uuid = req.query.uuid;

  var secret = 'abcdefg';
  var hash = crypto.createHmac('sha256', secret)
                    .update(uuid)
                    .digest('hex');
  var result = {
    key: hash
  };
  res.send(result.key);
});
app.listen(port, () => {
  console.log('Example app listening on port ', port)
})
```
## now-cli socket 跨域
如何制造跨域
I've also checked that you have socket commands on index.js. We don't support sockets yet...
对外报错为跨域
## namespace
使用uuid作为namespace
如何维护namespace中的变量，
chat的服务端连接内部没有做任何变量存储
~~如何同时监听多个namespace,必须引入存储方案~~
## 有效期
将uuid存有效期,过期释放,
- 每次监听会话先判断是否还在保存着，如果否，则告知已过期
- 客户端计时，到时向服务端发送消息（断网情况）
- 定时函数, 无法自动清除所有超期的

```js
[
  {
    channel: '91c150d0-7954-11e9-b402-f5d37c6acffc',
    user: [
      'client => 91f5a740-7954-11e9-b402-f5d37c6acffc',
      'weapp => 91f5a740-7954-11e9-b402-f5d37c6acffc'
    ],
    expired: 
  },
]
{
  '91c150d0-7954-11e9-b402-f5d37c6acffc': [
    'client => 91f5a740-7954-11e9-b402-f5d37c6acffc',
    'weapp => 91f5a740-7954-11e9-b402-f5d37c6acffc'
  ]
}
```
## 连接身份验证
在namespace下发到客户端后，如果泄露，其他客户端也可通过此namespace直接访问socket,从而uuid失效,不能唯一标记客户端来源

# tools
## 获取请求者的ip
- [ipware](https://www.npmjs.com/package/ipware)
```js
var get_ip = require('ipware')().get_ip;
 app.use(function(req, res, next) {
     var ip_info = get_ip(req);
     console.log(ip_info);
     // { clientIp: '127.0.0.1', clientIpRoutable: false }
     next();
 });
```
- [request-ip](https://www.npmjs.com/package/request-ip)
```js
const requestIp = require('request-ip');
app.use(function(req, res){
  const clientIp = requestIp.getClientIp(req); 
});
```
## 获取定位
[geoip-lite](https://www.npmjs.com/package/request-ip)

# Reference
<small>
[1] caviler.React WebSocket Polling（实时推送）.https://segmentfault.com/a/1190000013588737 [EB/OL] 2018
    
[2] YoungEvita.Polling、Long Polling、WebSocket.https://www.jianshu.com/p/db3ca83bf7ce [EB/OL] 2018

[3] 王汉炎.node.js依赖express解析post请求四种数据格式.http://www.cnblogs.com/whybxy/p/8690246.html [EB/OL] 2018

[4] serena.fetch api 浅谈.https://cloud.tencent.com/developer/article/1005104 [EB/OL] 2017

[5] 枫奇.NodeJS连接Redis实现增删改查.https://blog.csdn.net/qiqiyingse/article/details/83114168 [EB/OL] 2018

[6] hudiefeo.Websocket 实现扫码二维码登录.https://www.cnblogs.com/EmmaGong/p/6007724.html [EB/OL] 2016
</small>
