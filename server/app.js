const express = require('express');
var app = express();
const bodyParser = require('body-parser');
const crypto = require('crypto');
//var http = require('http').Server(app);
//var io = require('socket.io')(http);
var port = process.env.PORT || 8000;
var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials','true');
  next();
};
var qrResult = {};
app.use(allowCrossDomain);
app.use(bodyParser.json());
app.get('/', function(req, res) {
  var uuid = req.query.uuid;
  var secret = 'abcdefg';
  var hash = crypto.createHmac('sha256', secret)
                    .update(uuid)
                    .digest('hex');
  qrResult = {
    key: hash
  };
  res.send(qrResult);
});
app.use(bodyParser.urlencoded({
  extended:true
}));
app.post('/', function (req, res) {
  console.log('req.body',req.body);
  console.log('qrResult',qrResult);
  if (req.body.key === qrResult.key) {
    
    var scanResult = {
      code: 1,
      msg: "success"
    }
    res.send(scanResult);
  } else {
    var scanResult = {
      code: 0,
      msg: "failed"
    }
    res.send(scanResult);
  }
  
  
})
app.listen(port, () => {
  console.log('Example app listening on port ', port)
})