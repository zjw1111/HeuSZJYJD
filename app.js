//app.js
const AV = require('./utils/av-weapp-min.js');

// LeanCloud 应用的 ID 和 Key
AV.init({
  appId: 'hhycUNXegkN3LFvOTuTFEV6N-gzGzoHsz',
  appKey: 'dQBblUwM5AzMQQ042vQfcM9Q',
});

App({
  onLaunch: function () {
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    AV.User.loginWithWeapp().then(user => {
      wx.setStorage({
        key: "user",
        data: user
      })
    }).catch(console.error);
  },
  globalData: {
    userInfo: null
  }
})