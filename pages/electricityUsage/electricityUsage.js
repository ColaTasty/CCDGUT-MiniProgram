// pages/electricityUsage/electricityUsage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    area: [
      "宿舍区",
      "学1A",
      "学1B",
      "学1C",
      "学1D",
      "学2A",
      "学2B",
      "学2C",
      "学2D",
      "学3A",
      "学3B",
      "学3C",
      "学3D",
      "学4A",
      "学4B",
      "学4C",
      "学4D",
      "学5A",
      "学5B",
      "学5C",
      "学5D",
      "学6A",
      "学6B",
      "学6C",
      "学6D",
      "学7A",
      "学7B",
      "学7C",
      "学8A",
      "学8B",
      "学8C",
      "学9A",
      "学9B",
      "学9C",
      "学10",
      "学11",
      "学12",
    ],
    areaIndex: 0,
    queryLoadingStatus: "",
    loaded: false,
    showUsage: false,
    balance: null,
    usageRecords: [],
    historyRoom: "",
    querying: false,
    loading: false,
  },

  getQueryHistory() {
    var page = this;
    page.setData({
      loading: true,
    });
    getApp().callAPI("/Module/ElectricityUsage/History", null, 
    function(e) {
      if (e.data.result) {
        page.setData({
          areaIndex: e.data.area,
          historyRoom: e.data.room
        });
      }
    },
    function() {},
    function() {
      page.setData({
        loading: false,
      });
    });
  },

  electricityUsageQuery(e) {
    var page = this;
    if (page.data.querying) {
      console.log("Querying");
      return;
    }
    page.setData({
      queryLoadingStatus: "zan-btn--disabled zan-btn--loading",
      showUsage: true,
      querying: true      
    });
    getApp().callAPI("/Module/ElectricityUsage/Query", e.detail, 
    function(e) {
      if (e.data.result) {
        page.setData({
          loaded: true,
          balance: e.data.balance,
          usageRecords: e.data.usageRecords,
        });
      } else {
        page.setData({
          showUsage: false,
        });
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
      page.setData({
        queryLoadingStatus: "",
        querying: false,
      });
    });
  },

  onAreaChange(e) {
    this.setData({
      areaIndex: e.detail.value
    });
  },

  handleZanFieldChange(e) {
    const { componentId, detail } = e;

    console.log('[zan:field:change]', componentId, detail);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getQueryHistory();
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
  
  }
})