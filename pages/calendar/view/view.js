var isTesting = true;
const calendarModule = require("./../CalendarModule.js"),
  app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    app: app,
    tid: 0,
    table: null,
    row: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    column: [0, 1, 2, 3, 4],
    isTesting: isTesting
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    that.setData({
      tid: options.tid
    });
    wx.showLoading({
      title: '正在查询',
    })
    calendarModule.viewTable(
      options.tid,
      (res) => {
        var data = res.data,
          t = new Array(7),
          tableName = "",
          type = "";
        tableName = data.tname;
        type = data.ttype;
        console.log(data);
        t[0] = JSON.parse(data.Mon);
        t[1] = JSON.parse(data.Tue);
        t[2] = JSON.parse(data.Wed);
        t[3] = JSON.parse(data.Thu);
        t[4] = JSON.parse(data.Fri);
        if (type == "week") {
          t[5] = JSON.parse(data.Sat);
          t[6] = JSON.parse(data.Sun);
        }
        that.setData({
          table: {
            tableName: tableName,
            type: type,
            days: t
          }
        })
      },
      null,
      () => {
        wx.hideLoading();
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

  }
})