var getCategories = function() {
    return [{
        name: "全部",
        selected: false
    }, {
        name: "闲置课本",
        selected: false
    }, {
        name: "图书",
        selected: false
    }, {
        name: "日常用品",
        selected: false
    }, {
        name: "服饰",
        selected: false
    }, {
        name: "手机",
        selected: false
    }, {
        name: "数码",
        selected: false
    }, {
        name: "其他",
        selected: false
    }]
}

/**
 * 
 * @param {number} click_idx 选择的索引号
 * @returns {Array}
 */
var selectCategory = function(click_idx) {
    var list = getCategories();
    list[click_idx]["selected"] = true;
    return list;
}

/**
 * @returns {void}
 */
var getMessagesItem = function() {
    return {
        mid: 0,
        title: "商品名",
        content: {
            text: "商品描述",
            imagesPath: [],
            originalPrice: 0,
            price: 0,
            discount: 0.0,
            residue: 1
        },
        seller: {
            name: "卖家称呼",
            id: "卖家ID",
            avatar: "卖家头像路径"
        },
        time: 0,
        like: 0,
        view: 0,
        is_like: false
    }
}

/**
 * 
 * @param {int} len 长度
 * @returns {Array}
 */
var getTestMessagesList = function(len) {
    var callback = [];
    for (var i = 0; i < len; i++) {
        callback.push(getMessagesItem());
        callback[i]["mid"] = i + 1;
        callback[i]["content"]["originalPrice"] = 100;
        callback[i]["content"]["discount"] = parseFloat(i > 2 ? 2 / i : i / 2);
        callback[i]["content"]["price"] = calculatePrice(callback[i]["content"]["originalPrice"], callback[i]["content"]["discount"]);
        // callback[i]["content"]["price"] = (callback[i]["content"]["originalPrice"] * callback[i]["content"]["discount"]).toString().substring();
        // callback[i]["seller"]["avatar"] = "https://wx.qlogo.cn/mmopen/vi_32/ETwepwYzUV7N52suDamgrMmJibscXUnRRgc0C61dGicsN1pelmK3aAS69bEGRKupTicwPYFLiaRibyn8jrkcUWvMh9A/132";
        callback[i]["time"] = i % 2 == 0 ? (new Date()).getTime() : 1558333980;
        callback[i]["like"] = 100 - i;
        callback[i]["is_like"] = i % 2 == 0;
    }
    return callback;
}

/**
 * 
 * @param {number} orgP 
 * @param {number} dis 
 */
var calculatePrice = function(orgP, dis) {
    var price = orgP * dis;
    var str = price.toString();
    str = str.substring(0, str.indexOf(".") + 3);
    return parseFloat(str);
}

module.exports = {
    getCategories: getCategories,
    selectCategory: selectCategory,
    getMessagesItem: getMessagesItem,
    getTestMessagesList: getTestMessagesList
}