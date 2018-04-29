const AV = require('../../utils/av-weapp-min.js');

Page({
  data: {
    Number: 1,
    height: 500,
    hiddenToast_succ: true,
    hiddenToast_fail: true,
    idc:"clear",
    id9:"9",
    id8:"8",
    id7:"7",
    id6:"6",
    id5:"5",
    id4:"4",
    idx:"×",
    id3:"3",
    id2:"2",
    id1:"1",
    id0:"0",
    ide:"＝",
    screenData:"\n",
    arr:[],
    listData: [],
    map: {}
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady:function(){
    // 页面渲染完成
    let that = this
    setTimeout(function () {
      var query = wx.createSelectorQuery()
      query.select('.getheight').boundingClientRect()
      query.selectViewport().scrollOffset()
      query.exec(function (res) {
        console.log(parseInt(res[0].height));
        console.log(res[0]);
        that.setData({
          height: res[0].height * 750 / res[0].width
        })
      })
    }, 150);
    setTimeout(function() {
      that.setData({
        Number: wx.getStorageSync('user').Number
      })
    }, 800)

    var cql = 'select * from TOUPIAO where id in (select id from available where available=true) order by id';
    AV.Query.doCloudQuery(cql).then(function (data) {
      // results 即为查询结果，它是一个 AV.Object 数组
      var res = data.results;
      console.log(res)

      var temp = [];
      for (var i = 0; i < res.length / 3; i++) {
        if (i * 3 + 2 < res.length) {
          temp.push({
            id1: res[i * 3].attributes.id,
            name1: res[i * 3].attributes.name,
            id2: res[i * 3 + 1].attributes.id,
            name2: res[i * 3 + 1].attributes.name,
            id3: res[i * 3 + 2].attributes.id,
            name3: res[i * 3 + 2].attributes.name
          })
        } else if (i * 3 + 1 < res.length) {
          temp.push({
            id1: res[i * 3].attributes.id,
            name1: res[i * 3].attributes.name,
            id2: res[i * 3 + 1].attributes.id,
            name2: res[i * 3 + 1].attributes.name
          })
        } else {
          temp.push({
            id1: res[i * 3].attributes.id,
            name1: res[i * 3].attributes.name
          })
        }
      }
      console.log(temp);
      var map = new Object();
      for (var i = 0; i < res.length; i++) {
        map[res[i].attributes.id] = res[i].id;
      }
      that.setData({
        listData: temp,
        map: map
      })
    }, function (error) {
    });
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  // toast显示时间到时处理业务
  toastHidden: function () {
    this.setData({
      hiddenToast_succ: true,
      hiddenToast_fail: true
    })
  },
  clickBtn:function(event){
    var that = this;
    var id = event.target.id;
    if(id == this.data.idc){  //清屏C
      this.setData({"screenData":"0"});
      this.data.arr.length = 0;
    }else if(id == this.data.ide){  //等于＝
      var data = this.data.screenData;
      if (data == "\n" || data == "0") {
          return;
      }
      var lastWord = data.charAt(data.length);
      if(isNaN(lastWord)){
        return;
      }
      var num = "";
      var lastOperator = "";
      var arr = this.data.arr;
      var optarr = [];
      for(var i in arr){
        if(isNaN(arr[i]) == false || arr[i] == this.data.idd || arr[i] == this.data.idt){
          num += arr[i];
        }else{
          lastOperator = arr[i];
          optarr.push(num);
          optarr.push(arr[i]);
          num = "";
        }
      }
      optarr.push(Number(num));
      var result = Number(optarr[0]);
      console.log(result);
      
      console.log(that.data.Number)
      if (that.data.Number < 1) {
        wx.showModal({
          title: '提示',
          content: '您已投过票，暂无投票权利！',
          showCancel: false,
        })
      } else {
        var todo = AV.Object.createWithoutData('TOUPIAO', that.data.map[result] != undefined ? that.data.map[result] : "5a865032ee920a009f6fdsb1");
        todo.save().then(function (todo) {
          todo.increment('count', 1);
          todo.fetchWhenSave(true);
          return todo.save();
        }).then(function (todo) {
          // 使用了 fetchWhenSave 选项，save 成功之后即可得到最新的 views 值
          that.setData({
            hiddenToast_succ: false,
            Number: that.data.Number - 1,
            "screenData": "\n"
          });
        }, function (error) {
          // 异常处理
          console.log("Error!", result)
          that.setData({
            // hiddenToast_fail: false,
            "screenData": "\n"
          });
          wx.showModal({
            title: '投票失败',
            content: '编号输入错误或网络繁忙，请重试！',
            showCancel: false,
          })
        });
        this.data.arr.length = 0;
      }

    }else{    // 普通数字
      var sd = this.data.screenData;
      var data;
      if(sd == 0){
        data = id;
      }else{
        data = sd + id;
      }
      this.setData({"screenData":data});
      this.data.arr.push(id);
    }
  }
})