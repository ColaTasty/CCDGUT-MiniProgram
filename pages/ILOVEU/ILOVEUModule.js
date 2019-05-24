
const APP = getApp();

/**
 * @description 获取消息元素
 */
var getMessageItem = function () {
    return {
        "mid": 0,
        "content": "",
        "like": 0,
        "share": 0,
        "time": "2019-01-01 00:00:00",
        "flag": 2,// 0 : 热门推荐, 1 : 随机推荐, 2 : 普通
        "is_like": false,
        "is_share": false,
        "loading_like": false,
        "loading_share": false,
    };
}

/**
 * @description 获取默认的消息数组
 * @param {integer} length 
 */
var getMessageItemArray = function (length) {
    var t = [];
    for (var i = 0; i < length; i++) {
        t.push(getMessageItem());
    }
    return t;
}

/**
 * @description 获取测试用的消息数组
 * @param {integer} length 
 */
var getTestMessageItemArray = function (length) {
    var t = getMessageItemArray(length);
    for (var i = 0; i < length; i++) {
        t[i]["mid"] = i;
        t[i]["content"] = "第一段\n第二段\n第三段\n123456789.123456789.123456789.123456789.123456789.123456789.\n测试测试测试测试测试测试\n\n\n\n\n";
        t[i]["like"] = parseInt(i + 95);
        t[i]["share"] = parseInt(i + 95);
        t[i]["time"] = "2019-01-01 00:00:00";
        t[i]["flag"] = i % 3;
        t[i]["is_like"] = i % 2 == 0;
        t[i]["is_share"] = i % 2 != 0;
    }
    return t;
}

/**
 * 
 * @param {String} value 
 * @param {function} onSuccess 
 * @param {function} onFail 
 */
var setMessageContent = function (value, onSuccess, onFail = null) {
    wx.setStorage({
        key: "ILOVEU_write_content",
        data: value,
        success: onSuccess,
        fail: onFail == null ? (e) => { console.log(e) } : onFail
    })
}


/**
 * 
 * @param {function} onSuccess 
 * @param {function} onFail 
 */
var getMessageContent = function (onSuccess, onFail = null) {
    wx.getStorage({
        key: "ILOVEU_write_content",
        success: onSuccess,
        fail: onFail == null ? (e) => { console.log(e) } : onFail
    })
}

var sendMessageContent = function (data, onSuccess, onFail = null) {
    var ssid = wx.getStorageSync("sessionID");
    data["ssid"] = ssid;
    APP.requestTo(
        "/wxapp/iloveu/sending",
        data,
        null,
        onSuccess,
        onFail == null ? null : onFail
    )
}

var likeMessage = function (data, onSuccess, onFail = null) {
    var ssid = wx.getStorageSync("sessionID");
    data["ssid"] = ssid;
    APP.requestTo(
        "/wxapp/iloveu/like",
        data,
        null,
        onSuccess,
        onFail == null ? null : onFail
    )
}

var unlikeMessage = function (data, onSuccess, onFail = null) {
    var ssid = wx.getStorageSync("sessionID");
    data["ssid"] = ssid;
    APP.requestTo(
        "/wxapp/iloveu/unlike",
        data,
        null,
        onSuccess,
        onFail == null ? null : onFail
    )
}

var shareMessage = function (data, onSuccess, onFail = null) {
    var ssid = wx.getStorageSync("sessionID");
    data["ssid"] = ssid;
    APP.requestTo(
        "/wxapp/iloveu/share",
        data,
        null,
        onSuccess,
        onFail == null ? null : onFail
    )
}

/**
 * 
 * @param {object} messages 
 * @param {Function} onSuccess 
 * @param {Function} onFail 
 */
var setMessagesToStorage = function (messages, onSuccess, onFail = null) {
    wx.setStorage({
        key: "ILOVEU_messages",
        data: messages,
        success: onSuccess,
        fail: onFail == null ? null : onFail
    })
}

/**
 * 
 * @param {Function} onSuccess 
 * @param {Function} onFail 
 */
