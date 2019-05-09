# Polling、Long Polling、WebSocket
# GET, POST

get直接获取数据
# jquery ajax/ axios跨域
Access to XMLHttpRequest at 'http://localhost:8000/?uuid=276e2ec0-719c-11e9-9087-839929aff691' from origin 'http://localhost:3000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
# fetch
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
# Reference
<small>
[1] caviler.React WebSocket Polling（实时推送）.https://segmentfault.com/a/1190000013588737 [EB/OL] 2018
[2] YoungEvita.Polling、Long Polling、WebSocket.https://www.jianshu.com/p/db3ca83bf7ce [EB/OL] 2018
[3] 王汉炎.node.js依赖express解析post请求四种数据格式.http://www.cnblogs.com/whybxy/p/8690246.html [EB/OL] 2018
[4] serena.fetch api 浅谈.https://cloud.tencent.com/developer/article/1005104 [EB/OL] 2017
[5] serena.fetch api 浅谈.https://cloud.tencent.com/developer/article/1005104 [EB/OL] 2017
</small>