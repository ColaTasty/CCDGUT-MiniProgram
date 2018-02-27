// pages/mark/mark.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    marks: [],
    noMarks: true,
    loading: false,
    educationSystemBindCheck: false,
  },

  educationSystemBindCheck: function () {
    var page = this;

    if (page.data.loading) {
      console.log("Loading");
      return;
    }

    page.setData({
      loading: true
    });
    
    getApp().callAPI("/Module/EducationSystem/BindCheck", null, function (e) {
      page.setData({
        educationSystemBindCheck: e.data.result
      });
      if (e.data.result) {
        page.getMarks();
      } else {
        page.setData({
          loading: false
        });
      }
    });
  },

  getMarks() {
    var page = this;
    getApp().callAPI("/Module/EducationSystem/Marks", null,
      function (e) {
        page.setData({
          marks: e.data.marks
        });
        if (e.data.marks.length == 0) {
          page.setData({
            noMarks: true,
          });
        } else {
          page.setData({
            noMarks: false,
          });
        }
      },
      function () { },
      function () {
        page.setData({
          loading: false
        });
      });
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
    this.educationSystemBindCheck();
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
  
  }
})