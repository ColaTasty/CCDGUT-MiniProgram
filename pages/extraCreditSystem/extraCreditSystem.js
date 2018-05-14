var edusystem = require("../../utils/Edusystem.js");

// pages/extraCreditSystem/extraCreditSystem.js
Page({
  APIPrefix: "/Module/ExtraCreditSystem/",
  /**
   * 页面的初始数据
   */
  data: {
    verifyCode: "",
    session: "",
    list: [],
    applied: "",
    emptyList: false,
    educationSystemBindCheck: true,
    loading: false,
    userInputVerifyCode: ""
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

  preLogin: function() {
    this.setData({ userInputVerifyCode: "" });    
    wx.showLoading({
      title: '加载中...',
      mask: true,
    })
    getApp().callAPI(
      this.APIPrefix + "PreLogin", 
      {}, 
      (res) => { 
        // console.log(res); 
        if (res.data.result) {
          this.setData({
            verifyCode: "data:image/jpeg;base64," + res.data.verifyCode,
            session: res.data.session
          });
        } else {
          wx.showModal({
            title: '错误',
            content: res.data.error,
            showCancel: false,
            success: function () {
            }
          })
        }
      },
      (res) => {},
      (res) => { wx.hideLoading(); }
    );
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    edusystem.bindCheck(
      () => {
        this.preLogin();
      },
      () => {
        this.setData({ educationSystemBindCheck: false });
      },
    );
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

  getExtraCreditItem: function (verifyCode, onSuccess) {
    wx.showLoading({
      title: '请稍等...',
      mask: true
    })
    getApp().callAPI(
      this.APIPrefix + "GetExtraCreditItem",
      {
        verifyCode: verifyCode,
        session: this.data.session,
      },
      (res) => {
        this.preLogin();
        if (res.data.result) {
          onSuccess(res.data.list, res.data.applied);
        } else {
          wx.showModal({
            title: '错误',
            content: res.data.error,
            showCancel: false
          })
        }
      },
      (res) => {
        wx.showModal({
          title: '错误',
          content: '网络错误，请稍后',
          showCancel: false
        })
      },
      (res) => {
        wx.hideLoading();
      }
    );
  },

  query: function (e) {
    this.getExtraCreditItem(e.detail.value.verifyCode, (list, applied) => {
      this.setData({ list: list, applied: applied, emptyList: list.length == 0});
    });
  }
})