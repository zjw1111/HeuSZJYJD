//index.js
//获取应用实例
var flag = true;
var color = ""
var ID = 0;
var app = getApp()
Page({
  data: {
    width: 0
  },

  btntap: function () {
    wx.showModal({
      title: '重要说明',
      content: '本程序目前为测试版本，需配合对应的前端页面才能使用。若有需求请联系admin@zjw1.top',
      showCancel: false,
    })
  },
  
  onLoad: function () {
    console.log('onLoad')
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.windowHeight)
        that.setData({
          width: res.screenWidth
        })
      }
    })
    
  }
})
