var common = require("../Common/Common.js");
var Zan = require('../../../dist/index');

Page(Object.assign({}, Zan.Tab, Zan.TopTips, {
  data: {
    showLeftPopup: false,    
    itemId: null,
    list: [],
    commentList: [],
    commentIdMap: [],
    uid: null,
    imageURLPrefix: "",
    replyTo: null,
    commentCounter: 0,
    commentValue: "",
    commentPlaceholder: "创建新评论",
    submitting: false,
  },

  listComment: function() {
    common.getComment(this.data.list[0].item.id, (data) => {
      var commentMap = {};
      for (var i in data.list) {
        commentMap[data.list[i].comment.id] = parseInt(i);
      }

      this.setData({
        commentIdMap: commentMap,
        commentCounter: data.list.length,
        commentList: data.list,
      });
    });
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

        var list = [];

        for (var i in data.list) {
          var item = common.itemProcessor(data.list[i], data.prefix);
          list.push(item);
        }

        this.setData({
          list: list,
          uid: data.uid,
          imageURLPrefix: data.prefix,
        });

        this.listComment();
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

  toggleBottomPopup() {
    this.setData({
      showBottomPopup: !this.data.showBottomPopup
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
  onShareAppMessage: function (options) {
    if (options.from == "button") {
      var index = options.target.dataset.index;
      var itemId = this.data.list[index].item.id;

      var name = this.data.list[index].userInfo.nickName;
      if (!name || name == "")
        name = this.data.list[index].item.name;
      if (!name || name == "")
        name = "匿名";

      return {
        title: name + "的" + (this.data.list[index].item.type == 0 ? "寻物启事" : "失物招领启事"),
        path: "/pages/lostAndFound/index/index?singleItem=" + itemId
      };
    }
  },

  previewImage(e) {
    var imageIndex = e.currentTarget.dataset.imageindex;
    var index = e.currentTarget.dataset.index;

    wx.previewImage({
      current: this.data.list[index].urls[imageIndex],
      urls: this.data.list[index].urls,
    });
  },

  copyContactName() {
    this.copy(this.data.list[0].item.contactName);
  },

  copyWeChatUsername() {
    this.copy(this.data.list[0].item.weChatUsername);
  },

  copyPhoneNumber() {
    this.copy(this.data.list[0].item.phoneNumber);
  },


  copy(value) {
    wx.setClipboardData({
      icon: "success",
      data: value,
      success: function () {
        wx.showToast({
          title: '复制成功',
        })
      }
    })
  },

  closeItem(e) {
    var index = e.currentTarget.dataset.index;
    var list = this.data.list;
    var itemId = list[index].item.id;

    common.closeItem(itemId, (res) => {
      this.showZanTopTips('启事关闭成功');
      var list = this.data.list;
      list[0].item.status = 2;
      this.setData({list: list});
    });
  },

  openCommentBox() {
    this.setData({ replyTo: null, commentPlaceholder: "创建新评论"});
    this.toggleBottomPopup();
  },

  replayToComment(e) {
    var commentIndex = e.currentTarget.dataset.index;
    var commentPlaceholder = "回复 #" + (commentIndex + 1) + " " + this.data.commentList[commentIndex].userInfo.nickName;
    this.setData({ replyTo: this.data.commentList[commentIndex].comment.id, commentPlaceholder: commentPlaceholder});
    this.toggleBottomPopup();    
  },

  deleteComment(e) {
    console.log(e);
    var commentIndex = e.currentTarget.dataset.index;
    var commentId = this.data.commentList[commentIndex].comment.id;

    wx.showModal({
      title: '确认',
      content: '确认删除此条评论？注意：此操作不可撤销。',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({
            title: '请稍等...',
            mask: true
          })
          getApp().callAPI(
            common.MODULE_PREFIX + "DeleteComment?commentId=" + commentId,
            {},
            (res) => {
              if (res.data.result) {
                this.showZanTopTips('评论删除成功！');
                var commentList = this.data.commentList;
                commentList[commentIndex].comment.status = 1;
                this.setData({commentList: commentList});
              } else {
                this.showZanTopTips(res.data.error);
              }
            },
            (res) => {
              console.log(res);
              this.showZanTopTips("评论删除失败");              
            },
            (res) => {
              wx.hideLoading();
            }
          );
        }
      }
    })
  },

  submitComment(e) {
    console.log(e);
    if (this.data.submitting)
      return;
    this.setData({
      submitting: true,
    });
    wx.showLoading({
      title: '请稍等...',
      mask: true,
    });
    getApp().callAPI(
      common.MODULE_PREFIX + "Comment",
      {
        itemId: this.data.list[0].item.id,
        replyTo: this.data.replyTo,
        comment: e.detail.value.comment,
        formId: e.detail.formId
      },
      (res) => {
        console.log(res);
        if (res.data.result) {
          this.setData({
            commentValue: "",            
          });
          wx.hideLoading();
          wx.showToast({
            title: '评论创建成功',
            icon: "success",
          });
          var commentList = this.data.commentList;
          var commentIdMap = this.data.commentIdMap;

          commentIdMap[res.data.comment.comment.id] = commentList.length;

          commentList.push(res.data.comment);
          this.setData({ commentList: commentList, commentIdMap: commentIdMap});
          this.toggleBottomPopup();          
        } else {
          wx.hideLoading();          
          wx.showModal({
            title: '错误',
            content: res.data.error,
            showCancel: false
          })
        }
      },
      (res) => {
        wx.hideLoading();
        wx.showModal({
          title: '错误',
          content: "网络错误，请联系管理员",
          showCancel: false
        })
      },
      (res) => {
        this.setData({
          submitting: false,
        });
      }
    );
  },
}));