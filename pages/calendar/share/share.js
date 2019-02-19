// pages/calendar/share/share.js
const calendarModule = require("./../CalendarModule.js"),
  app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    app: app,
    tid: null,
    isSelf: false,
    tableInfor: {
      tname: "周程表",
      type: "week",
      ttime: "2019-01-01 00:00:00",
      sharedCount: 0,
    },
    tableCreator: {
      avatarUrl: "",
      nickName: "分享者"
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    this.setData({
      tid: options.tid
    })
    // getTableCreator
    calendarModule.getTableCreator(
      options.tid,
      (res) => {
        if (res.data.isOK) {
          that.setData({
            tableCreator: {
              avatarUrl: res.data.tableCreator.avatarUrl,
              nickName: res.data.tableCreator.nickName
            }
          })
        } else {
          wx.showModal({
            title: '查找失败',
            content: res.data.msg,
          })
        }
      }
    )
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
    // getTableInfor
    wx.showLoading({
      title: '正在查询',
    })
    calendarModule.getSharingTable(
      that.data.tid,
      (res) => {
        if (res.data.isOK) {
          that.setData({
            isSelf: res.data.isSelf,
            tableInfor: {
              tname: res.data.table.tname,
              type: res.data.table.type,
              ttime: res.data.table.ttime,
              sharedCount: res.data.table.sharedCount,
            }
          });
        } else {
          wx.showModal({
            title: '周程表查找失败',
            content: res.data.msg,
          })
        }
      },
      null,
      () => {
        wx.hideLoading();
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
  bindtap_toView: function(e) {
    var that = this;
    wx.navigateTo({
      url: './../view/view?tid=' + that.data.tid,
    })
  },
  bindtap_saveTable: function(e) {
    var that = this;
    calendarModule.saveSharingTable(
      that.data.tid,
      (res) => {
        if (res.data.isOK) {
          wx.showModal({
            title: '保存成功',
            content: that.data.table.type == "week" ? "周程表:" : "课表:" + that.data.table.tname + "保存成功",
            showCancel: false
          })
        } else {
          wx.showModal({
            title: '保存失败',
            content: res.data.msg,
            showCancel: false
          })
        }
      })
  },
  bindtap_toShare: function (e) {
    this.setData({
      isSelf: false
    })
  }
})