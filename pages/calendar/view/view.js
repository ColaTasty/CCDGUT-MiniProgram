// pages/calendar/view/view.js
const app = getApp();
var init_table_item = [{
  time: {
    hour: null,
    minute: null
  },
  value: null
}, {
  time: {
    hour: null,
    minute: null
  },
  value: null
}, {
  time: {
    hour: null,
    minute: null
  },
  value: null
}, {
  time: {
    hour: null,
    minute: null
  },
  value: null
}, {
  time: {
    hour: null,
    minute: null
  },
  value: null
}, {
  time: {
    hour: null,
    minute: null
  },
  value: null
}, {
  time: {
    hour: null,
    minute: null
  },
  value: null
}, {
  time: {
    hour: null,
    minute: null
  },
  value: null
}, {
  time: {
    hour: null,
    minute: null
  },
  value: null
}, {
  time: {
    hour: null,
    minute: null
  },
  value: null
}];

var init_days = [{
  day: "星期一",
  checked: "nav-item cur",
  item: init_table_item
}, {
  day: "星期二",
  checked: "nav-item",
  item: init_table_item
}, {
  day: "星期三",
  checked: "nav-item",
  item: init_table_item
}, {
  day: "星期四",
  checked: "nav-item",
  item: init_table_item
}, {
  day: "星期五",
  checked: "nav-item",
  item: init_table_item
}, {
  day: "星期六",
  checked: "nav-item",
  item: init_table_item
}, {
  day: "星期日",
  checked: "nav-item",
  item: init_table_item
}, ];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    app: app,
    tables: null,
    days_index: 0,
    isEditing: false,
    canSave: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    if (options.tid != null) {
      wx.showLoading({
        title: '正在查询。。。',
      })
      app.requestTo(
        "/wxapp/calendar/viewTable", {
          tid: options.tid
        },
        null,
        (res) => {
          var d = init_days;
          if (res.data.isOK) {
            d[0].item = JSON.parse(res.data.Mon);
            d[1].item = JSON.parse(res.data.Tue);
            d[2].item = JSON.parse(res.data.Wed);
            d[3].item = JSON.parse(res.data.Thu);
            d[4].item = JSON.parse(res.data.Fri);
            d[5].item = JSON.parse(res.data.Sat);
            d[6].item = JSON.parse(res.data.Sun);
            that.setData({
              tables: {
                tid: res.data.tid,
                tname: res.data.tname,
                ttime: res.data.ttime,
                days: d,
              }
            })
          }
        },
        null,
        (res) => {
          wx.hideLoading();
        }
      )
    }
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
    var that = this;
    wx.getStorage({
      key: 'table_edit',
      success: function(res) {
        if (res.data) {
          wx.getStorage({
            key: 'table_tmp',
            success: function(res) {
              var t = that.data.tables;
              var d = res.data;
              t.days[that.data.days_index].item = d;
              that.setData({
                tables: t,
                canSave: true
              })
              wx.setStorageSync("table_edit", false);
            },
          })
        }
      },
    })
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
    if (this.data.isEditing) {
      wx.showModal({
        title: '确定退出？',
        content: '这将不保存已经写好的信息',
        confirmColor: "black",
        confirmText: "退出",
        cancelColor: "red",
        cancelText: "考虑一下",
        success: (e) => {
          if (e.confirm) {
            wx.removeStorageSync("table_tmp");
            wx.removeStorageSync("table_edit");
            wx.removeStorageSync("tables_backup");
          }
          if(e.cancel){
            wx.navigateTo({
              url: './view/view?tid='+this.data.tables.tid,
            })
          }
        }
      })
    }
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

  bindtap_dayChange: function(e) {
    var that = this;
    var t = that.data.tables
    for (var i = 0; i < t.days.length; i++) {
      t.days[i].checked = "nav-item";
    }
    t.days[e.currentTarget.dataset.index].checked = "nav-item cur";
    that.setData({
      tables: t,
      days_index: e.currentTarget.dataset.index,
    })
  },

  bindtap_edit: function(e) {
    var that = this;
    that.setData({
      isEditing: true
    })
    wx.setStorageSync("tables_backup", that.data.tables);
  },

  bindtap_toBuild: function(e) {
    var that = this;
    wx.setStorage({
      key: 'table_tmp',
      data: that.data.tables.days[that.data.days_index].item,
      success: () => {
        wx.navigateTo({
          url: './../build_item/build_item?time_index=' + e.currentTarget.dataset.timeIndex,
        })
      }
    })
  },

  bindtap_back: function(e) {
    var that = this;
    wx.getStorage({
      key: 'tables_backup',
      success: function(res) {
        that.setData({
          isEditing: false,
          canSave: false,
          tables: res.data
        })
      },
    })
  },

  bindtap_saveEditing: function(e) {
    var that = this;
    wx.showLoading({
      title: '正在保存...',
    });
    wx.getStorage({
      key: 'tables_backup',
      success: function(res) {
        app.requestTo(
          "/wxapp/calendar/reBuild", {
            tid: that.data.tables.tid,
            Mon: (JSON.stringify(that.data.tables.days[0].item) == JSON.stringify(res.data.days[0].item) ? false : JSON.stringify(that.data.tables.days[0].item)),
            Tue: (JSON.stringify(that.data.tables.days[1].item) == JSON.stringify(res.data.days[1].item) ? false : JSON.stringify(that.data.tables.days[1].item)),
            Wed: (JSON.stringify(that.data.tables.days[2].item) == JSON.stringify(res.data.days[2].item) ? false : JSON.stringify(that.data.tables.days[2].item)),
            Thu: (JSON.stringify(that.data.tables.days[3].item) == JSON.stringify(res.data.days[3].item) ? false : JSON.stringify(that.data.tables.days[3].item)),
            Fri: (JSON.stringify(that.data.tables.days[4].item) == JSON.stringify(res.data.days[4].item) ? false : JSON.stringify(that.data.tables.days[4].item)),
            Sat: (JSON.stringify(that.data.tables.days[5].item) == JSON.stringify(res.data.days[5].item) ? false : JSON.stringify(that.data.tables.days[5].item)),
            Sun: (JSON.stringify(that.data.tables.days[6].item) == JSON.stringify(res.data.days[6].item) ? false : JSON.stringify(that.data.tables.days[6].item)),
          },
          null,
          (res) => {
            if (res.data.isOK) {
              wx.setStorage({
                key: 'tables_backup',
                data: that.data.tables,
                success: function(e) {
                  that.setData({
                    isEditing: false,
                    canSave: false
                  });
                }
              })
            } else {
              Dialog({
                title: "更新周程表失败",
                message: "服务器原因，请反馈",
                selector: '#alter',
              });
            }
          },
          null,
          (res) => {
            wx.hideLoading();
          }
        );
      },
    })
  }
})