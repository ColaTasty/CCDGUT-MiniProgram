// pages/ILOVEU/write/sending.js
const APP = getApp();
const module = require("./../../ILOVEUModule.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    message: {
      content: undefined
    },
    patternType: [
      "warn", "success", "waiting"
    ],
    sendStatus: 2,
    errorMsg: "",
    year: APP.systemInfo.year
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
    var self = this,
      t = self.data.message;
    module.getMessageContent(
      function (res) {
        module.sendMessageContent({ content: res.data }, function (res) {
          if (res.data.isOK) {
            self.setData({
              sendStatus: 1,
              mid:res.data.mid
            })
          } else {
            self.setData({
              sendStatus: 0,
              errorMsg: res.data.msg
            })
          }
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

  bindtap_toCurrent:function(e){
    var self = this;
    wx.redirectTo({
      url:"./../../current/current?mid="+self.data.mid
    })
  },

  bindtap_resend:function(e){
    var self = this;
    self.setData({
      sendStatus: 2
    })
    module.getMessageContent(
      function (res) {
        module.sendMessageContent({ content: res.data }, function (res) {
          if (res.data.isOK) {
            self.setData({
              sendStatus: 1,
              mid:res.data.mid
            })
          } else {
            self.setData({
              sendStatus: 0,
              errorMsg: res.data.msg
            })
          }
        })
      }
    )
  }
})