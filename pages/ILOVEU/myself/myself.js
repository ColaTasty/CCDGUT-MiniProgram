// pages/ILOVEU/myself/myself.js
const APP = getApp();
const module = require("./../ILOVEUModule.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    messages: [],
    title: "我的表白",
    myself:true,
    isEnd: false,
    app: APP,
    currentTime: (new Date()).valueOf()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    if (!~~options.statement) {
      // 获取我的表白
      module.getMyMessages(
        {
          hasCount: self.data.messages.length
        },
        function (res) {
          if (!res.data.isOK) {
            wx.showModal({
              content: res.data.msg,
              showCancel: false,
              success: function () {
                wx.navigateBack({
                  detail: 1
                });
              }
            })
          }
          self.setData({
            myself:true,
            messages: res.data.messages,
            isEnd: res.data.isEnd
          })
          module.setMyMessagesToStorage(self.data.messages, () => { });
        }
      )
    } else {
      // 获取我赞/分享过的表白
      self.setData({
        title: "我赞/分享过的表白"
      })
    }
    // 测试代码
    // var t = module.getTestMessageItemArray(10);
    // self.setData({
    //   messages: t
    // })
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
    module.getMyMessagesFromStorage(
      function (res) {
        self.setData({
          messages: res.data,
          currentTime: (new Date()).valueOf()
        })
      }
    )
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

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var self = this;
    if (!self.data.isEnd) {
      module.getMyMessages(
        {
          hasCount: self.data.messages.length
        },
        function (res) {
          if (!res.data.isOK) {
            wx.showModal({
              content: res.data.msg,
              showCancel: false,
              success: function () {
                wx.navigateBack({
                  detail: 1
                });
              }
            })
          }
          self.setData({
            messages: self.data.messages.concat(res.data.messages),
            isEnd: res.data.isEnd,
            currentTime: (new Date()).valueOf()
          })
          module.setMyMessagesToStorage(self.data.messages, () => { });
        })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  bindtap_toCurrent: function (e) {
    var mid = e.currentTarget.dataset.mid,
      midx = e.currentTarget.dataset.midx;
    wx.navigateTo({
      url: './../current/current?mid=' + mid + "&midx=" + midx + "&myself=1",
    })
  },

  bindtap_like: function (e) {
    var self = this,
      t = self.data.messages,
      midx = e.currentTarget.dataset.midx,
      mid = e.currentTarget.dataset.mid;
    if (t[midx]["loading_like"]) {
      return;
    }
    t[midx]["loading_like"] = true;
    self.setData({
      messages: t
    });
    if (t[midx]["is_like"]) {
      module.unlikeMessage(
        {
          mid: mid
        },
        function (res) {
          t[midx]["loading_like"] = false;
          if (!res.data.isOK) {
            wx.showModal({
              title: "操作失败",
              content: res.data.msg,
              showCancel: false
            })
            return;
          }
          t[midx] = res.data.message;
          self.setData({
            messages: t,
            currentTime: (new Date()).valueOf()
          });
          module.setMyMessagesToStorage(self.data.messages, () => { });
        }
      )
    }
    else {
      module.likeMessage(
        {
          mid: mid
        },
        function (res) {
          t[midx]["loading_like"] = false;
          if (!res.data.isOK) {
            wx.showModal({
              title: "操作失败",
              content: res.data.msg,
              showCancel: false
            })
            return;
          }
          t[midx] = res.data.message;
          self.setData({
            messages: t,
            currentTime: (new Date()).valueOf()
          });
          module.setMyMessagesToStorage(self.data.messages, () => { });
        }
      );
    }
  },

  bindtap_share: function (e) {
    var self = this,
      midx = e.currentTarget.dataset.midx,
      mid = e.currentTarget.dataset.mid;
    module.setMyMessagesToStorage(self.data.messages, () => {
      wx.navigateTo({
        url: "./../current/current?mid=" + mid + "&statement=share&midx=" + midx
      })
    });
  },

  bindlongpress_delete: function (e) {
    var self = this,
      mid = e.currentTarget.dataset.mid;
    wx.vibrateShort({
      complete: function (e) {
        wx.showActionSheet({
          itemList: ["删除"],
          itemColor: "red",
          success: function (res) {
            if (res.tapIndex === 0) {
              // 发送删除请求
              module.deleteMessages(
                {
                  mid: mid
                },
                function (res) {
                  if (!res.data.isOK) {
                    wx.showModal({
                      title: "删除失败",
                      content: res.data.msg,
                      showCancel: false
                    })
                    return;
                  }
                  wx.showToast({
                    title: '删除成功',
                    icon: 'success',
                    duration: 2000
                  });
                  // 刷新列表
                  module.getMyMessages(
                    {
                      hasCount: 0
                    },
                    function (res) {
                      if (!res.data.isOK) {
                        wx.showModal({
                          content: res.data.msg,
                          showCancel: false,
                          success: function () {
                            wx.navigateBack({
                              detail: 1
                            });
                          }
                        })
                      }
                      self.setData({
                        messages: res.data.messages,
                        isEnd: res.data.isEnd,
                        currentTime: (new Date()).valueOf()
                      })
                      module.setMyMessagesToStorage(self.data.messages, () => { });
                    })
                }
              )
            }
          }
        })
      }
    })
  }
})