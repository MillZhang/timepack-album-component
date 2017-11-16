import Service from 'service'
import Cache from './Cache.js'
export default {
  init() {
    Service.wxConfig({
      ticket: Cache.ticket().getter(),
      url: location.href.split('#')[0]
    }).then(result => {
      if (result.success) {
        this.weixinConfig(result.data);
      }
    });
  },

  weixinConfig(data) {
    wx.config({
      debug: false,
      appId: data.appId,
      timestamp: data.timestamp,
      nonceStr: data.nonceStr,
      signature: data.signature,
      jsApiList: [
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
        'showOptionMenu',
        'hideOptionMenu',
        'showMenuItems',
        'hideMenuItems',
        'chooseImage',
        'previewImage',
        'uploadImage',
        'chooseWXPay'
      ]
    });
  },

  wxHideMenu() {
    wx.hideOptionMenu();
  },

  wxShowMenu() {
    wx.ready(function() {
      // wx.showOptionMenu();
      wx.showMenuItems({
        menuList: ['menuItem:share:appMessage', 'menuItem:share:timeline']
      });
    });
  },

  wxShare(data) {
    wx.ready(function() {
      wx.onMenuShareAppMessage({
        title: data.title,
        desc: data.desc,
        link: data.link,
        imgUrl: data.image,
        type: 'link',
        success: function() {
          data.success();
        },
        cancel: function() {
          data.cancel();
        }
      });

      wx.onMenuShareTimeline({
        title: data.title,
        link: data.link,
        imgUrl: data.image,
        success: function() {
          data.success();
        },
        cancel: function() {
          data.cancel();
        }
      });
    });
  },

  wxChooseImage(callback) {
    let that = this;
    wx.ready(function() {
      wx.chooseImage({
        count: 9, // 默认9
        sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album'],
        success: function(res) {
          that.wxUploadImage(res.localIds, callback);
        },
        cancel: function() {},
        fail: function(res) {
          // Toast("chooseImage error!");
        }
      });
    });
  },

  wxUploadImage(localImagesIds, callback) {
    let _self = this;
    if (localImagesIds.length === 0) {
      return;
    }
    wx.uploadImage({
      localId: localImagesIds[0],
      isShowProgressTips: 1,
      success: function(res) {
        let obj = {};
        obj.localId = localImagesIds[0];
        obj.mediaId = res.serverId;
        localImagesIds.shift();
        //先上传服务端,使用七牛的key值显示图片,图片带有角度
        callback(obj);
        _self.wxUploadImage(localImagesIds, callback);
      },
      fail: function(res) {
        //一张上传微信服务器失败,则跳过直接上传下一张
        localImagesIds.shift();
        _self.wxUploadImage(localImagesIds, callback);
      }
    });
  },

  wxPay(data, backUrl) {
    Service.wxPay(data, result => {
      if (result.status == 1) {
        let payData = JSON.parse(result.payData);
        callWeixinPay(payData);
      }
    });

    function callWeixinPay(payData) {
      if (typeof WeixinJSBridge == "undefined") {
        if (document.addEventListener) {
          document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
        } else if (document.attachEvent) {
          document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
          document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
        }
      } else {
        onBridgeReady(payData);
      }
    }

    function onBridgeReady(payData) {
      WeixinJSBridge.invoke('getBrandWCPayRequest', {
        "appId": payData.appId,
        "timeStamp": payData.timeStamp,
        "nonceStr": payData.nonceStr,
        "package": payData.package,
        "signType": payData.signType,
        "paySign": payData.paySign
      }, function(res) {
        if (res.err_msg == "get_brand_wcpay_request:ok") {
          location.href = backUrl
        } else if (res.err_msg == "get_brand_wcpay_request:cancel") {}
      });
    }
  }
}
