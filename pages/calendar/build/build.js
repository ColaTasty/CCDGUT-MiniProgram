// pages/calendar/build/build.js
const Dialog = require('../../../zanui-components/dialog/dialog');
const calendarModule = require("./../CalendarModule.js");
const app = getApp();
var haveLast = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    app: app,
    step: 0,
    days: [],
    daysIndex: 0,
    tableName: null,
    canNext: false,
    finishText: "完成创建10s",
    isPageLoading: true,
    isSuccess: false,
    arr_tableTypes: [{
        name: "week",
        value: "周程表",
        checked: true
      },
      {
        name: "class",
        value: "课表"
      }
    ],
    tableType: "week"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    calendarModule.isSetType(
      (e) => {
        that.setData({
          tableName: wx.getStorageSync(calendarModule.items.str_storageKey_tableName),
          tableType: e.data,
          arr_tableTypes: [{
            name: "week",
            value: "周程表",
            checked: e.data == "week"
          }, {
            name: "class",
            value: "课表",
            checked: e.data == "class"
          }],
          canNext: true
        });
      },
      (e) => {
        that.setData({
          tableType: "week",
          arr_tableTypes: [{
            name: "week",
            value: "周程表",
            checked: true
          }, {
            name: "class",
            value: "课表"
          }]
        });
      }
    );
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
    var that = this,
    count = calendarModule.editedItemCount();
    calendarModule.getDaysFromStorage(
      (e) => {
        var td = e.data;
        console.log(count);
        that.setData({
          days: td,
          countItem: count
        })
        calendarModule.setEditFlag(false);
      }
    )
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
    calendarModule.isSetType(
      (e) => {
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
              calendarModule.removeCalendarStorage();
            }
            if (res.cancel) {
              wx.navigateTo({
                url: './build/build',
              })
            }
          }
        })
      }
    );
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
        tableName: e.detail.value,
        canNext: true
      });
    else
      this.setData({
        canNext: false
      });
  },

  bindchange_tableType: function(e) {
    // console.log(e);
    var t = this.data.arr_tableTypes;
    for (var i = 0; i < t.length; i++) {
      t[i].checked = t[i].name == e.detail.detail.value;
    }
    this.setData({
      tableType: e.detail.detail.value,
      arr_tableTypes: t
    })
  },

  bindtap_last: function(e) {
    haveLast = this.data.canNext;
    this.setData({
      step: this.data.step - 1,
      canNext: true
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
      //step 1
      case 1:
        calendarModule.setTypeToStorage(that.data.tableType, () => {
          wx.setStorageSync(calendarModule.items.str_storageKey_tableName, that.data.tableName);
          that.setData({
            days: null
          })
          calendarModule.isSetDays(
            (res) => {
              if ((res.data.length == 5 && that.data.tableType == "class") || (res.data.length == 7 && that.data.tableType == "week")) {
                that.setData({
                  days: res.data
                })
              } else {
                that.setData({
                  days: calendarModule.getInitDays(that.data.tableType)
                })
              }
            },
            (res) => {
              that.setData({
                days: calendarModule.getInitDays(that.data.tableType)
              })
            });
        });
        break;
        //step2
      case 2:
        calendarModule.setDaysToStorage(that.data.days, () => {
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
        });
        break;
        //step 3
      case 3:
        that.setData({
          isPageLoading: true
        });
        calendarModule.uploadBuildUp(
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
          message: "你触发了一个BUG，请贴吧发贴反馈",
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
      daysIndex: e.currentTarget.dataset.index,
    })
  },

  bindtap_buildItem: function(e) {
    var that = this;
    calendarModule.setDaysToStorage(
      that.data.days,
      (res) => {
        if (that.data.tableType == "class") {
          wx.navigateTo({
            url: './../build_class/build_class?dayIndex=' + that.data.daysIndex + "&timeIndex=" + e.currentTarget.dataset.timeIndex,
          })
        } else if (that.data.tableType == "week") {
          wx.navigateTo({
            url: './../build_item/build_item?dayIndex=' + that.data.daysIndex + "&timeIndex=" + e.currentTarget.dataset.timeIndex,
          })
        }
      })
  },

  bindtap_back: (e) => {
    calendarModule.removeCalendarStorage();
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
          Mon: that.data.days[0].dayList,
          Tue: that.data.days[1].dayList,
          Wed: that.data.days[2].dayList,
          Thu: that.data.days[3].dayList,
          Fri: that.data.days[4].dayList,
          Sat: that.data.days[5].dayList,
          Sun: that.data.days[6].dayList
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