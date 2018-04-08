var MODULE_PREFIX = "/Module/LostAndFound/";

function getItem(params, onSuccess, onError, onComplete) {
  wx.showLoading({
    title: '数据加载中',
  });

  getApp().callAPI(
    "/Module/LostAndFound/List",
    params,
    (e) => {
      if (e.data.result) {
        onSuccess(e.data);
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
}

function closeItem(itemId, onSuccess, onError, onComplete) {
  wx.showModal({
    title: '请确认',
    content: '启事关闭后，将不会再展示给其TA人，此操作无法撤销，确认关闭？',
    success: (res) => {
      if (res.confirm) {
        wx.showLoading({
          title: '请稍等',
          mask: true,
        });
        getApp().callAPI("/Module/LostAndFound/CloseItem?itemId=" + itemId, {}, 
        (e) => {
          if (e.data.result) {
            onSuccess(e.data);
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
        },
        );
      }
    },
  })
}

function getComment(itemId, onSuccess, onError, onComplete) {
  wx.showLoading({
    title: '数据加载中',
  });

  getApp().callAPI(
    "/Module/LostAndFound/ListComment?itemId=" + itemId,
    {},
    (e) => {
      if (e.data.result) {
        onSuccess(e.data);
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
}

function itemProcessor(item, imageURLPrefix)
{
  var urls = this.createImageURLList(item, imageURLPrefix);
  var keywords = item.item.keywords.split(" ");
  item.urls = urls;
  item.keywords = keywords;

  return item;
}

function createImageURLList(item, imageURLPrefix) {
  console.log(imageURLPrefix);
  var urls = [];
  for (var i in item.images) {
    urls[i] = imageURLPrefix + item.images[i].relativePath;
  }

  return urls;
}

module.exports.MODULE_PREFIX = MODULE_PREFIX;
module.exports.getItem = getItem;
module.exports.closeItem = closeItem;
module.exports.getComment = getComment;
module.exports.createImageURLList = createImageURLList;
module.exports.itemProcessor = itemProcessor;