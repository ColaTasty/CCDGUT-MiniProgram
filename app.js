//app.js
App({
  educationSystemBindChecked: false, // 用于标记是否已检查过用户有无绑定教务系统
  educationSystemBind: false, // 标记用户是否已绑定教务系统
  getUserInfoComplete: false,
  systemDomain: "https://ccdgut.yuninter.net/WeChat/API/1",
  // systemDomain: "http://wechatapi.com/WeChat/API/1",
  sessionId: null,
  setSessionId: function(sessionId) {
    this.sessionId = sessionId;
    wx.setStorageSync("sessionID", sessionId)
  },

  sessionIdValid: function (onSuccess) {
    this.sessionIdValidRequire = false; // 防止重复调用
    this.callAPI(
      "/SessionIdValid", 
      {}, 
      function(e) {
        if(!e.data.result)
          getApp().getSession(onSuccess);
        else if (typeof onSuccess !== "undefined")
          onSuccess();
      },
      () => {},
      () => {
      }
      );
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

  callAPI: function (api, data, onSuccess, onFail, onComplete, beforeAPIInvoke) {
    // data.sessionId = this.sessionId;
    var callAPIClosure = () => {
      if (onSuccess == null)
        onSuccess = function () { };
      if (onFail == null)
        onFail = function () { };
      if (onComplete == null)
        onComplete = function () { };
      beforeAPIInvoke = beforeAPIInvoke || function () { };

      beforeAPIInvoke();
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
    }

    if (this.sessionIdValidRequire) {
      this.sessionIdValidRequire = false;
      this.sessionIdValid(callAPIClosure);
    } else {
      callAPIClosure();
    }
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
    this.sessionCheck();
  },

  sessionIdValidRequire: false, // 为true时，调用callAPI将会先调用sessionValid
  firstShow: true, // 为true时，表示是第一次触发onShow()，不修改sessionIdValidRequire为true，避免重复调用sessionValid

  onShow(options) {
    if (!this.firstShow) {
      this.sessionIdValidRequire = true;
    }
    this.firstShow = false;
  },

  sessionCheck() {
    /*
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    */

    var getUserInfoClosure = () => {
      wx.showLoading({
        title: '请稍后...',
      })
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
          wx.hideLoading();
        }
      });
    };

    var checkSessionCallback = () => {
      this.userSessionInit(getUserInfoClosure);
    }

    // 检查小程序的Session是否有效，无效则重新登录，并到服务器获取sessionId
    wx.checkSession({
      success: checkSessionCallback, // 小程序的session有效时，到服务器验证服务器session是否有效
      fail: function () {
        getApp().getSession(getUserInfoClosure); // 小程序的session无效时，重新调用login获取小程序session，再到服务器获取服务器的session，再调用getUserInfo
      }
    })

    // console.log(wx.getStorageSync("sessionID"));
    // console.log(this.userSessionInit());
  },

  submitUserInfo: function(userInfo) {
    this.callAPI("/UserInfo", userInfo, function (res) {});
  },
  
  globalData: {
    userInfo: null
  }
})