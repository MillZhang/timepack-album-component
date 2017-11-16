/**
 * === Javascript Module ======================
 * Copyright (c) 2016 Mill, All rights reserved.
 *
 * @version 1.0
 * @author Mill
 * @description
 * ---2017/3/6----------------------------------
 */
export default {
  getConstant() {
    return {
      DOMAIN: 'https://images.cache.timepack.cn/',
      TEMPLATE_DOMAIN: 'http://template.cache.timepack.cn/',
      THUMB600: '?imageMogr2/thumbnail/600x600',
      AUTHOR: location.origin + '/synergy/wxbridge/index?appid=',
      EditorWidth: window.innerWidth * 0.8
    }
  },
  getQueryByName(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    let r = window.location.search.substr(1).match(reg);
    if (null !== r) return unescape(r[2]);
    return null;
  },
  formateDate(date, fmt) {
    let o = {
      "M+": date.getMonth() + 1, //月份
      "d+": date.getDate(), //日
      "h+": date.getHours(), //小时
      "m+": date.getMinutes(), //分
      "s+": date.getSeconds(), //秒
      "q+": Math.floor((date.getMonth() + 3) / 3), //季度
      "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  },
  isTelephone(str) {
    if (/^1[3|4|5|7|8]\d{9}$/.test(str)) {
      return true;
    }
    return false;
  },
  isEmpty(str) {
    if ('' == str || undefined == str) {
      return true;
    }
    return false;
  },
  isAndroid() {
    let u = navigator.userAgent;
    let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器
    let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isAndroid) {
      return true;
    } else if (isiOS) {
      return false;
    }
  },
  wxScrollSolve(selector) {
    let scrollWrapObj = document.querySelector(selector)
    if (scrollWrapObj == "" || scrollWrapObj == undefined || scrollWrapObj == null) {
      return
    }
    var overscroll = function(el) {
      el.addEventListener('touchstart', function() {
        var top = el.scrollTop,
          totalScroll = el.scrollHeight,
          currentScroll = top + el.offsetHeight;
        if (top === 0) {
          el.scrollTop = 1;
        } else if (currentScroll === totalScroll) {
          el.scrollTop = top - 1;
        }
      });
      el.addEventListener('touchmove', function(evt) {
        if (el.offsetHeight < el.scrollHeight)
          evt._isScroller = true;
      })
    };
    overscroll(scrollWrapObj);
    document.body.addEventListener('touchmove', function(evt) {
      if (!evt._isScroller) {
        evt.preventDefault();
      }
    });
  },
  reload() {
    let refresh = localStorage.getItem('timepack-refresh-status');
    if (null == refresh) {
      localStorage.setItem('timepack-refresh-status', true);
      location.reload();
    } else {
      localStorage.removeItem('timepack-refresh-status')
    }
  },
  updateDocTitle(title) {
    document.title = title;
    let u = navigator.userAgent;
    let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isiOS) {
      let i = document.createElement('iframe');
      i.src = 'http://m.baidu.com/favicon.ico';
      i.style.display = 'none';
      i.onload = function() {
        setTimeout(function() {
          i.remove();
        }, 0);
      };
      document.body.appendChild(i);
    }
  },
  removeItem(arr, index) {
    Array.prototype.remove = function(val) {
      var index = this.indexOf(val);
      if (index > -1) {
        this.splice(index, 1);
      }
    };

    Array.prototype.indexOf = function(val) {
      for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
      }
      return -1;
    };

    arr.remove(arr[index]);
    return arr;
  },
  Authorize() {

  }
}
