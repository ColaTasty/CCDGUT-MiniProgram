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
    address: "",

    submitting: false,
    imageCounter: 0
  },

  chooseImage(e) {
    wx.chooseImage({
      count: 9,
      success: (res) => {
        console.log(res);
        var imageList = this.data.imageList;
        var imageCounter = this.data.imageCounter;
        for (var i in res.tempFilePaths) {
          if (imageCounter >= 9) {
            break;
          }
          imageList.push(res.tempFilePaths[i]);
          ++imageCounter;
        }

        this.setData({
          imageList: imageList,
          imageCounter: imageCounter
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
    if (this.isSubmitting())
      return;
    var imageList = this.data.imageList;
    var index = e.currentTarget.dataset.index;

    imageList.splice(index, 1);

    this.setData({
      imageList: imageList,
      imageCounter: this.data.imageCounter - 1
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

  // 图片上传完毕后调用
  onImageUploadFinish(itemId)
  {

    console.log("onImageUploadFinish is being invoking.");
      // 调用API，修改项目的状态为NORMAL
    this.imageUploadFinish(
      itemId,
      (e) => {
        console.log(e);
        wx.showToast({
          title: '启事创建成功',
          icon: 'success',
          duration: 3000,
        }); 
        setTimeout(function () {
          wx.redirectTo({
            url: '/pages/lostAndFound/index/index?tabId=4',
          })
        }, 2000);
      },
      (e) => {
        this.setData({ submitting: false });        
        wx.showModal({
          title: '错误',
          content: e.data.error,
          showCancel: false,
        });
      },
      (e) => {
      }
    )
  },

  formSubmit(event) {
    // console.log(event);

    // 置状态为正在提交
    this.setData({ submitting: true });

    // 调用创建项目的API
    getApp().callAPI("/Module/LostAndFound/New", event.detail, 
    // 微信API调用成功的回调
    (e) => {
      // API返回成功，进行上传图片操作
      if (e.data.result) {
        console.log("Item created success!");
        this.uploadImage(
            e.data.itemId, // API返回的项目ID
            this.onImageUploadFinish, // 图片上传完毕后回调
            (e) => {},
            (e) => {},
        );
      } else {
        this.setData({ submitting: false });
        wx.showModal({
          title: '错误',
          content: e.data.error,
          showCancel: false,
        })
      }
    },
    (e) => {
    },
    (e) => {
    }
    );
  },

  uploadImage(itemId, onFinish, onError, onComplete) {
    var app = getApp();
    var index = 0;
    var length = this.data.imageList.length;

    var doUpload = () => {
      console.log("Cureent index: " + index);
      // 检查图片是否已上传完毕
      if (index >= length) {
        // 上传完毕则调用两个回调
        onFinish(itemId);
        onComplete();
        return;
      }
      app.uploadFile(
        "/Module/LostAndFound/UploadImage?itemId=" + itemId, 
        this.data.imageList[index], 
        "image", 
        {},
        (e) => {
          e.data = JSON.parse(e.data);
          if (e.data.result) {
            // 前一张图片上传成功后，继续上传
            console.log("Image upload success!");
            ++index;
            doUpload();
          } else {
            this.setData({ submitting: false });            
            wx.showModal({
              title: '错误',
              content: e.data.error,
              showCancel: false,
            })
          }
        },
        (e) => {
          this.setData({ submitting: false });
          wx.showModal({
            title: '错误',
            content: e.errMsg,
            showCancel: false
          })
        },
        );
    }

    doUpload();
  },

  imageUploadFinish(itemId, onSuccess, onError, onComplete) {
    getApp().callAPI(
      "/Module/LostAndFound/ImageUploadFinish?itemId=" + itemId, 
      {},
      onSuccess,
      onError,
      onComplete
    );
  },

  isSubmitting() {
    return this.data.submitting;
  }
}));