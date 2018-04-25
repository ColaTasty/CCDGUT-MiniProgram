// pages/bindEducation/bindEducation.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    verifyCode: "",
    sessionId: "",
    loading: false,
    binding: false,
  },

  getVerifyCode() {
    var page = this;
    if (page.data.loading) {
      console.log("Loading");
      return;
    }
    page.setData({
      loading: true,
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
          loading: false,
        });
      }
    );
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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

  formSubmit: function (e) {
    var page = this;
    if (page.data.binding) {
      console.log("Binding");
      return;
    }
    page.setData({
      binding: true,
    });
    getApp().callAPI("/Module/EducationSystem/Bind", e.detail, 
    function (e) {
      if (!e.data.result) {
        var errorMessage = e.data.error;
        if (errorMessage == undefined)
          errorMessage = "未知错误";
        wx.showModal({
          title: '错误',
          content: errorMessage,
          showCancel: false,
        })
      } else {
        wx.showModal({
          title: '成功',
          content: "教务系统绑定成功",
          showCancel: false,
          complete: function() {
            getApp().educationSystemBind = true;
            wx.navigateBack({
              delta: 1
            });
          }
        })
      }
    },
    function(e) {

    },
    function(e) {
      page.getVerifyCode();
      page.setData({
        binding: false,
      });
    }
    );
  },

  formReset: function () {
  }
})