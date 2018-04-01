//app.js
App({
  getUserInfoComplete: false,
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
    // 调用小程序的登录
    wx.login({
      success: res => {
        // 小程序调用wx.login()成功后，发送 res.code 到后台换取 openId, sessionKey, unionId
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

  uploadFile: function (api, filePath, name, formData, onSuccess, onFail, onComplete) {
    if (onSuccess == null)
      onSuccess = function () { };
    if (onFail == null)
      onFail = function () { };
    if (onComplete == null)
      onComplete = function () { };

    wx.uploadFile({
      url: this.systemDomain + api,
      filePath: filePath,
      name: name,
      formData: formData,
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

    var checkSessionCallback = () => {
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
          },
          complete: (res) => {
            this.getUserInfoComplete = true;
            if (this.userInfoCompleteCallback) {
              this.userInfoCompleteCallback(res);
            }
          }
        });
      });
    }

    // 检查小程序的Session是否有效，无效则重新登录，并到服务器获取sessionId
    wx.checkSession({
      success: checkSessionCallback,
      fail: function() {
        getApp().getSession(checkSessionCallback);
      }
    })

    // console.log(wx.getStorageSync("sessionID"));
    // console.log(this.userSessionInit());
  },

  submitUserInfo: function(userInfo) {
    this.callAPI("/UserInfo", userInfo, function (res) { console.log(res); });
  },
  
  globalData: {
    userInfo: null
  }
})