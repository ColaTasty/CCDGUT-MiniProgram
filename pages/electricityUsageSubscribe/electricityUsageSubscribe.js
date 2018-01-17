var Zan = require('../../dist/index');

// pages/electricityUsageSubscribe/electricityUsageSubscribe.js
Page(Object.assign({}, Zan.Switch, {

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
    historyRoom: "",
    sync: {
      checked: false
    },
  },

  getSubscriptionStatus() {
    var page = this;
    getApp().callAPI("/Module/ElectricityUsage/SubscriptionStatus", null, function (e) {
      if (e.data.result) {
        page.setData({
          areaIndex: e.data.area,
          historyRoom: e.data.room
        });
        if (e.data.enableSubscribe) {
          page.setData({
            [`sync.checked`]: true
          });
        } else {
          page.setData({
            [`sync.checked`]: false
          });
        }
      }
    });
  },

  handleZanSwitchChange(e) {
    var componentId = e.componentId;
    var checked = e.checked;

    if (componentId == 'sync') {
      // 同步开关
      this.setData({
        [`${componentId}.checked`]: checked
      });
    } else if (componentId == 'async') {
      // 异步开关
      this.setData({
        [`${componentId}.loading`]: true
      });
      setTimeout(() => {
        this.setData({
          [`${componentId}.loading`]: false,
          [`${componentId}.checked`]: checked
        });
      }, 500);
    }
  },

  onAreaChange(e) {
    this.setData({
      areaIndex: e.detail.value
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSubscriptionStatus();
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

  subscriptionSetting(e) {
    var page = this;
    page.setData({
      queryLoadingStatus: "zan-btn--disabled zan-btn--loading",
    });
    e.detail.value.enableSubscribe = this.data.sync.checked;
    getApp().callAPI("/Module/ElectricityUsage/SubscriptionSetting", e.detail,
      function (e) {
        if (e.data.result) {
          wx.showModal({
            title: '成功',
            content: "保存成功",
            showCancel: false
          })
        } else {
          wx.showModal({
            title: '错误',
            content: e.data.error,
            showCancel: false
          })
        }
      },
      function (e) {
      },
      function (e) {
        page.setData({
          queryLoadingStatus: "",
        });
      });
  },
}))