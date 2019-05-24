// pages/ILOVEU/write/write.js
const APP = getApp();
const module = require("./../ILOVEUModule.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    year: APP.systemInfo.year,
    canSubmit: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  bindinput_textarea: function (e) {
    var self = this;
    self.setData({
      canSubmit: e.detail.value.length > 0
    })
  },

  bindsubmit_form: function (e) {
    var value = e.detail.value.content;
    module.setMessageContent(value, function (e) {
      wx.redirectTo({
        url: "./sending"
      })
      // wx.navigateBack({
      //   detail: 1,
      //   success: function (e) {
      //     wx.navigateTo({
      //       url: "./write/sending"
      //     })
      //   }
      // })
    })
  }
})