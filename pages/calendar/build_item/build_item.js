// pages/calendar/build_item/build_item.js
const calendarModuel = require("./../CalendarModule.js");
var dayIndex = 0;
var isNull = true;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    table: null,
    timeIndex: 0,
    value: "",
    canFinish: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    dayIndex = options.dayIndex;
    var tIdx = options.timeIndex;
    calendarModuel.getDaysFromStorage(
      (e) => {
        that.setData({
          dayList: e.data[dayIndex].dayList,
          timeIndex: tIdx
        });
      }
    );
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

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

  bindtap_finish: function(e) {
    var that = this;
    var d = that.data.dayList;
    calendarModuel.getDaysFromStorage(
      (e) => {
        var td = e.data;
        td[dayIndex].dayList = d;
        calendarModuel.setDaysToStorage(
          td,
          (e) => {
            calendarModuel.setEditFlag(
              true,
              (e) => {
                isNull = (that.data.dayList[that.data.timeIndex].start_time.hour == null) && (that.data.dayList[that.data.timeIndex].end_time.hour == null) && (that.data.dayList[that.data.timeIndex].value == null);
                if (isNull) {
                  calendarModuel.editedItemCountMinus(
                    () => {
                      wx.navigateBack({
                        detail: 1
                      })
                    }
                  );
                } else {
                  calendarModuel.editedItemCountAdd(
                    () => {
                      wx.navigateBack({
                        detail: 1
                      })
                    }
                  );
                }
              }
            )
          }
        )
      }
    )
  },

  bindinput_value: function(e) {
    var that = this;
    var d = that.data.dayList;
    d[that.data.timeIndex].value = e.detail.value;
    that.setData({
      dayList: d,
      canFinish: (that.data.dayList[that.data.timeIndex].start_time.hour != null) && (that.data.dayList[that.data.timeIndex].end_time.hour != null) && (that.data.dayList[that.data.timeIndex].value != null)
    });
  },

  bindchange_timeChange: function(e) {
    var that = this;
    var d = that.data.dayList;
    if (e.currentTarget.dataset.tidx == "start") {
      d[that.data.timeIndex].start_time.hour = e.detail.value[3];
      d[that.data.timeIndex].start_time.minute = e.detail.value[4];
    } else {
      d[that.data.timeIndex].end_time.hour = e.detail.value[3];
      d[that.data.timeIndex].end_time.minute = e.detail.value[4];
    }
    that.setData({
      dayList: d,
      canFinish: (that.data.dayList[that.data.timeIndex].start_time.hour != null) && (that.data.dayList[that.data.timeIndex].end_time.hour != null) && (that.data.dayList[that.data.timeIndex].value != null)
    });
  },

  bindtap_reset: function(e) {
    var d = this.data.dayList;
    d[this.data.timeIndex].start_time = {
      hour: null,
      minute: null
    };
    d[this.data.timeIndex].end_time = {
      hour: null,
      minute: null
    };
    d[this.data.timeIndex].value = null;
    this.setData({
      canFinish: true,
      dayList: d
    });
  }
})