// pages/calendar/build/build.js
var phoneInfo = null;
var sessionId = wx.getStorageSync("sessionID");
wx.getSystemInfo({
  success: function(res) {
    phoneInfo = res;
  },
})
Page({

  /**
   * 页面的初始数据
   */
  data: {
    table_name: "",
    table_items: [
      [{
          start: null,
          end: null,
          value: null
        },
        {
          start: null,
          end: null,
          value: null
        },
        {
          start: null,
          end: null,
          value: null
        },
        {
          start: null,
          end: null,
          value: null
        },
        {
          start: null,
          end: null,
          value: null
        },
      ],
      [{
          start: null,
          end: null,
          value: null
        },
        {
          start: null,
          end: null,
          value: null
        },
        {
          start: null,
          end: null,
          value: null
        },
        {
          start: null,
          end: null,
          value: null
        },
        {
          start: null,
          end: null,
          value: null
        },
      ],
      [{
          start: null,
          end: null,
          value: null
        },
        {
          start: null,
          end: null,
          value: null
        },
        {
          start: null,
          end: null,
          value: null
        },
        {
          start: null,
          end: null,
          value: null
        },
        {
          start: null,
          end: null,
          value: null
        },
      ],
      [{
          start: null,
          end: null,
          value: null
        },
        {
          start: null,
          end: null,
          value: null
        },
        {
          start: null,
          end: null,
          value: null
        },
        {
          start: null,
          end: null,
          value: null
        },
        {
          start: null,
          end: null,
          value: null
        },
      ],
      [{
          start: null,
          end: null,
          value: null
        },
        {
          start: null,
          end: null,
          value: null
        },
        {
          start: null,
          end: null,
          value: null
        },
        {
          start: null,
          end: null,
          value: null
        },
        {
          start: null,
          end: null,
          value: null
        },
      ],
    ],
    canNext: false,
    phone: phoneInfo,
    sessionId: sessionId
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

  bindchange_tableName: function(e) {
    if (e.detail.value.length > 0)
      this.setData({
        canNext: true
      });
    else
      this.setData({
        canNext: false
      });
  },

  bindsubmit_next: function(e) {
    this.setData({
      table_name: e.detail.value.table_name
    })
  }
})