// pages/CETquery/CETquery.js
const Dialog = require('../../zanui-components/dialog/dialog');
const app = getApp();
const types_z = ["", "CET4-D", "CET6-D", "CJT4-D", "CJT6-D", "PHS4-D", "PHS6-D", "CRT4-D", "CRT6-D", "TFU4-D"];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    app: app,
    class_v: 0, //验证码在页面的位置,
    isLoading_v: false,
    canSubmit: false,
    isLoading_submit: false,
    val_i: null,
    val_name: null,
    val_v: null,
    err_i: false,
    err_name: false,
    err_v: false,
    src_v: null, //验证码的url地址
    showVerify: false,
    have_res: false,
    res: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.showLoading({
      title: '正在连接...',
    })
    app.requestTo(
      "/wxapp/cet/getDd",
      null,
      null,
      function(res) {
        if (res.data.isOK)
          that.setData({
            dd: res.data.dd
          });
        else
          Dialog({
            title: "获取信息模版失败！",
            message: '请检查网络！',
            selector: '#verify-can-not-get'
          });
      },
      null,
      function() {
        wx.hideLoading();
      }
    );
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    /* 修改验证码的位置 */
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          class_v: (res.screenWidth - 120) / 2,
        });
      },
    });
  },

  bindchange_getZkz: function(e) {
    this.setData({
      val_i: e.detail.value,
      err_i: false
    })
    if (e.detail.value == "")
      this.setData({
        val_i: null
      });
    this.checkInfo();
  },

  bindchange_getName: function(e) {
    this.setData({
      val_n: e.detail.value,
      err_n: false
    })
    if (e.detail.value == "")
      this.setData({
        val_n: null
      })
    this.checkInfo();
  },

  bindchange_getVerify: function(e) {
    this.setData({
      val_v: e.detail.value,
      err_v: false
    })
    if (e.detail.value == "")
      this.setData({
        val_v: null
      })
    this.checkInfo();
  },

  checkInfo: function() {
    var d = this.data;
    if (d.val_i != null && d.val_i.length == 15 && d.val_n != null && d.val_v != null)
      this.setData({
        canSubmit: true
      });
    else
      this.setData({
        canSubmit: false
      });
  },

  bindtap_getVerify: function() {
    var that = this;
    var data = {
      i: that.data.val_i
    };
    if (wx.getStorageSync("cet_sessionid").length > 0)
      data.cet_sessionid = wx.getStorageSync("cet_sessionid");
    if (that.data.val_i == null || that.data.val_i.length != 15) {
      Dialog({
        title: "请输入准考证号",
        message: '输入15位准考证号后才能获取验证码',
        selector: '#verify-can-not-get'
      });
      that.setData({
        showVerify: false,
        err_i: true
      })
    } else {
      that.setData({
        isLoading_v: true
      })
      app.requestTo(
        "/wxapp/cet/verify",
        data,
        null,
        function(res) {
          Dialog({
            title: "提示",
            message: "如果验证码显示不出来，这是服务器的网络波动，再戳图片一次就好了",
            selector: '#verify-can-not-get'
          });
          if (res.data.isOK) {
            that.setData({
              showVerify: true,
              src_v: res.data.request_url
            });
            wx.setStorageSync("cet_sessionid", res.data.cet_sessionid);
          } else
            Dialog({
              title: "服务器网络出错啦",
              message: "服务器可能间歇性的大姨妈了，请稍后再试试吧",
              selector: '#verify-can-not-get'
            });
        },
        null,
        function() {
          that.setData({
            isLoading_v: false
          })
        }
      );
    }
  },

  bindtap_submit: function() {
    var that = this;
    that.setData({
      isLoading_submit: true
    })
    app.requestTo(
      "/wxapp/cet/query", {
        t: that.checkI().tab,
        z: that.data.val_i,
        n: that.data.val_n,
        v: that.data.val_v,
        cet_sessionid: wx.getStorageSync("cet_sessionid")
      },
      null,
      function(res) {
        if (res.data.isOK) {
          that.setData({
            have_res: true,
            res: res.data.res
          })
        } else
          Dialog({
            title: "信息查询错误！",
            message: res.data.res.error + "请检查输入的信息！",
            selector: '#verify-can-not-get'
          });
      },
      null,
      function(res) {
        wx.removeStorageSync("cet_sessionid");
        that.setData({
          isLoading_submit: false
        })
        var data = {
          i: that.data.val_i
        };
        that.setData({
          isLoading_v: true
        })
        app.requestTo(
          "/wxapp/cet/verify",
          data,
          null,
          function(res) {
            if (res.data.isOK) {
              that.setData({
                showVerify: true,
                src_v: res.data.request_url
              });
              wx.setStorageSync("cet_sessionid", res.data.cet_sessionid);
            } else
              Dialog({
                title: "服务器网络出错啦",
                message: "服务器可能间歇性的大姨妈了，请稍后再试试吧",
                selector: '#verify-can-not-get'
              });
          },
          null,
          function() {
            that.setData({
              isLoading_v: false
            })
          }
        );
      }
    );
  },

  checkI: function() {
    var index = -1;
    var z = this.data.val_i.toUpperCase();
    var t = z.charAt(0);
    if (t == "F") {
      index = 1;
    } else if (t == "S") {
      index = 2;
    } else {
      t = z.charAt(9);
      if (!isNaN(t))
        index = t;
    }
    var code = types_z[index];
    for (var i = 0; i < this.data.dd.rdsub.length; i++) {
      if (code == this.data.dd.rdsub[i].code) {
        return this.data.dd.rdsub[i];
      }
    }
  }

})