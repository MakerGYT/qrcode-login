//app.js
const { debug } = require('config');
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);


    wx.cloud.init({
      env: "test-728bbc"
    });
  },
  globalData: {
    isDebug: debug
  }
})