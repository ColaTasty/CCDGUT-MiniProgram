//app.js
App({
  systemDomain: "https://ccdgut.yuninter.net/WeChat/API/1",
  // systemDomain: "http://wechatapi.com/WeChat/API/1",
  sessionId: null,
  setSessionId: function(sessionId) {
    this.sessionId = sessionId;
    wx.setStorageSync("sessionID", sessionId)
  },
  sessionIdValid: function (onSuccess) {
    this.callAPI("/SessionIdValid", {}, function(e) {
      if(!e.data.result)
        getApp().getSession(onSuccess);
      else if (typeof onSuccess !== "undefined")
        onSuccess();
    });
  },

  userSessionInit: function (onSuccess) {
    this.sessionId = wx.getStorageSync("sessionID");
    if (this.sessionId == null || this.sessionId.length == 0)
      return this.getSession(onSuccess);
    this.sessionIdValid(onSuccess);
  },

  getSession: function (onSuccessCallback) {
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: this.systemDomain + "/Login",
          method: "POST",
          dataType: "json",
          data: {
            code: res.code
          },
          header: {
            'content-type': 'application/json', // 默认值
          },
          success: function (res) {
            if (res.data.result == true) {
              getApp().setSessionId(res.data.sessionId);
              if (typeof onSuccessCallback !== "undefined")
                onSuccessCallback();
            } else {
              wx.showModal({
                title: '错误',
                content: res.data.error,
                showCancel: false,
                confirmText: "返回",
                complete: function() {
                  wx.navigateBack({delta: 1});
                }
              })
            }
          }
        })
      }
    })
  },

  callAPI: function(api, data, onSuccess, onFail, onComplete) {
    // data.sessionId = this.sessionId;
    if (onSuccess == null)
      onSuccess = function() {};
    if (onFail == null)
      onFail = function() {};
    if (onComplete == null)
      onComplete = function() {};
    wx.request({
      url: this.systemDomain + api,
      method: "POST",
      dataType: "json",
      data: data,
      header: {
        'content-type': 'application/json', // 默认值
        'sessionId': this.sessionId
      },
      success: onSuccess,
      fail: onFail,
      complete: onComplete
    })
  },

  onLaunch: function () {
    /*
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    */

    wx.checkSession({
      fail: function() {
        getApp().getSession();
      }
    })

    // console.log(wx.getStorageSync("sessionID"));
    // console.log(this.userSessionInit());
    this.userSessionInit(() => {
      // 获取用户信息
      wx.getUserInfo({
        success: res => {
          // 可以将 res 发送给后台解码出 unionId
          // console.log(res.userInfo);
          this.globalData.userInfo = res.userInfo

          this.submitUserInfo(res.userInfo);

          // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
          // 所以此处加入 callback 以防止这种情况
          if (this.userInfoReadyCallback) {
            this.userInfoReadyCallback(res)
          }
        }
      });
    });
  },

  submitUserInfo: function(userInfo) {
    this.callAPI("/UserInfo", userInfo, function (res) { console.log(res); });
  },
  
  globalData: {
    userInfo: null
  }
})