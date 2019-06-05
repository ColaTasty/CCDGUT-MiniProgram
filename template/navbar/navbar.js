// template/navbar/navbar.js
const APP = getApp();
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        bgColor: {
            type: String,
            value: "#fff"
        },
        back: {
            type: Boolean,
            value: true
        },
        home: {
            type: Boolean,
            value: false
        },
        title: {
            type: String,
            value: "标题栏长度不超十个字"
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        nav_style: {
            height: null,
            menu: {
                width: null,
                height: null,
                top: null,
                left: null
            }
        }
    },

    /**
     * 组件的方法列表
     */
    methods: {
        _bindtap_back: function(e) {
            var _this = this;
            var pages = getCurrentPages();
            if (pages.length < 2) {
                _this._bindtap_home({});
                return;
            }
            wx.navigateBack({
                detail: 1
            })
        },
        _bindtap_home: function(e) {
            var _this = this;
            wx.reLaunch({
                url: _this.data.indexPath,
            })
        }
    },

    lifetimes: {
        attached: function(e) {
            var _this = this;
            // 定义menu外观
            var menu = wx.getMenuButtonBoundingClientRect();
            // 定义index路径
            var indexPath = "./";
            var pageStack = getCurrentPages();
            var currentPagePath = pageStack[pageStack.length - 1].route;
            var splitPath = currentPagePath.split("/");
            for (var i = 0; i < splitPath.length - 2; i++) {
                indexPath += "../";
            }
            indexPath += "index/index";
            _this.setData({
                // 定义menu外观
                nav_style: {
                    height: menu.top + menu.height + APP.systemInfo.screenWidth - menu.right,
                    menu: {
                        width: menu.width,
                        height: menu.height,
                        top: menu.top,
                        left: APP.systemInfo.screenWidth - menu.right
                    }
                },
                // 定义index路径
                indexPath: indexPath
            });
            // console.log(indexPath);
            // console.log(getCurrentPages());
            // console.log(_this.data.nav_style);
            // console.log(_this.data.nav_style.height);
        }
    }
})