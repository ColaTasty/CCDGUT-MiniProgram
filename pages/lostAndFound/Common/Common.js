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
};

module.exports.MODULE_PREFIX = MODULE_PREFIX;
module.exports.getItem = getItem;