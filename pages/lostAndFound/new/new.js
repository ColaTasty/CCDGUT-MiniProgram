var Zan = require('../../../dist/index');

Page(Object.assign({}, Zan.Select, Zan.TopTips, {

  data: {
    items: [
      {
        padding: 0,
        value: '0',
        name: '寻物启事',
      },
      {
        padding: 0,
        value: '1',
        name: '失物招领',
      },
    ],

    imageList: [
    ],

    checked: {
      form: '0'
    },

    activeColor: '#4b0',
    address: ""
  },

  chooseImage(e) {
    wx.chooseImage({
      success: (res) => {
        console.log(res);
        var imageList = this.data.imageList;
        for (var i in res.tempFilePaths)
          imageList.push(res.tempFilePaths[i]);

        this.setData({
          imageList: imageList
        });
      },
    });
  },

  previewImage(e) {
    var page = this;
    var index = e.currentTarget.dataset.index;
    wx.previewImage({
      current: page.data.imageList[index],
      urls: page.data.imageList,
    });
  },

  deleteImage(e) {
    var imageList = this.data.imageList;
    var index = e.currentTarget.dataset.index;

    imageList.splice(index, 1);

    this.setData({
      imageList: imageList      
    });
  },

  openMap(e) {
    console.log(e);
    wx.chooseLocation({
      success: (res) => {
        console.log(res);
        this.setData({
          address: res.address
        });
      },
      fail: function (res) {
        console.log(res);
      }
    })  
  },

  handleZanSelectChange({ componentId, value }) {
    this.setData({
      [`checked.${componentId}`]: value
    });
  },

  formSubmit(event) {
    console.log(event);
  },
}));