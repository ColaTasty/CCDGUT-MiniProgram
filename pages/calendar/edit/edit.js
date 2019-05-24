// pages/calendar/view/view.js
const app = getApp();
const week = [
  "星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"
];
const calendarModule = require("./../CalendarModule.js");
var weekIndex = 0,
  flag = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    app: app,
    tables: null,
    days_index: weekIndex,
    isEditing: true,
    canSave: false,
    todayIs: app.systemInfo.year + "年" + app.systemInfo.month + "月" + app.systemInfo.day + "日" + " " + week[app.systemInfo.week],
    tid: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this,
      editedItemCount = calendarModule.editedItemCount();;
    if (options.tid != null) {
      wx.showLoading({
        title: '正在查询',
      })
      calendarModule.viewTable(
        options.tid,
        (res) => {
          if (res.data.isOK) {
            var d = calendarModule.getInitDays(res.data.ttype);
            d[0].dayList = JSON.parse(res.data.Mon);
            d[1].dayList = JSON.parse(res.data.Tue);
            d[2].dayList = JSON.parse(res.data.Wed);
            d[3].dayList = JSON.parse(res.data.Thu);
            d[4].dayList = JSON.parse(res.data.Fri);
            if (res.data.ttype == "week") {
              d[5].dayList = JSON.parse(res.data.Sat);
              d[6].dayList = JSON.parse(res.data.Sun);
            }
            calendarModule.setDaysToStorage(
              d,
              (e) => {
                that.setData({
                  tables: {
                    tid: res.data.tid,
                    tname: res.data.tname,
                    ttime: res.data.ttime,
                    days: d,
                    type: res.data.ttype
                  }
                });
              }
            )
          }
        },
        null,
        (e) => {
          wx.hideLoading();
        }
      )
    } else {
      return;
    }
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
    calendarModule.isEdit(
      (edit) => {
        if (!flag) {
          flag = edit.data;
        }
        calendarModule.getDaysFromStorage(
          (e) => {
            var t = that.data.tables;
            t.days = e.data
            that.setData({
              tables: t,
              canSave: flag
            })
          }
        )
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
    var that = this;
    wx.showModal({
      title: '确定退出？',
      content: '这将不保存已经写好的信息',
      confirmColor: "black",
      confirmText: "退出",
      cancelColor: "red",
      cancelText: "考虑一下",
      success: (e) => {
        if (e.confirm) {
          calendarModule.removeCalendarStorage();
        }
        if (e.cancel) {
          wx.navigateTo({
            url: './edit/edit?tid=' + that.data.tables.tid,
          })
        }
      }
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

  bindtap_dayChange: function(e) {
    var that = this;
    var t = that.data.tables
    for (var i = 0; i < t.days.length; i++) {
      t.days[i].checked = "nav-item";
    }
    t.days[e.currentTarget.dataset.index].checked = "nav-item cur";
    that.setData({
      tables: t,
      days_index: e.currentTarget.dataset.index,
    })
  },

  bindtap_toBuild: function(e) {
    var that = this,
      currentTarget = e.currentTarget;
    calendarModule.setDaysToStorage(
      that.data.tables.days,
      (e) => {
        wx.navigateTo({
          url: "./../" + (that.data.tables.type == "week" ? "build_item/build_item" : "build_class/build_class") + "?timeIndex=" + currentTarget.dataset.timeIndex + "&dayIndex=" + that.data.days_index,
        })
      }
    )
  },

  bindtap_back: function(e) {
    var that = this;
    wx.navigateBack({
      detail: 1
    });
  },

  bindtap_saveEditing: function(e) {
    var that = this;
    wx.showLoading({
      title: '正在保存...',
    });
    calendarModule.rebuildTable(
      that.data.tables.tid,
      that.data.tables,
      (res) => {
        if (res.data.isOK) {
          calendarModule.setDaysToStorage(
            that.data.tables.days,
            (e) => {
              that.setData({
                canSave: false
              })
            }
          )
        } else {
          Dialog({
            title: "更新周程表失败",
            message: "服务器原因，请反馈",
            selector: '#alter',
          });
        }
      },
      null,
      () => {
        wx.hideLoading();
      }
    )
  }
})