// pages/godDamnSystem/godDamnSystem.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    educationSystemBindCheck: false,
    limit: [
      "最近十条",
      "最近二十条",
      "最近五十条",
      "全部"
    ],
    limitValue: [
      10,
      20,
      50,
      0
    ],
    limitIndex: 0,
    history: []
  },

  onLimitChange: function (e) {
    this.setData({
      limitIndex: e.detail.value
    });
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
        educationSystemBindCheck: e.data.result,
        loading: false
      });
    });
  },

  histortQuery: function(e) {
    var page = this;    
    page.setData({
      loading: true
    });
    getApp().callAPI("/Module/GodDamnSystem/Query", e.detail, 
    function (e) {
      if (e.data.result) {
        page.setData({
          history: e.data.list
        });
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
    function (e) {
      page.setData({
        loading: false
      });
    }
    );
  },

  resultColor: {
    "正常": "color:green;",
    "早退": "color:blue;",
    "事假": "color:blue;",
    "病假": "color:blue;",
    "迟到": "color:blue;",
    "旷课": "color:blue;",
    "本次课旷课": "color:blue;"
  },

/*
  resultColor: function (result) {
    console.log(result);
    switch (result) {
      case "正常":
        return ;
      case "早退":
      case "事假":
      case "病假":
      case "迟到":
        return ;
      case "旷课":
      case "本次课旷课":
        return "color:red;";
    }
  },
  */

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