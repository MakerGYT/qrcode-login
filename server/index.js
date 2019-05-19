const express = require('express');
const app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

const { httpPort, mysqlConfig, authPage, expire } = require('./config');

const bodyParser = require('body-parser');
const requestIp = require('request-ip');

const mysql = require('mysql');
var connection = mysql.createConnection(mysqlConfig);
connection.connect();
const table = 'admin';

var redis = require("redis"),
  redisClient = redis.createClient();
redisClient.on("error", function (err) {
  console.log("Error " + err);
});
/**
 * send uuid
 */
var allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
};
app.use(allowCrossDomain);
app.use(bodyParser.json());

/**
 * qrcode:
 * @param: uuid, action
 * @returns: qrCodeUrl
 */
app.post('/qrcode', function (req, res) {
  const clientIp = requestIp.getClientIp(req);
  // check ip
  var checkIpResult = true || checkIp(clientIp);
  // check action
  var checkAction = (req.body.action in authPage) ? true : false;
  if (!checkIpResult) {
    var uuidResult = {
      code: 401,
      msg: "Unauthorized ip"
    }
    res.send(uuidResult);
  } else if (!checkAction) {
    var uuidResult = {
      code: 402,
      msg: "Unauthorized action"
    }
    res.send(uuidResult);
  } else {
    var uuid = req.body.uuid;
    var action = req.body.action;

    var uuidResult = {
      code: 1,
      uuid: uuid,
      qrCodeContent: authPage[action] + uuid,
      expire: expire,
      msg: "success"
    }
    res.send(uuidResult);
  }

})
/**
 * authority
 */
app.post('/applyAuth', function (req, res) {
  var addSql = 'INSERT INTO ' + table + '(Id,openid,authority,time) VALUES(0,?,?,?)';
  var addSqlParams = [req.body.userInfo.openid, 'admin', new Date()];
  connection.query(addSql, addSqlParams, function (err, result) {
    if (err) {
      console.log('[INSERT ERROR] - ', err.message);
      return;
    }
    var applyResult = {
      code: 1,
      msg: result
    }
    console.log('applyAuth', req.body.userInfo.openid, applyResult);
    /**
     * @ignore admin examine and verify
     * ...
     */
    res.send(applyResult);
  });
})
function checkAuthority(openid, callback) {
  var sql = 'SELECT * FROM ' + table + ' WHERE openid= ? ';
  connection.query(sql, openid, function (err, result) {
    if (err) {
      console.log('[SELECT ERROR] - ', err.message);
      return;
    }
    console.log('checkAuthority', result);
    var authResult = {
      code: 0,
    }
    if (result.length !== 0) {
      authResult = {
        code: 1,
        authority: result[0].authority // 
      }
    }
    callback(authResult);
  });
}
/**
 * socket connection
 */
redisClient.flushdb();
io.use((socket, next) => {
  let channel = socket.handshake.query.channel;
  /**
   * @ignore: check channel
   * ...
   */
  var checkChannelResult = true;
  redisClient.scard(channel, function (err, replay) {
    if (err) {
      console.log(err);
    } else if (replay === 2) {
      checkChannelResult = false;
      console.warn('someone is connecting');
    }
  });
  if (checkChannelResult) {
    return next();
  }
  return next(new Error('authentication error'));
});
io.on('connection', function (socket) {
  let channel = socket.handshake.query.channel;
  /**
    * @description expired
    */

  var user = '';
  socket.on('listen', function (uuid) {
    user = 'client => ' + uuid;
    redisClient.sadd(channel, user);
    redisClient.expire(channel, expire);
    var interval = expire * 1000;
    console.log(interval);
    setTimeout(function () {
      redisClient.exists(channel, function (err, replay) {
        if (err) {
          console.log(err);
        } else if (replay === 0) {
          console.log(replay);
          io.to(channel).emit('expired');
        }
      })
    }, interval);
    socket.join(channel, () => {
      io.to(channel).emit('sys', user);
      console.log('client is listening', channel);
    });
  });
  socket.on('scan', () => {
    socket.join(channel, () => {
      redisClient.exists(channel, function (err, replay) {
        if (err) {
          console.log(err);
        } else if (replay === 0) {
          io.to(channel).emit('Invalid code');
        } else {
          user = 'weapp => ' + channel;
          redisClient.sadd(channel, user);
          io.to(channel).emit('isScan', user);
          console.log('qrcode is scaned', channel);
        }
      });
    });
  });
  socket.on('auth', function (msg) {
    console.log('auth', msg);

    redisClient.exists(channel, function (err, replay) {
      if (err) {
        console.log(err);
      } else if (replay === 0) {
        io.to(channel).emit('expired');
      } else {
        if (msg === 'reject') {
          io.to(channel).emit('auth result', 'user reject');
        } else {
          checkAuthority(msg.openid, function (res) {
            io.to(channel).emit('auth result', res);
          });
        }
      }
    });
  });
  socket.on('expired', function () {
    io.to(channel).emit('sys', 'expired => ' + channel);
    console.log('expired', channel);
  });
  socket.on('leave', function (msg) {
    redisClient.smembers(channel, function (err, replay) {
      if (err) {
        console.log(err);
      } else {
        console.log('leave', msg, replay);
      }
    });
    socket.emit('disconnect');
    redisClient.exists(channel, function (err, replay) {
      if (err) {
        console.log(err);
      } else {
        console.log('end' + channel, replay);
      }
    });
  });
  socket.on('disconnect', function () {
    console.log('disconnect', channel);
    socket.leave(channel);
    redisClient.del(channel);
  });
});
http.listen(httpPort, () => {
  console.log('listen on ', httpPort);
});
//io.listen(port);
module.exports = app