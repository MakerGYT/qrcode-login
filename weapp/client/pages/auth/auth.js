// pages/auth/auth.js
const io = require('../../utils/weapp.socket.io.js');
const { debug } = require('../../utils/util');
const { serverUrl } = require('../../config');
let app = getApp();
const isDebug = app.globalData.isDebug;
Page({
  onLoad: function (options) {
    console.log(options.key);
    this.connectSocket(options.key);
    wx.cloud.callFunction({
      name: 'user',
      complete: res => {
        this.setData({
          key: options.key,
          openid: res.result.openid
        });

      }
    })
  },
  data: {
    auth: {
      state: false,
    }
  },
  onUnload() {
    // this.socket.emit('auth', 'reject');
    this.disconnectSocket()
  },
  authorize: function () {
    var userInfo = {
      openid: this.data.openid,
    }
    let that = this;
    this.socket.emit('auth', userInfo);
    this.socket.on('auth result', (res) => {
      var authResult = res;
      console.log('auth result', authResult);
      // this.disconnectSocket();

      if (authResult.code === 1) {
        wx.showToast({
          title: 'success',
          icon: 'success',
          duration: 2000,
          complete: () => {
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
            }, 2000);
          }
        })
        this.setData({
          auth: {
            state: true,
            msg: 'auth success'
          }
        });
      } else {
        wx.showModal({
          title: 'Failed',
          content: 'You do not have login rights，Are you applying now?',
          showCancel: true,
          success: (result) => {
            if (result.confirm) {
              wx.showToast({
                title: 'applyed',
                icon: 'loading',
                duration: 2000
              })
              wx.request({
                url: serverUrl + 'applyAuth',
                method: 'post',
                data: {
                  userInfo: userInfo
                },
                success(res) {
                  if (res.data.code === 1) {
                    wx.showToast({
                      title: 'apply send',
                      icon: 'none',
                      duration: 2000
                    })
                    setTimeout(function () {
                      wx.navigateBack({
                        delta: 1
                      })
                    }, 2000);
                    that.setData({
                      auth: {
                        state: true,
                        msg: 'applying'
                      }
                    });
                  }
                },
                complete(res) {
                  debug('apply auth res', res, isDebug);
                }
              })
            } else {
              that.setData({
                auth: {
                  state: true,
                  msg: 'no authority'
                }
              });
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1
                })
              }, 2000);
            }
          }
        });
      }



    });
  },
  reject: function () {
    this.socket.emit('auth', 'reject');
    this.setData({
      auth: {
        state: true,
        msg: 'user reject'
      }
    });
  },
  connectSocket: function (channel) {
    let that = this;
    var url = serverUrl + '?channel=' + channel;
    const socket = (this.socket = io(
      url,
    ))
    socket.on('connect', () => {
      debug('socket.connected', socket.connected, isDebug);
      socket.emit('scan', (res) => {
        console.log('weapp scaned', res);
      });
    })
    socket.on('Invalid code', function () {

      wx.showModal({
        title: 'Failed',
        content: 'Invalid code',
        showCancel: false,
        success: (res) => {
          if (res.confirm) {
            wx.navigateBack({
              delta: 1
            })
          }
        }
      });

    });
    socket.on('expired', function () {
      wx.showModal({
        title: 'Failed',
        content: 'expired',
        showCancel: false,
        success: (res) => {
          if (res.confirm) {
            wx.navigateBack({
              delta: 1
            }) // onUnload
          }
        }
      });
    });
    socket.on('connect_error', err => {
      debug('error', err, isDebug);
      wx.showModal({
        title: 'Failed',
        content: 'connect_error',
        showCancel: false,
        success: (res) => {
          if (res.confirm) {
            wx.navigateBack({
              delta: 1
            })
          }
        }
      });
    })
  },
  disconnectSocket: function () {
    this.socket.emit('leave', 'weapp');
    if (this.socket) {
      this.socket.close()
      this.socket = null
    }
  },
})