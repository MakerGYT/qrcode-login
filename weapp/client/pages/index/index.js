//index.js
//获取应用实例
const { clientUrl } = require('../../config');
Page({
  data: {

  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {

  },
  scanCode: function () {
    let that = this;
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        var qrCodeUrl = res.result;
        // check qrcode 
        if (qrCodeUrl.indexOf(clientUrl) === 0) {
          var scanContent = qrCodeUrl.replace(clientUrl + 'weapp', "");
          wx.navigateTo({
            url: scanContent
          })
        } else {
          console.log(qrCodeUrl)
          console.log(clientUrl)
          wx.showModal({
            title: 'Error',
            content: 'what are you scanning',
            showCancel: false,
            confirmText: 'I got it'
          })
        }
      },
    })
  },
})
