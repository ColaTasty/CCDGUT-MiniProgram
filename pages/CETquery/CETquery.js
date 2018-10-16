// pages/CETquery/CETquery.js
const Dialog = require('../../zanui-components/dialog/dialog');
const app = getApp();
var dd = { "sn": "2018年上半年全国大学英语四、六级考试（含口试）", "subn": "仅限查询2018年上半年考试成绩。", "qt": "2018/08/22 09:00:00", "rdsub": [{ "code": "CET6-D", "tab": "CET6_181_DANGCI", "name": "全国大学英语六级考试(CET6)", "en": "2018年06月全国大学英语六级考试(CET6)" }, { "code": "CRT6-D", "tab": "CRT6_181_DANGCI", "name": "全国大学俄语六级考试(CRT6)", "en": "2018年06月全国大学俄语六级考试(CRT6)" }, { "code": "PHS6-D", "tab": "PHS6_181_DANGCI", "name": "全国大学德语六级考试(PHS6)", "en": "2018年06月全国大学德语六级考试(PHS6)" }, { "code": "TFU4-D", "tab": "TFU4_181_DANGCI", "name": "全国大学法语四级考试(TFU4)", "en": "2018年06月全国大学法语四级考试(TFU4)" }, { "code": "CJT4-D", "tab": "CJT4_181_DANGCI", "name": "全国大学日语四级考试(CJT4)", "en": "2018年06月全国大学日语四级考试(CJT4)" }, { "code": "PHS4-D", "tab": "PHS4_181_DANGCI", "name": "全国大学德语四级考试(PHS4)", "en": "2018年06月全国大学德语四级考试(PHS4)" }, { "code": "CET4-D", "tab": "CET4_181_DANGCI", "name": "全国大学英语四级考试(CET4)", "en": "2018年06月全国大学英语四级考试(CET4)" }, { "code": "CJT6-D", "tab": "CJT6_181_DANGCI", "name": "全国大学日语六级考试(CJT6)", "en": "2018年06月全国大学日语六级考试(CJT6)" }, { "code": "CRT4-D", "tab": "CRT4_181_DANGCI", "name": "全国大学俄语四级考试(CRT4)", "en": "2018年06月全国大学俄语四级考试(CRT4)" }] };

Page({

  /**
   * 页面的初始数据
   */
  data: {
    class_v: 0, //验证码在页面的位置,
    isLoading_v:false,
    canSubmit:false,
    isLoading_submit:false,
    val_i:null,
    val_name:null,
    val_v:null,
    err_i:false,
    err_name:false,
    err_v:false,
    src_v:null,//验证码的url地址
    showVerify:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    /* 修改验证码的位置 */
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          class_v: (res.screenWidth - 120) / 2,
        });
      },
    });
  },

  bindchange_getZkz:function(e){
    this.setData({
      val_i : e.detail.value,
      err_i : false
    })
    if (e.detail.value == "")
      this.setData({
        val_i: null
      });
    this.checkInfo();
  },

  bindchange_getName: function (e) {
    this.setData({
      val_n : e.detail.value,
      err_n : false
    })
    if (e.detail.value == "")
      this.setData({
        val_n: null
      })
    this.checkInfo();
  },

  bindchange_getVerify: function (e) {
    this.setData({
      val_v : e.detail.value,
      err_v : false
    })
    if (e.detail.value == "")
      this.setData({
        val_v: null
      })
    this.checkInfo();
  },

  checkInfo:function(){
    var d = this.data;
    if(d.val_i != null && d.val_i.length == 15 && d.val_n != null && d.val_v != null)
      this.setData({
        canSubmit : true
      });
    else
      this.setData({
        canSubmit: false
      });
  },

  bindtap_getVerify:function(){
    var that = this;
    if (that.data.val_i == null || that.data.val_i.length != 15){
      Dialog({
        title:"请输入准考证号",
        message: '输入15位准考证号后才能获取验证码',
        selector: '#verify-can-not-get'
      });
      that.setData({
        showVerify: false,
        err_i:true
      })
    }else{
      that.setData({
        isLoading_v:true
      })
      app.requestTo(
        "/wxapp/cet/verify",
        {
          i : that.data.val_i
        },
        null,
        function(res){
          if(res.data.isOK)
            that.setData({
              showVerify:true,
              src_v:res.data.request_url
            });
          else
            Dialog({
              title: "请输入准考证号",
              message: res.data.msg,
              selector: '#verify-can-not-get'
            });
        },
        null,
        function(){
          that.setData({
            isLoading_v: false
          })
        }
      );
    }
  },
  /*
  checkI:function(z){
    var index = -1;
    var t = z[0];
    if (t == "F") {
      index = 1;
    } else if (t == "S") {
      index = 2;
    } else {

    }
  }
  */
})