var edusystem = require("../../utils/Edusystem.js");

//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    educationSystemBindCheck: false,
    sessionId: "",
    loading: false,
  },

  educationSystemBindCheck: function () {
    var page = this;
    page.setData({
      loading: true
    });
    getApp().callAPI("/Module/EducationSystem/BindCheck", null, 
    function (e) {
      page.setData({
        educationSystemBindCheck: e.data.result
      });
    },
    function () {},
    function () {
      page.setData({
        loading: false
      });
    });
  },
  
  onLoad: function () {
    /*
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else {
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        });
      }
    }
    */

    /* 
    else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        });
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    */
  },

  onShow: function () {
    edusystem.bindCheck(
      undefined,
      undefined,
      undefined,
      (e) => {
        this.setData({
          loading: false,          
          educationSystemBindCheck: app.educationSystemBind
        });
      },
      () => {
        this.setData({
          loading: true,
        });
      }
    );
    /*
    if (app.getUserInfoComplete) {
      this.educationSystemBindCheck();      
    } else {
      app.userInfoCompleteCallback = this.educationSystemBindCheck;
    }
    */
  },

  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    });
  },

  onShareAppMessage: function (options) {
  },

  /*
  bindtap_redirect: function (){
    wx.redirectTo({
      url: './index',
    })
  }
  */
})
