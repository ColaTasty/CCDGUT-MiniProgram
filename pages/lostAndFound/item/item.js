var common = require("../Common/Common.js");
var Zan = require('../../../dist/index');

Page(Object.assign({}, Zan.Tab, Zan.TopTips, {
  data: {
    showLeftPopup: false,    
    itemId: null,
    list: [],
    uid: null,
    imageURLPrefix: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      itemId: options.itemId,
    });

    var getItemClosure = () => {
      common.getItem({ singleItem: this.data.itemId }, (data) => {
        if (!data.list.length) {
          wx.showModal({
            title: '错误',
            content: '启事不存在',
            showCancel: false,
            confirmText: "返回"
          });
          wx.navigateBack();
        }

        this.setData({
          list: data.list,
          uid: data.uid,
          imageURLPrefix: data.prefix,
        });
      });
    };

    
    var app = getApp();

    if (app.getUserInfoComplete) {
      getItemClosure();
    } else {
      app.userInfoCompleteCallback = getItemClosure;
    }
  },

  toggleLeftPopup() {
    this.setData({
      showLeftPopup: !this.data.showLeftPopup
    });
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
}));