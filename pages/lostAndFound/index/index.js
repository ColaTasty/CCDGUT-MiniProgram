var Zan = require('../../../dist/index');

Page(Object.assign({}, Zan.Tab, {
  data: {
    showLeftPopup: false,
    tab1: {
      list: [
        {
        id: 'all',
        title: '最新发布'
        }, 
        {
        id: 'topay',
        title: '失物招领'
        }, 
        {
        id: 'tosend',
        title: '寻物启事'
        }
      ],
      selectedId: 'all',
      scroll: false
    },
    imageList: [
      "https://mp.weixin.qq.com/debug/wxadoc/dev/image/cat/2.png?t=2018327",
      "https://mp.weixin.qq.com/debug/wxadoc/dev/image/cat/2.png?t=2018327",
      "https://mp.weixin.qq.com/debug/wxadoc/dev/image/cat/2.png?t=2018327",
      "https://mp.weixin.qq.com/debug/wxadoc/dev/image/cat/2.png?t=2018327",
      "https://mp.weixin.qq.com/debug/wxadoc/dev/image/cat/2.png?t=2018327",
      "https://mp.weixin.qq.com/debug/wxadoc/dev/image/cat/2.png?t=2018327",
      "https://mp.weixin.qq.com/debug/wxadoc/dev/image/cat/2.png?t=2018327",
      "https://mp.weixin.qq.com/debug/wxadoc/dev/image/cat/2.png?t=2018327",
      "https://mp.weixin.qq.com/debug/wxadoc/dev/image/cat/2.png?t=2018327",
      "https://mp.weixin.qq.com/debug/wxadoc/dev/image/cat/2.png?t=2018327",
      "https://mp.weixin.qq.com/debug/wxadoc/dev/image/cat/2.png?t=2018327",
      "https://mp.weixin.qq.com/debug/wxadoc/dev/image/cat/2.png?t=2018327",
    ]
  },

  toggleLeftPopup() {
    this.setData({
      showLeftPopup: !this.data.showLeftPopup
    });
  },

  handleZanTabChange(e) {
    var componentId = e.componentId;
    var selectedId = e.selectedId;

    this.setData({
      [`${componentId}.selectedId`]: selectedId
    });
  },

  previewImage(e) {
    var page = this;
    console.log(e);
    wx.previewImage({
      urls: page.data.imageList,
    });
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
    /*
    */
  },

  searchFormSubmit: function(e) {

  },

  uploadFile: function(filePath) {
    wx.uploadFile({
      url: 'https://ccdgut.yuninter.net/',
      filePath: filePath,
      name: 'file',
      success: function (e) {
        console.log(e);
      }
    });
  }

}));