// pages/secondHand/secondHand.js
var APP = getApp();
var module = require("./Module.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        app: APP,
        categories: undefined,
        categoryIndex: 0,
        searchGood: "",
        messages: undefined
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var self = this;
        // 初始导航栏菜单按键
        var app = self.data.app;
        app.systemInfo.menuButton = wx.getMenuButtonBoundingClientRect();
        self.setData({
            app: app
        });
        // 初始商品类别
        self.setData({
            categories: module.selectCategory(0)
        });
        // 初始测试消息列表用例
        self.setData({
            messages: module.getTestMessagesList(5)
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {},

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },

    bindtap_selectCategory: function(e) {
        var self = this,
            cidx = e.currentTarget.dataset.cidx;
        self.setData({
            categories: module.selectCategory(cidx),
            categoryIndex: cidx
        })
    },

    bindchange_searchGood: function(e) {
        this.setData({
            searchGood: e.detail.value
        })
    },

    bindsearch_searchGood: function(e) {
        var self = this;
        wx.showModal({
            content: self.data.searchGood
        })
    },

    bindcancel_searchGood: function(e) {
        this.setData({
            searchGood: ""
        })
    }
})