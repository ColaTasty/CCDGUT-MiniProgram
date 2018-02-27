// pages/bindSetting/bindSetting.js
Page({

  getVerifyCode() {
    var page = this;
    if (page.data.loadingVerifyCode) {
      console.log("Loading verify code");
      return;
    }
    page.setData({
      loadingVerifyCode: true,
    });
    getApp().callAPI("/Module/EducationSystem/VerifyCode", null,
      function (e) {
        if (e.data.result) {
          page.setData({
            verifyCode: "data:image/gif;base64," + e.data.verifyCode,
            sessionId: e.data.sessionId
          });
        } else {
          wx.showModal({
            title: '错误',
            content: e.data.error,
            showCancel: false,
          })
        }
      },
      function () {

      },
      function () {
        page.setData({
          loadingVerifyCode: false,
        });
      }
    );
  },

  /**
   * 页面的初始数据
   */
  data: {
    verifyCode: "",
    sessionId: "",
    loadingVerifyCode: false,
    updating: false,
    unbinding: false,
    autoNavigateBackOnUpdated: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    if (options.back_on_updated == 1) {
      this.setData({
        autoNavigateBackOnUpdated: true,
      });
    }
    this.getVerifyCode();
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

  formSubmit(e) {
    var page = this;
    if (page.data.updating) {
      console.log("Updating");
      return;
    }
    page.setData({
      updating: true,
    });
    getApp().callAPI("/Module/EducationSystem/UpdateData", e.detail, 
    function(e) {
      console.log(e);
      if (e.data.result) {
        wx.showModal({
          title: '成功',
          content: '教务系统数据更新成功',
          showCancel: false,
          complete: function () {
            if (page.data.autoNavigateBackOnUpdated) {
              wx.navigateBack({ delta: 1 });
            }
          }
        })
      } else {
        wx.showModal({
          title: '错误',
          content: e.data.error,
          showCancel: false
        })
      }
    }, 
    function(e) {

    }, 
    function(e) {
      page.getVerifyCode();
      page.setData({
        updating: false,
      });
    });
  },

  unbind(e) {
    var page = this;
    if (page.data.unbinding) {
      console.log("Unbinding");
      return;
    }
    page.setData({
      unbinding: true,
    });
    getApp().callAPI("/Module/EducationSystem/Unbind", null, 
    function (e) {
      console.log(e);
      if (e.data.result) {
        wx.showModal({
          title: '成功',
          content: '教务系统解绑成功',
          showCancel: false,
          complete: function() {
            wx.redirectTo({
              url: '/pages/bindEducationSystem/bindEducationSystem',
            })
          }
        })
      } else {
        wx.showModal({
          title: '错误',
          content: e.data.error,
          showCancel: false
        })
      }
    },
    function () {

    },
    function () {
      page.setData({
        unbinding: false,
      });
    });
  }
})