//index.js
//获取应用实例
const app = getApp()
const {basicUrl} = require('../config')
Page({
  data: {
    
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  scanCode: function() {
    let that = this;
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        var key = res.result;
        that.setData({
          key: key
        });
        wx.showLoading({
          title: 'Loading',
        })
        wx.request({
          url: basicUrl,
          data: {
            key: key
          },
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success(res) {
            that.setData({
              result: JSON.stringify(res.data)
            });
            wx.hideLoading()
          },
          fail(err){
            that.setData({
              result: err.errMsg
            });
            wx.hideLoading()
          }
        });
      },
    })
  },
  onLoad: function () {
    
  },
})
