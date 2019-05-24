// pages/ILOVEU/current/current.js
const APP = getApp();
const module = require("../ILOVEUModule.js");
var t_messages = undefined;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    year: APP.systemInfo.year,
    message: {
      loading_like: true,
      loading_share: true,
      time: (new Date()).valueOf()
    },
    midx: 0,
    myself: false,
    share: false,
    app: APP,
    currentTime: (new Date()).valueOf()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    // 测试代码
    // var t = module.getTestMessageItemArray(1)[0];
    // self.setData({
    //   message: t
    // });
    // 正式代码
    if (!~~options.mid && isNaN(options.mid)) {
      wx.showModal({
        title: '无效的访问',
        content: '请从正常渠道访问',
        showCancel: false,
        confirmText: "好的",
        success: function (e) {
          if (e.confirm)
            wx.reLaunch({
              url: '../../index/index?redirect=../ILOVEU/ILOVEU',
            })
        }
      })
    } else {
      self.setData({
        mid: options.mid
      })
    }
    // 进入场景，分享或我的
    self.setData({
      myself: typeof (options.myself) !== "undefined",
      share: typeof (options.share) !== "undefined"
    })
    // 触发分享提示
    if (typeof (options.statement) !== "undefined" && options.statement == "share") {
      wx.showModal({
        title: "分享表白",
        content: "只可以在本界面右上角分享这个表白哦^_^",
        showCancel: false
      })
    }
    // 获取表白
    module.getSpecificMessage(
      {
        mid: options.mid
      },
      function (res) {
        // 设置延时通知
        var timeout = setTimeout(
          function (e) {
            wx.showModal({
              title: "获取失败",
              content: "请下拉界面刷新一下",
              showCancel: false
            });
          }
          , 5000);
        if (!res.data.isOK) {
          wx.showModal({
            title: "查找失败",
            content: res.data.msg + "，请重试",
            showCancel: false
          })
          return;
        }
        var message = res.data.message;
        self.setData({
          message: message,
          currentTime: (new Date()).valueOf()
        })
        // 设置成功就取消延时通知
        clearTimeout(timeout);
        // 如果没有索引进行访问，那就是刚创建好的访问，将新的表白添加到主页的表白列表即可
        if (typeof (options.midx) === "undefined") {
          module.getMessagesFromStorage(
            function (res) {
              t_messages = res.data;
              t_messages.unshift(message);
              module.setMessagesToStorage(
                t_messages, () => {
                  self.setData({
                    midx: 0,
                    message: message,
                    currentTime: (new Date()).valueOf()
                  })
                }
              )
            }
          )
        } else
          self.setData({
            midx: options.midx,
            message: message,
            currentTime: (new Date()).valueOf()
          })
      },
      function (res) {
        wx.showToast({
          title: "如果等待过长，可以下拉刷新一下"
        })
      }
    )
    // console.log(APP.systemInfo);
    // console.log(wx.getMenuButtonBoundingClientRect());
    // console.log("mid : " + options.mid);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var self = this;
    self.setData({
      currentTime: (new Date()).valueOf()
    })
    if (typeof (t_messages) == "undefined") {
      if (self.data.myself)
        module.getMyMessagesFromStorage(
          function (res) {
            t_messages = res.data;
          }
        )
      else if (self.data.share) { }
      else
        module.getMessagesFromStorage(
          function (res) {
            t_messages = res.data;
          }
        )
    }

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var self = this;
    module.getSpecificMessage(
      {
        mid: self.data.message.mid
      },
      function (res) {
        var message = res.data.message;
        if (self.data.myself)
          module.getMyMessagesFromStorage(
            function (res) {
              t_messages = res.data;
              t_messages[self.data.midx] = message;
              self.setData({
                midx: self.data.midx,
                message: message,
                currentTime: (new Date()).valueOf()
              })
              module.setMyMessagesToStorage(t_messages, () => { });
            }
          )
        else if (self.data.share) { }
        else
          module.getMessagesFromStorage(
            function (res) {
              t_messages = res.data;
              t_messages[self.data.midx] = message;
              self.setData({
                midx: self.data.midx,
                message: message,
                currentTime: (new Date()).valueOf()
              })
              module.setMessagesToStorage(t_messages, () => { });
            }
          )
      }
    )
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var self = this;
    module.getSpecificMessage(
      {
        mid: self.data.mid
      },
      function (res) {
        wx.stopPullDownRefresh();
        if (res.data.isOK)
          self.setData({
            message: res.data.message
          })
        else {
          wx.showModal({
            title: "查找失败",
            content: res.data.msg + "，请重试",
            showCancel: false
          })
          return;
        }
      })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var self = this;
    module.shareMessage(
      {
        mid: self.data.message.mid
      },
      function (res) {
        if (!res.data.isOK) {
          wx.showModal({
            content: "糟糕，贴吧服务器连接出错了,不过不影响你的分享噢",
            confirmText: "好的，知道了",
            showCancel: false
          })
          return;
        }
        self.setData({
          message: res.data.message,
          currentTime: (new Date()).valueOf()
        })
        t_messages[self.data.midx] = res.data.message;
        if (self.data.myself)
          module.setMyMessagesToStorage(
            t_messages,
            () => { }
          )
        else if (self.data.share) { }
        else
          module.setMessagesToStorage(
            t_messages,
            () => { }
          )
      },
      function (res) {
        wx.showModal({
          content: "糟糕，贴吧服务器连接出错了,不过不影响你的分享噢",
          confirmText: "好的，知道了",
          showCancel: false
        })
      }
    );
    return {
      title: "我在贴吧表白墙看到了有人向你表白！",
      path: "/pages/ILOVEU/current/current?mid=" + self.data.message.mid + "&share=1",
      imageUrl: "./../../src/biaobaiqiang_share.png"
    }
  },

  bindtap_like: function (e) {
    var self = this,
      t = self.data.message,
      midx = self.data.midx,
      mid = e.currentTarget.dataset.mid;
    if (t["loading_like"]) {
      return;
    }
    t["loading_like"] = true;
    self.setData({
      message: t
    });
    if (t["is_like"]) {
      module.unlikeMessage(
        {
          mid: mid
        },
        function (res) {
          t = res.data.message;
          t["loading_like"] = false;
          if (!res.data.isOK) {
            wx.showModal({
              title: "操作失败",
              content: res.data.msg,
              showCancel: false
            })
          }
          self.setData({
            message: t,
            currentTime: (new Date()).valueOf()
          });
          t_messages[self.data.midx] = t;
          if (self.data.myself)
            module.setMyMessagesToStorage(
              t_messages,
              () => { }
            )
          else if (self.data.share) { }
          else
            module.setMessagesToStorage(
              t_messages,
              () => { }
            )
        }
      )
    }
    else {
      module.likeMessage(
        {
          mid: mid
        },
        function (res) {
          t = res.data.message;
          t["loading_like"] = false;
          if (!res.data.isOK) {
            wx.showModal({
              title: "操作失败",
              content: res.data.msg,
              showCancel: false
            })
          }
          // t["is_like"] = res.data.isOK;
          self.setData({
            message: t,
            currentTime: (new Date()).valueOf()
          });
          t_messages[self.data.midx] = t;
          if (self.data.myself)
            module.setMyMessagesToStorage(
              t_messages,
              () => { }
            )
          else if (self.data.share) { }
          else
            module.setMessagesToStorage(
              t_messages,
              () => { }
            )
        }
      )
    }
  },

  bindtap_share: function (e) {
    wx.showModal({
      title: "分享表白",
      content: "只可以在本界面右上角分享这个表白哦^_^",
      showCancel: false
    })
  }
})