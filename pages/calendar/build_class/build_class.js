// pages/calendar/build_item/build_item.js
const calendarModule = require("./../CalendarModule.js");
var dayIndex = 0;
var isNull = true;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dayList: null,
    timeIndex: 0,
    canFinish: false,
    array_num: [],
    numIdx: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    dayIndex = options.dayIndex
    var that = this;
    calendarModule.getDaysFromStorage(
      (e) => {
        var a = [],
          td = e.data,
          d = td[options.dayIndex].dayList;
        d[options.timeIndex].start_time = d[options.timeIndex].start_time == null ? Number(options.timeIndex) : d[options.timeIndex].start_time;
        d[options.timeIndex].end_time = d[options.timeIndex].end_time == null ? Number(options.timeIndex) : d[options.timeIndex].end_time;
        for (var i = Number(options.timeIndex) + 1, j = 0; i <= 10; i++, j++) {
          a[j] = i;
        }
        // console.log(a);
        that.setData({
          array_num: a,
          timeIndex: Number(options.timeIndex),
          dayList: d,
          numIdx: d[options.timeIndex].end_time - d[options.timeIndex].start_time
        });
      }
    )
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
    for (var i = that.data.timeIndex + 1; i <= d[that.data.timeIndex].end_time; i++) {
      d[i] = d[that.data.timeIndex];
    }
    calendarModule.getDaysFromStorage(
      (e) => {
        var td = e.data;
        td[dayIndex].dayList = d
        calendarModule.setDaysToStorage(
          td,
          (e) => {
            calendarModule.setEditFlag(
              true,
              (e) => {
                isNull = ((that.data.dayList[that.data.timeIndex].start_time == null) && (that.data.dayList[that.data.timeIndex].end_time == null) && (that.data.dayList[that.data.timeIndex].value.className == null) && (that.data.dayList[that.data.timeIndex].value.classTeacher == null) && (that.data.dayList[that.data.timeIndex].value.classRoom == null));
                console.log(isNull);
                if (isNull) {
                  calendarModule.editedItemCountMinus(
                    () => {
                      wx.navigateBack({
                        detail: 1
                      })
                    }
                  );
                } else {
                  calendarModule.editedItemCountAdd(
                    () => {
                      wx.navigateBack({
                        detail: 1
                      })
                    }
                  );
                }
              })
          })
      })
  },

  bindinput_value: function(e) {
    // console.log(e);
    var that = this;
    var d = that.data.dayList;
    if (e.currentTarget.dataset.flag == "classTeacher")
      d[that.data.timeIndex].value.classTeacher = e.detail.value;
    else if (e.currentTarget.dataset.flag == "className")
      d[that.data.timeIndex].value.className = e.detail.value;
    else if (e.currentTarget.dataset.flag == "classRoom")
      d[that.data.timeIndex].value.classRoom = e.detail.value;
    console.log(d);
    that.setData({
      dayList: d,
      canFinish: ((that.data.dayList[that.data.timeIndex].start_time != null) && (that.data.dayList[that.data.timeIndex].end_time != null) && (that.data.dayList[that.data.timeIndex].value.className != null) && (that.data.dayList[that.data.timeIndex].value.classTeacher != null) && (that.data.dayList[that.data.timeIndex].value.classRoom != null))
    });
  },

  bindchange_numChange: function(e) {
    this.setData({
      numIdx: e.detail.value
    })
    var that = this;
    var d = that.data.dayList;
    d[that.data.timeIndex].end_time = that.data.array_num[that.data.numIdx] - 1;
    that.setData({
      dayList: d,
      canFinish: ((that.data.dayList[that.data.timeIndex].start_time != null) && (that.data.dayList[that.data.timeIndex].end_time != null) && (that.data.dayList[that.data.timeIndex].value.className != null) && (that.data.dayList[that.data.timeIndex].value.classTeacher != null) && (that.data.dayList[that.data.timeIndex].value.classRoom != null))
    })
  },

  bindtap_reset: function(e) {
    var d = this.data.dayList,
      that = this,
      tmp = {
        start_time: null,
        end_time: null,
        value: {
          className: null,
          classTeacher: null,
          classRoom: null
        }
      },
      dl = d[that.data.timeIndex],
      i = dl.start_time,
      end = dl.end_time;
    for (; i <= end; i++) {
      d[i] = tmp;
    }
    this.setData({
      canFinish: true,
      dayList: d
    })
  }
})