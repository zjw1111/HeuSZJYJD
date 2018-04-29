// 获取应用实例
let app = getApp();
const AV = require('../../utils/av-weapp-min.js');
let wxParser = require('../../wxParser/index');

Page({
  data: {
    html: "0000",
    title: ""
  },

  btntap: function () {
    wx.navigateBack({
      delta: 1
    })
  },

  onLoad: function () {
    let that = this;

    new AV.Query('richtext')
      .equalTo('description', 'help')
      .find()
      .then(res => {
        this.setData({
          html: res[0].attributes.content,
          title: res[0].attributes.title
        })
        wxParser.parse({
          bind: 'richText',
          html: that.data.html,
          target: that,
          enablePreviewImage: true,
          tapLink: (url) => {
            wx.navigateTo({
              url
            })
          }
        });
      })
      .catch(console.error);
  }
})
