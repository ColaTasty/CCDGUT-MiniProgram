var Zan = require('../../../dist/index');

Page(Object.assign({}, Zan.Tab, Zan.TopTips, {
  data: {
    showLeftPopup: false,
    showBottomPopup: false,
    tab1: {
      list: [
        {
        id: '3',
        title: '最新发布'
        }, 
        {
        id: '1',
        title: '失物招领'
        }, 
        {
        id: '0',
        title: '寻物启事'
        },
        {
          id: '4',
          title: '我的启事'
        }
      ],
      selectedId: '3',
      scroll: false
    },
    list: [],
    singleItem: null,
    uid: null,
    imageURLPrefix: "",
    keywords: "",
    nomore: false,
    contactName: "",
    weChatUsername: "",
    phoneNumber: "",
    showNewButton: true,
  },

  onPullDownRefresh() {
    if (this.data.singleItem) {
      wx.stopPullDownRefresh();
      return;
    }

    this.listItem(
      this.getLatestId(),
      "new",
      function () {
        wx.stopPullDownRefresh()
      }
    );
  },

  onReachBottom() {
    if (this.data.singleItem || this.data.nomore) {
      return;
    }

    this.listItem(
      this.getOldestId(),
      "old",
      function () {
        wx.stopPullDownRefresh()
      }
    );
  },

  searchInputFocus() {
    this.setData({
      showNewButton: false
    });
  },

  searchInputBlur() {
    this.setData({
      showNewButton: true
    });
  },

  toggleLeftPopup() {
    this.setData({
      showLeftPopup: !this.data.showLeftPopup
    });
  },

  toggleBottomPopup() {
    this.setData({
      showBottomPopup: !this.data.showBottomPopup
    });
  },

  makePhoneCall(e) {
    wx.makePhoneCall({
      phoneNumber: this.data.phoneNumber,
    })
  },

  handleZanTabChange(e) {
    var componentId = e.componentId;
    var selectedId = e.selectedId;

    this.setData({
      [`${componentId}.selectedId`]: selectedId
    });

    this.refreshList();
  },

  previewImage(e) {
    var imageIndex = e.currentTarget.dataset.imageindex;
    var index = e.currentTarget.dataset.index;

    wx.previewImage({
      current: this.data.list[index].urls[imageIndex],
      urls: this.data.list[index].urls,
    });
  },

  onShareAppMessage(options) {
    console.log(options);
    if (options.from == "button") {
      var index = options.target.dataset.index;
      var itemId = this.data.list[index].item.id;
      return {
        title: this.data.list[index].userInfo.nickName + "的" + (this.data.list[index].item.type == 0 ? "寻物启事" : "失物招领启事"),
        path: "/pages/lostAndFound/index/index?singleItem=" + itemId
      };
    }
  },

  onShow: function (e) {
    /*
    wx.chooseLocation({
      success: function(res) {
        console.log(res);
      },
    })
    */
  },

  onLoad: function (e) {
    if (e.singleItem) {
      this.setData({
        singleItem: e.singleItem
      });
    }

    if (e.tabId) {
      this.setData({
        [`tab1.selectedId`]: e.tabId
      });
    }

    var app = getApp();

    if (app.getUserInfoComplete) {
      this.refreshList();    
    } else {
      app.userInfoCompleteCallback = this.refreshList;
    }
  },

  searchInputConfirm(e) {
    var keywords = e.detail.value;
    if (keywords == this.data.keywords) {
      return;
    }

    this.setData({ keywords: keywords });
    this.refreshList();
  },

  searchFormSubmit: function(e) {
    console.log(e);
    console.log(this.data.keywords);
  },

  contact(e) {
    console.log(e);
    this.setData({
      contactName: this.data.list[e.currentTarget.dataset.index].item.name,
      weChatUsername: this.data.list[e.currentTarget.dataset.index].item.weChatUsername,
      phoneNumber: this.data.list[e.currentTarget.dataset.index].item.phoneNumber
    });
    this.toggleBottomPopup();
  },

  closeItem(e) {
    var index = e.currentTarget.dataset.index;
    var list = this.data.list;
    var itemId = list[index].item.id;

    wx.showModal({
      title: '请确认',
      content: '启事关闭后，将不会再展示给其TA人，此操作无法撤销，确认关闭？',
      success: (res) => {
        if (res.confirm) {
          getApp().callAPI("/Module/LostAndFound/CloseItem?itemId=" + itemId,  {}, (e) => {
            if (e.data.result) {
              list[index].item.status = 2;
              this.setData({list: list});
              this.showZanTopTips('启事关闭成功');
            } else {
              wx.showModal({
                title: '错误',
                content: e.data.error,
                showCancel: false
              })
            }
          });
        }
      }
    })
  },

  resetList() {
    this.setData({ list: [], nomore: false});
  },

  refreshList() {
    this.resetList();

    this.listItem(
      this.getLatestId(),
      "new",
      function () {
      }
    );
  },

  getItem: function(fromId, fromMode, onSuccess, onError, onComplete) {
    var params = {};

    if (this.data.singleItem) {
      params.singleItem = this.data.singleItem;
    } else {
      params.type = this.data.tab1.selectedId;
      params.fromId = fromId;
      params.fromMode = fromMode;
      params.keywords = this.data.keywords;
    }

    wx.showLoading({
      title: '数据加载中',
    });

    getApp().callAPI(
      "/Module/LostAndFound/List", 
      params, 
      (e) => {
        if (e.data.result) {
          this.setData({
            uid: e.data.uid,
            imageURLPrefix: e.data.prefix
          });
          onSuccess(e.data.list, e.data.uid);
          console.log(this.data.list);
        } else {
          wx.showModal({
            title: '错误',
            content: e.data.error,
            showCancel: false
          })
        }
      },
      onError,
      (e) => {
        wx.hideLoading();
        if (onComplete)
          onComplete();
      }
      );
  },

  // 取列表中最新的一项的ID
  getLatestId() {
    if (this.data.list.length)
      return this.data.list[0].item.id;
    return 0;
  },

  // 取列表中最旧的一项的ID
  getOldestId()
  {
    if (this.data.list.length)
      return this.data.list[this.data.list.length - 1].item.id;
    return 0;
  },

  itemProcessor(item)
  {
    var urls = this.createImageURLList(item);
    var keywords = item.item.keywords.split(" ");
    item.urls = urls;
    item.keywords = keywords;

    return item;
  },

  listItem(fromId, fromMode, onComplete) {
    fromMode = fromMode || "";

    if (fromMode == "new") {
      var callback = (list, uid) => {
        var oldList = this.data.list;
        var currentIndex = list.length - 1;
        while (currentIndex >= 0) {
          oldList.unshift(this.itemProcessor(list[currentIndex--]));
        }

        this.setData({
          list: oldList
        });
      }
    } else {
      var callback = (list, uid) => {
        if (!list.length) {
          this.showZanTopTips('已无更多记录');
          this.setData({ nomore: true });
          return;
        }
        var oldList = this.data.list;
        for (var i in list) {
          var item = list[i];
          oldList.push(this.itemProcessor(item));
        }

        this.setData({
          list: oldList
        });
      }
    }

    this.getItem(
      fromId,
      fromMode,
      callback,
      function (e) {},
      onComplete
    );
  },
  
  // 通过项目的images对象数组，创建一个imagesURL数组
  createImageURLList(item) {
    var urls = [];
    for (var i in item.images) {
      urls[i] = this.data.imageURLPrefix + item.images[i].relativePath;
    }

    return urls;
  },

  copyWeChatUsername() {
    this.copy(this.data.weChatUsername);
  },

  copyPhoneNumber() {
    this.copy(this.data.phoneNumber);
  },


  copy(value) {
    wx.setClipboardData({
      icon: "success",
      data: value,
      success: function() {
        wx.showToast({
          title: '复制成功',
        })
      }
    })
  }

}));