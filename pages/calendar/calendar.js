// pages/calendar/calendar.js
const Dialog = require('../../zanui-components/dialog/dialog');
const app = getApp();
const week = [
  "星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"
];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    app: app,
    have_tables: false,
    tables: null,
    isDeleting: false,
    todayIs: app.systemInfo.year + "年" + app.systemInfo.month + "月" + app.systemInfo.day + "日" + " " + week[app.systemInfo.week]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
    wx.showLoading({
      title: '正在查询...',
    })
    app.requestTo(
      "/wxapp/calendar/init", {
        sessionid: wx.getStorageSync("sessionID")
      },
      null,
      function(res) {
        if (res.data.isOK) {
          that.setData({
            have_tables: res.data.isOK,
            tables: res.data.tables
          })
        } else {
          Dialog({
            title: "未查到周程表",
            message: res.data.msg,
            selector: '#alter'
          });
        }
      },
      null,
      function(res) {
        wx.hideLoading();
      }
    );
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

  bindtap_build: function() {
    wx.navigateTo({
      url: './build/build',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  bindtap_viewTable: function(e) {
    wx.navigateTo({
      url: './view/view?tid=' + e.currentTarget.dataset.tid,
    })
    console.log(e);
  },

  bindtap_delet: function(e) {
    this.setData({
      isDeleting: true
    });
  },

  bindtap_finish: function(e) {
    this.setData({
      isDeleting: false
    })
  },

  bindtap_deletIt: function(e) {
    console.log(e);
    var tap = e;
    var that = this;
    Dialog({
      title: "提示",
      message: "确定删除周程表" + that.data.tables[e.currentTarget.dataset.tablesIndex].tname + "吗？",
      selector: '#alter',
      buttons: [{
        text: '取消',
        color: 'red',
        type: 'cancel'
      }, {
        text: '确定',
        color: 'black',
        type: 'confirm'
      }]
    }).then((e) => {
      if (e.type == "confirm") {
        wx.showLoading({
          title: '正在删除',
        })
        app.requestTo(
          "/wxapp/calendar/delet", {
            tid: that.data.tables[tap.currentTarget.dataset.tablesIndex].tid
          },
          null,
          function(res) {
            if (res.data.isOK) {
              app.requestTo(
                "/wxapp/calendar/init", {
                  sessionid: wx.getStorageSync("sessionID")
                },
                null,
                function(res) {
                  if (res.data.isOK) {
                    that.setData({
                      have_tables: res.data.isOK,
                      tables: res.data.tables
                    })
                  } else {
                    that.setData({
                      have_tables: res.data.isOK,
                      tables: null
                    })
                  }
                },
              );
            } else {
              Dialog({
                title: "删除失败",
                message: res.data.msg,
                selector: '#alter'
              });
            }
          },
          null,
          function(res) {
            wx.hideLoading();
          }
        );
      }
    });
  }
})