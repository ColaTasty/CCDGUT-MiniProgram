// pages/calendar/build_item/build_item.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    table: null,
    timeIndex: 0,
    value: "",
    canFinish: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.getStorage({
      key: 'table_tmp',
      success: function(res) {
        // console.log(res)
        that.setData({
          table: res.data,
          timeIndex: options.time_index
        })
      },
    })
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

  },

  bindtap_finish: function(e) {
    wx.setStorage({
      key: 'table_tmp',
      data: this.data.table,
      success:(e)=>{
        wx.setStorageSync("table_edit", true);
        wx.navigateBack({
          detail: 1
        });
      }
    })
  },

  bindinput_value: function(e) {
    var that = this;
    var t = that.data.table;
    t[that.data.timeIndex].value = e.detail.value;
    that.setData({
      table: t,
      canFinish: (that.data.table[that.data.timeIndex].time.hour != null) && (that.data.table[that.data.timeIndex].value != null)
    });
  },

  bindchange_timeChange: function(e) {
    var that = this;
    var t = that.data.table;
    t[that.data.timeIndex].time.hour = e.detail.value[3];
    t[that.data.timeIndex].time.minute = e.detail.value[4];
    that.setData({
      table: t,
      canFinish: (that.data.table[that.data.timeIndex].time.hour != null) && (that.data.table[that.data.timeIndex].value != null)
    });
  }
})