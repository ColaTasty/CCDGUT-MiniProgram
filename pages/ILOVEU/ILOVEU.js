// pages/ILOVEU/ILOVEU.js
var topTipInfinite = undefined;
const APP = getApp();
const module = require("ILOVEUModule.js");
// console.log(module);
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowStatement: false,
    anima_show_statement: null,
    anima_hide_statement: null,
    haveNewMessage: false,
    // loadingLike: true,
    // loadingShare: false,
    messages: [],
    isEnd: false,
    app: APP,
    currentTime: (new Date()).valueOf(),
    showInform: false,
    inform: "",
    colorEgg: 0,
    isAdmin: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    // 准备动画
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "ease"
    });
    self.setData({
      anima_hide_statement: animation.opacity(0.3).rotate(0).step().export(),
      anima_show_statement: animation.opacity(1).rotate(90).step().export()
    })
    // 获取测试信息列表
    // module.setMessagesToStorage(
    //   module.getTestMessageItemArray(6)
    // )
    module.init(
      function (res) {
        if (!res.data.canUse) {
          wx.showModal({
            title: "功能暂时关闭",
            content: res.data.inform,
            showCancel: false
          })
          return;
        }
        self.setData({
          showInform: res.data.inform.length > 0,
          inform: res.data.inform
        })
        // 获取消息
        module.getMessages(
          {
            hasCount: 0
          },
          function (res) {
            if (!res.data.isOK) {
              wx.showModal({
                content: res.data.msg,
                showCancel: false,
                comfirmText: "好的！"
              })
              return;
            }
            self.setData({
              messages: res.data.messages,
              isEnd: res.data.isEnd
            })
          }
        )
      }
    )
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
    module.getMessagesFromStorage(
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
    module.clearStorage();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.bindtap_refresh({});
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var self = this;
    if (!self.data.isEnd) {
      module.getMessages(
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
          module.setMessagesToStorage(self.data.messages, () => { });
        })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  bindtap_statementRotate: function () {
    var self = this;
    self.setData({
      isShowStatement: !self.data.isShowStatement
    })
  },

  bindtap_toCurrent: function (e) {
    var self = this,
      mid = e.currentTarget.dataset.mid,
      midx = e.currentTarget.dataset.midx;
    module.setMessagesToStorage(self.data.messages, () => {
      wx.navigateTo({
        url: './current/current?mid=' + mid + "&midx=" + midx,
      })
    });
  },

  bindtap_toWrite: function (e) {
    var self = this;
    self.setData({
      isShowStatement: !self.data.isShowStatement
    })
    wx.navigateTo({
      url: './write/write',
    })
  },

  bindtap_choiceMyself: function (e) {
    var self = this;
    self.setData({
      isShowStatement: !self.data.isShowStatement
    })
    module.setMessagesToStorage(
      self.data.messages,
      function (res) {
        wx.navigateTo({
          url: "./myself/myself"
        })
      }
    );
    // wx.showActionSheet({
    //   itemList: ["我赞/分享过的表白", "我的表白"],
    //   success: function (res) {
    //     self.setData({
    //       isShowStatement: !self.data.isShowStatement
    //     })
    //     wx.navigateTo({
    //       url: "./myself/myself?statement=" + (res.tapIndex == 0 ? 1 : '')
    //     })
    //   }
    // })
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
          }
          var tmp = res.data.message;
          if (typeof (t[midx]["flag"]) !== "undefined")
            tmp["flag"] = t[midx]["flag"];
          t[midx] = tmp;
          self.setData({
            messages: t,
            currentTime: (new Date()).valueOf()
          });
          module.setMessagesToStorage(self.data.messages, () => { });
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
          }
          var tmp = res.data.message;
          if (typeof (t[midx]["flag"]) !== "undefined")
            tmp["flag"] = t[midx]["flag"];
          t[midx] = tmp;
          self.setData({
            messages: t,
            currentTime: (new Date()).valueOf()
          });
          module.setMessagesToStorage(self.data.messages, () => { });
        }
      );
    }
  },

  bindtap_share: function (e) {
    var self = this,
      midx = e.currentTarget.dataset.midx,
      mid = e.currentTarget.dataset.mid;
    module.setMessagesToStorage(self.data.messages, () => {
      wx.navigateTo({
        url: "./current/current?mid=" + mid + "&statement=share&midx=" + midx
      })
    });
  },

  bindtap_refresh: function (e) {
    var self = this;
    self.setData({
      isShowStatement: false
    })
    // 获取消息
    module.getMessages(
      {
        hasCount: 0
      },
      function (res) {
        wx.stopPullDownRefresh();
        if (!res.data.isOK) {
          wx.showModal({
            content: res.data.msg,
            showCancel: false,
            comfirmText: "好的！"
          })
          return;
        }
        self.setData({
          messages: res.data.messages,
          isEnd: res.data.isEnd,
          currentTime: (new Date()).valueOf()
        })
        module.setMessagesToStorage(self.data.messages, () => { });
      }
    )
  },

  bindlongpress_toBeAdmin: function (e) {
    var self = this;
    self.setData({
      colorEgg: self.data.colorEgg + 1
    });
    if (self.data.colorEgg > 9) {
      self.setData({
        isAdmin: true
      })
    }
  },

  bindlongpress_delete: function (target) {
    var self = this;
    if (self.data.isAdmin) {
      wx.vibrateShort({
        complete: function (e) {
          var mid = target.currentTarget.dataset.mid,
            midx = target.currentTarget.dataset.midx;
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
                    module.getMessagesFromStorage(
                      function (res) {
                        var messages = res.data;
                        var front = messages.slice(0, midx);
                        var rear = messages.slice(midx + 1);
                        messages = front.concat(rear);
                        self.setData({
                          messages: messages
                        });
                        module.setMyMessagesToStorage(self.data.messages, () => { });
                      }
                    )
                  }
                )
              }
            }
          })
        }
      });
    } else {
      return;
    }
  }
})