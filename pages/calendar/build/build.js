// pages/calendar/build/build.js
const Dialog = require('../../../zanui-components/dialog/dialog');
const app = getApp();

var init_table_item = [{
  time: {
    hour: null,
    minute: null
  },
  value: null
}, {
  time: {
    hour: null,
    minute: null
  },
  value: null
}, {
  time: {
    hour: null,
    minute: null
  },
  value: null
}, {
  time: {
    hour: null,
    minute: null
  },
  value: null
}, {
  time: {
    hour: null,
    minute: null
  },
  value: null
}, {
  time: {
    hour: null,
    minute: null
  },
  value: null
}, {
  time: {
    hour: null,
    minute: null
  },
  value: null
}, {
  time: {
    hour: null,
    minute: null
  },
  value: null
}, {
  time: {
    hour: null,
    minute: null
  },
  value: null
}, {
  time: {
    hour: null,
    minute: null
  },
  value: null
}];

var init_days = [{
  day: "星期一",
  checked: "nav-item cur",
  item: init_table_item
}, {
  day: "星期二",
  checked: "nav-item",
  item: init_table_item
}, {
  day: "星期三",
  checked: "nav-item",
  item: init_table_item
}, {
  day: "星期四",
  checked: "nav-item",
  item: init_table_item
}, {
  day: "星期五",
  checked: "nav-item",
  item: init_table_item
}, {
  day: "星期六",
  checked: "nav-item",
  item: init_table_item
}, {
  day: "星期日",
  checked: "nav-item",
  item: init_table_item
}, ];
var haveLast;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    app: app,
    step: 0,
    days: init_days,
    days_index: 0,
    table_name: null,
    canNext: false,
    finishText: "完成创建10s",
    isPageLoading: true,
    isSuccess: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.getStorage({
      key: 'table_name',
      success: function(res) {
        if (res.data != null) {
          that.setData({
            table_name: res.data
          })
          wx.getStorage({
            key: 'days_backup',
            success: function(res) {
              that.setData({
                step: 1,
                days: res.data
              })
            },
          })
        }
      },
    })
    // if (wx.getStorageSync("table_name") != null)
    //   this.setData({
    //     step: 1,
    //   })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    wx.getStorage({
      key: 'table_edit',
      success: function(res) {
        if (res.data) {
          var table_item;
          var d = that.data.days;
          wx.getStorage({
            key: 'table_tmp',
            success: function(res) {
              table_item = res.data;
              d[that.data.days_index].item = table_item;
              that.setData({
                days: d,
                canNext: true
              });
              wx.setStorage({
                key: 'days_backup',
                data: that.data.days,
                success: (e) => {
                  wx.setStorageSync("table_edit", false);
                }
              })
            },
          });
        }
      },
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    wx.getStorage({
      key: 'table_tmp',
      success: function(res) {
        if (res.data != null) {
          wx.showModal({
            title: '确定退出吗？',
            content: '这将不保存已输入好的信息噢，请三思',
            showCancel: true,
            confirmText: "退出",
            cancelText: "考虑一下",
            confirmColor: "black",
            cancelColor: "red",
            success: (res) => {
              if (res.confirm) {
                wx.removeStorageSync("table_tmp");
                wx.removeStorageSync("table_edit");
                wx.removeStorageSync("table_name");
                wx.removeStorageSync("days_backup");
              }
              if (res.cancel) {
                wx.navigateTo({
                  url: './build/build',
                })
              }
            }
          })
        }
      },
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  bindchange_tableName: function(e) {
    if (e.detail.value.length > 0)
      this.setData({
        table_name: e.detail.value,
        canNext: true
      });
    else
      this.setData({
        canNext: false
      });
  },

  bindtap_last: function(e) {
    haveLast = this.data.canNext;
    this.setData({
      step: this.data.step - 1
    })
  },

  bindtap_next: function(e) {
    var that = this;
    this.setData({
      step: this.data.step + 1,
      canNext: haveLast
    })
    if (haveLast)
      haveLast = !haveLast;
    switch (this.data.step) {
      case 1:
        wx.setStorageSync("table_name", this.data.table_name);
        break;
      case 2:
        var timeOut = 10;
        if (!that.data.canNext) {
          var i = setInterval(() => {
            if (timeOut < 0) {
              that.setData({
                finishText: "完成创建",
                canNext: true
              });
              clearInterval(i);
              return;
            }
            that.setData({
              finishText: "完成创建" + timeOut + "s"
            });
            timeOut--;
          }, 1000);
        }
        wx.setStorageSync("days_backup", this.data.days);
        break;
      case 3:
        that.setData({
          isPageLoading: true
        });
        app.requestTo(
          "/wxapp/calendar/buildUp", {
            sessionid: wx.getStorageSync("sessionID"),
            table: JSON.stringify({
              table_name: that.data.table_name,
              Mon: that.data.days[0].item,
              Tue: that.data.days[1].item,
              Wed: that.data.days[2].item,
              Thu: that.data.days[3].item,
              Fri: that.data.days[4].item,
              Sat: that.data.days[5].item,
              Sun: that.data.days[6].item
            }),
          },
          null,
          (res) => {
            that.setData({
              isSuccess: res.data.isOK
            })
            if (!res.data.isOK) {
              Dialog({
                title: "创建失败",
                message: "服务器原因，请反馈",
                selector: '#alter',
              });
            }
          },
          null,
          (res) => {
            that.setData({
              isPageLoading: false
            })
          }
        );
        break;
      default:
        Dialog({
          title: "你不能进入下一步",
          message: "你触发了一个BUG，请反馈",
          selector: '#alter',
        });
        break;
    }
  },

  bindtap_dayChange: function(e) {
    var that = this;
    var d = that.data.days
    for (var i = 0; i < d.length; i++) {
      d[i].checked = "nav-item";
    }
    d[e.currentTarget.dataset.index].checked = "nav-item cur";
    that.setData({
      days: d,
      days_index: e.currentTarget.dataset.index,
    })
  },

  bindtap_buildItem: function(e) {
    // console.log(e);
    var that = this;
    var elem = e;
    wx.setStorage({
      key: 'table_tmp',
      data: this.data.days[this.data.days_index].item,
      success: (e) => {
        wx.setStorageSync("table_edit", false);
        wx.setStorageSync("days_backup", that.data.days);
        wx.navigateTo({
          url: './../build_item/build_item?time_index=' + elem.currentTarget.dataset.timeIndex,
        })
      }
    })
  },

  bindtap_back: (e) => {
    wx.removeStorageSync("table_tmp");
    wx.removeStorageSync("table_edit");
    wx.removeStorageSync("table_name");
    wx.removeStorageSync("days_backup");
    wx.navigateBack({
      detail: 1
    })
  },

  bindtap_reUpload: function(e) {
    var that = this;
    that.setData({
      isPageLoading: true
    });
    app.requestTo(
      "/wxapp/calendar/buildUp", {
        sessionid: wx.getStorageSync("sessionID"),
        table: JSON.stringify({
          table_name: that.data.table_name,
          Mon: that.data.days[0].item,
          Tue: that.data.days[1].item,
          Wed: that.data.days[2].item,
          Thu: that.data.days[3].item,
          Fri: that.data.days[4].item,
          Sat: that.data.days[5].item,
          Sun: that.data.days[6].item
        }),
      },
      null,
      (res) => {
        that.setData({
          isSuccess: res.data.isOK
        })
        if (!res.data.isOK) {
          Dialog({
            title: "创建失败",
            message: "服务器原因，请反馈",
            selector: '#alter',
          });
        }
      },
      null,
      (res) => {
        that.setData({
          isPageLoading: false
        })
      }
    );
  }
})