var getMessagesFromStorage = function (onSuccess, onFail = null) {
    wx.getStorage({
        key: "ILOVEU_messages",
        success: onSuccess,
        fail: onFail == null ? null : onFail
    })
}

/**
 * 
 * @param {object} messages 
 * @param {Function} onSuccess 
 * @param {Function} onFail 
 */
var setMyMessagesToStorage = function (messages, onSuccess, onFail = null) {
    wx.setStorage({
        key: "ILOVEU_myMessages",
        data: messages,
        success: onSuccess,
        fail: onFail == null ? null : onFail
    })
}

/**
 * 
 * @param {Function} onSuccess 
 * @param {Function} onFail 
 */
var getMyMessagesFromStorage = function (onSuccess, onFail = null) {
    wx.getStorage({
        key: "ILOVEU_myMessages",
        success: onSuccess,
        fail: onFail == null ? null : onFail
    })
}

/**
 * 
 * @param {Object} data 
 * @param {Function} onSuccess 
 * @param {Function} onFail 
 */
var getSpecificMessage = function (data, onSuccess, onFail = null) {
    var ssid = wx.getStorageSync("sessionID");
    data["ssid"] = ssid;
    APP.requestTo(
        "/wxapp/iloveu/show",
        data,
        null,
        onSuccess,
        onFail == null ? null : onFail
    )
}

/**
 * 
 * @param {Object} data = { hasCount } 
 * @param {Function} onSuccess 
 * @param {Function} onFail 
 */
var getMyMessages = function (data, onSuccess, onFail = null) {
    var ssid = wx.getStorageSync("sessionID");
    data["ssid"] = ssid;
    data["myself"] = 1;
    APP.requestTo(
        "/wxapp/iloveu/show",
        data,
        null,
        onSuccess,
        onFail == null ? null : onFail
    )
}

/**
 * 
 * @param {Object} data = { hasCount }
 * @param {Function} onSuccess 
 * @param {Function} onFail 
 */
var getMessages = function (data, onSuccess, onFail = null) {
    var ssid = wx.getStorageSync("sessionID");
    data["ssid"] = ssid;
    APP.requestTo(
        "/wxapp/iloveu/show",
        data,
        null,
        onSuccess,
        onFail == null ? null : onFail
    )
}

/**
 * 
 * @param {Object} data = { mid }
 * @param {Function} onSuccess 
 * @param {Function} onFail 
 */
var deleteMessages = function (data, onSuccess, onFail = null) {
    var ssid = wx.getStorageSync("sessionID");
    data["ssid"] = ssid;
    APP.requestTo(
        "/wxapp/iloveu/delete",
        data,
        null,
        onSuccess,
        onFail == null ? null : onFail
    )
}

/**
 * 
 * @param {Function} onSuccess 
 * @param {Function} onFail 
 */
var init = function (onSuccess, onFail = null) {
    APP.requestTo(
        "/wxapp/iloveu/init",
        {},
        null,
        onSuccess,
        onFail == null ? null : onFail
    )
}

/**
 * 
 */
var clearStorage = function () {
    wx.removeStorageSync("ILOVEU_messages");
    wx.removeStorageSync("ILOVEU_write_content");
    wx.removeStorageSync("ILOVEU_myMessages");
}

module.exports = {
    getMessageItem: getMessageItem,
    getMessageItemArray: getMessageItemArray,
    getTestMessageItemArray: getTestMessageItemArray,
    setMessageContent: setMessageContent,
    getMessageContent: getMessageContent,
    sendMessageContent: sendMessageContent,
    likeMessage: likeMessage,
    unlikeMessage: unlikeMessage,
    shareMessage: shareMessage,
    setMessagesToStorage: setMessagesToStorage,
    getMessagesFromStorage: getMessagesFromStorage,
    getSpecificMessage: getSpecificMessage,
    getMyMessages: getMyMessages,
    getMessages: getMessages,
    deleteMessages: deleteMessages,
    init: init,
    clearStorage: clearStorage,
    setMyMessagesToStorage: setMyMessagesToStorage,
    getMyMessagesFromStorage: getMyMessagesFromStorage
}