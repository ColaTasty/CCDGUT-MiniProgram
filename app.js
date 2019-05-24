//app.js
var systemInfo = null;
var date = new Date();
wx.getSystemInfo({
  success: function(res) {
    systemInfo = res;
  },
});
systemInfo.year = date.getFullYear();
systemInfo.month = date.getMonth() + 1;
systemInfo.day = date.getDate();
systemInfo.time = date.getTime();
systemInfo.week = date.getDay();
App({
  sessionReady: false, // 程序首次启动后，Session ID是否已准备好？
  sessionReadyCallback: function() {}, // Session ID首次准备好后的回调，只在onLaunch事件中生效

  educationSystemBindChecked: false, // 用于标记是否已检查过用户有无绑定教务系统
  educationSystemBind: false, // 标记用户是否已绑定教务系统

  // getUserInfoComplete: false,
  systemDomain: "https://ccdgut.yuninter.net/WeChat/API/1",
  // systemDomain: "http://wechatapi.com/WeChat/API/1",
  sessionId: null,

  systemInfo: systemInfo,

  // 储存Session ID
  setSessionId: function(sessionId) {
    this.sessionId = sessionId;
    wx.setStorageSync("sessionID", sessionId)
  },

  sessionIdValid: function(onSuccess, onError, onComplete) {
    this.sessionIdValidRequire = false; // 防止重复调用
    this.callAPI(
      "/SessionIdValid", {},
      function(e) {
        if (!e.data.result)
          getApp().getSession(onSuccess, onError, onComplete);
        else if (typeof onSuccess !== "undefined")
          onSuccess();
      },
      onError,
      onComplete
    );
  },

  // 读取已储存的Session ID，检查的Session ID是否有效，无效则到服务器重新获取Session ID
  userSessionInit: function(onSuccess, onError, onComplete) {
    this.sessionId = wx.getStorageSync("sessionID");
    if (this.sessionId == null || this.sessionId.length == 0)
      return this.getSession(onSuccess, onError, onComplete);
    this.sessionIdValid(onSuccess, onError, onComplete);
  },

  // 从服务器获取Session ID
  getSession: function(onSuccessCallback, onError, onComplete) {
    // 调用小程序的登录
    wx.login({
      success: res => {
        // 小程序调用wx.login()成功后，发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log("Call login: " + this.systemDomain + "/Login");
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
          success: function(res) {
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
                  wx.navigateBack({
                    delta: 1
                  });
                }
              })
            }
          },
          fail: onError,
          complete: onComplete
        })
      }
    })
  },


  /**
   * @version 城院贴吧小助手2018
   * 
   * @param string api
   * @param object data
   * @param function onSuccess
   * @param function onFail
   * @param function onComplete
   * @param function beforeAPIInvoke
   *
   */
  callAPI: function(api, data, onSuccess, onFail, onComplete, beforeAPIInvoke) {
    // data.sessionId = this.sessionId;
    var callAPIClosure = () => {
      if (onSuccess == null)
        onSuccess = function() {};
      if (onFail == null)
        onFail = function() {};
      if (onComplete == null)
        onComplete = function() {};
      beforeAPIInvoke = beforeAPIInvoke || function() {};

      beforeAPIInvoke();

      console.log("Call API: " + this.systemDomain + api);
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
      console.log("callAPI invoke sessionIdValid.");
      this.sessionIdValidRequire = false;
      this.sessionIdValid(callAPIClosure);
    } else {
      callAPIClosure();
    }
  },

  /**
   * @version 城院贴吧小助手2019
   * 
   * @param {string} api 
   * @param {object} data 
   * @param {string} header 
   * @param {Function} onSuccess 
   * @param {Function} onFail 
   * @param {Function} onComplete 
   */
  requestTo: function(api, data, header = null, onSuccess = null, onFail = null, onComplete = null) {
    var url = "https://ccdgut.yuninter.net/IcedCappuccino" + api;
    if (header == null)
      header = {
        "content-type": "application/x-www-form-urlencoded"
      };
    if (onSuccess == null)
      onSuccess = function() {};
    if (onFail == null)
      onFail = function() {
        wx.showModal({
          title: '连接失败',
          content: '服务器连接失败，请检查网络',
          showCancel: false
        })
      };
    if (onComplete == null)
      onComplete = function() {};

    wx.request({
      url: url,
      data: data,
      header: header,
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: onSuccess,
      fail: onFail,
      complete: onComplete,
    });

    console.log("Call API: " + url);
  },

  uploadFile: function(api, filePath, name, formData, onSuccess, onFail, onComplete) {
    if (onSuccess == null)
      onSuccess = function() {};
    if (onFail == null)
      onFail = function() {};
    if (onComplete == null)
      onComplete = function() {};

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

  onLaunch: function() {
    console.log("app.js onLaunch invoked.");
    const updateManager = wx.getUpdateManager();
    updateManager.onCheckForUpdate((e) => {
      console.log("hasUpdate: " + e.hasUpdate);
      if (e.hasUpdate) {
        updateManager.onUpdateReady((e) => {
          wx.showModal({
            title: '更新提示',
            content: '新版本已经准备好，请重启使用',
            showCancel:false,
            success: function(res) {
              if (res.confirm) {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                updateManager.applyUpdate()
              }
            }
          })
        });
      }
    })
    this.sessionCheck();
  },

  sessionIdValidRequire: false, // 为true时，调用callAPI将会先调用sessionValid
  firstShow: true, // 为true时，表示是第一次触发onShow()，不修改sessionIdValidRequire为true，避免重复调用sessionValid

  onShow(options) {
    // 有些设备上，小程序会话会保留非常久，重新进入小程序不会调用onLauhch
    // 然而服务器上的Session早已失效，所以在onShow处也要触发一次Session有效检测
    // 置sessionIdValidRequire为true，在调用callAPI时将会先检查Session有效性，再调用API

    // 第一次启动小程序，先触发onLaunch再触发onShow，首次启动不触发Session检测，onLaunch中已经调用Session有效性检测了
    if (!this.firstShow) {
      this.sessionIdValidRequire = true;
    }
    this.firstShow = false;
  },

  getUserinfoAndSubmitToServer(onSuccess, onError, onComplete) {
    wx.showNavigationBarLoading();

    var onUserInfoSubmitted = () => {
      wx.hideNavigationBarLoading();
      onComplete();
    };

    // 获取用户信息并提交到服务器
    wx.getUserInfo({
      success: res => {
        // 可以将 res 发送给后台解码出 unionId
        // console.log(res.userInfo);
        this.globalData.userInfo = res.userInfo

        this.submitUserInfo(res.userInfo, onSuccess, onError, onUserInfoSubmitted);

        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        // if (this.userInfoReadyCallback) {
        //   this.userInfoReadyCallback(res)
        // }
      },
      onError,
    });
  },

  /*getUserinfoAndSubmitToServer(onSuccess, onError, onComplete) {
    wx.showLoading({
      title: '请稍等...',
      mask: true,
    });

    var onUserInfoSubmitted = () => {
      wx.hideLoading();
      onComplete();
    };

    // 获取用户信息并提交到服务器
    wx.getUserInfo({
      success: res => {
        // 可以将 res 发送给后台解码出 unionId
        // console.log(res.userInfo);
        this.globalData.userInfo = res.userInfo

        this.submitUserInfo(res.userInfo, onSuccess, onError, onUserInfoSubmitted);

        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        // if (this.userInfoReadyCallback) {
        //   this.userInfoReadyCallback(res)
        // }
      },
      onError,
    });
  },*/

  /**
   * bakcup
   */
  sessionCheck() {

    var sessionReadyCallback = () => {
      console.log("Invoke session ready callback.");
      wx.hideNavigationBarLoading();
      this.sessionReady = true;
      this.sessionReadyCallback();
    };

    var onSessionError = () => {
      wx.hideNavigationBarLoading();
      wx.showModal({
        title: '错误',
        content: '小程序暂时无法提供服务，请稍后重试...',
        showCancel: false,
        complete: function() {
          wx.navigateBack();
        }
      })
    };

    var onSessionReadyComplete = () => {
      // console.log("Session ready! Hide loading.");
      // wx.hideLoading();
    };

    // 到服务器检查Session ID是否有效
    var checkSessionCallback = () => {
      this.userSessionInit(sessionReadyCallback, onSessionError, onSessionReadyComplete);
    }

    console.log("Show session loading.");
    wx.showNavigationBarLoading();

    // 检查小程序的Session是否有效，无效则重新登录，并到服务器获取sessionId
    wx.checkSession({
      success: checkSessionCallback, // 小程序的session有效时，到服务器验证服务器session是否有效
      fail: function() {
        // 小程序的session无效时，重新调用login获取小程序session，然后到服务器获取session，再调用sessionReadyCallback
        getApp().getSession(
          sessionReadyCallback,
          onSessionError,
          onSessionReadyComplete
        );
      },
    })

    // console.log(wx.getStorageSync("sessionID"));
    // console.log(this.userSessionInit());
  },

  /*sessionCheck() {

    var sessionReadyCallback = () => {
      console.log("Invoke session ready callback.");
      wx.hideLoading();
      this.sessionReady = true;
      this.sessionReadyCallback();
    };

    var onSessionError = () => {
      wx.hideLoading();
      wx.showModal({
        title: '错误',
        content: '小程序暂时无法提供服务，请稍后重试...',
        showCancel: false,
        complete: function() {
          wx.navigateBack();
        }
      })
    };

    var onSessionReadyComplete = () => {
      // console.log("Session ready! Hide loading.");
      // wx.hideLoading();
    };

    // 到服务器检查Session ID是否有效
    var checkSessionCallback = () => {
      this.userSessionInit(sessionReadyCallback, onSessionError, onSessionReadyComplete);
    }

    console.log("Show session loading.");
    wx.showLoading({
      title: '请稍后...',
      mask: true
    });

    // 检查小程序的Session是否有效，无效则重新登录，并到服务器获取sessionId
    wx.checkSession({
      success: checkSessionCallback, // 小程序的session有效时，到服务器验证服务器session是否有效
      fail: function() {
        // 小程序的session无效时，重新调用login获取小程序session，然后到服务器获取session，再调用sessionReadyCallback
        getApp().getSession(
          sessionReadyCallback,
          onSessionError,
          onSessionReadyComplete
        );
      },
    })

    // console.log(wx.getStorageSync("sessionID"));
    // console.log(this.userSessionInit());
  },*/

  submitUserInfo: function(userInfo, onSuccess, onError, onComplete) {
    this.callAPI("/UserInfo", userInfo, onSuccess, onError, onComplete);
  },

  // 有加载中与成功提示
  submitUserInfoDefaultNotify: function(userInfo, onSuccess, onError, onComplete) {
    wx.showLoading({
      title: '请稍等...',
      mask: true,
    });

    this.callAPI(
      "/UserInfo",
      userInfo,
      () => {
        wx.hideLoading();
        wx.showToast({
          title: '更新成功',
          duration: 1500,
          icon: "success"
        });

        if (onSuccess) {
          onSuccess();
        }
      },
      (res) => {
        wx.hideLoading();
        wx.showToast({
          title: '网络错误',
          duration: 1500,
          icon: "none"
        });

        if (onError) {
          onError(res);
        }
      },
      onComplete
    );
  },

  globalData: {
    userInfo: null
  }
})