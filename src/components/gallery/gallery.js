/**
 * 相簿图库组件js
 * @authors Mill (876753183@qq.com)
 * @date    2017-11-15 16:39:41
 * @version 0.0.1
 */
import Vue from 'vue'
import axios from 'axios'
import VueLazyLoad from 'vue-lazyload'
import {
  Toast,
  MessageBox,
  InfiniteScroll
} from 'mint-ui';

import '../../tools/qiniu/index.js'
import Canvas from '../../tools/canvas/index.js'
import timepackUtil from '../../tools/util/index.js'
import insertSrc from '../../assets/images/icon-inert.png';

Vue.use(InfiniteScroll);
Vue.use(VueLazyLoad, {
  loading: insertSrc,
  try: 6
});
export default {
  name: '',
  data() {
    return {
      selectCount: 0,
      restCount: 0,
      isUploading: false,
      progressMessage: '',
      deleteStatus: false,
      selectAllStatus: false,
      loading: false,
      loadingOver: false,
      thumbWidth: (window.innerWidth * 0.78 * 0.32).toFixed(0),
      currentList: [], //当天图片
      imageList: [],
      Files: [], //待上传图片组
      selectedImageList: []
    }
  },
  props: {
    layout: {
      default: [],
      required: true,
      type: Array
    },
    photoList: {
      default: [],
      required: true,
      type: Array
    },
    mode: {
      required: true,
      type: String
    }
  },
  created() {
    this.init();
  },
  computed: {

  },
  methods: {
    /**
     * 初始化数据结构
     * @return {[type]} [description]
     */
    init() {
      Canvas.render(this.photoList, this.layout);
      this.restCount = Canvas.getter().rest();
      this.syncSelectedImageList();
    },

    /**
     * 滚动懒加载
     * @return {[type]} [description]
     */
    loadMore() {
      if (this.loading) return;
      if (this.loadingOver) return;
      let that = this;
      this.loading = true;
      this.$emit('load')
    },

    /**
     * 标记已选图片
     * @param  {[type]}  key [description]
     * @return {Boolean}     [description]
     */
    hasSelected(key) {
      return this.selectedImageList.indexOf(key) > -1 ? 'Y' : 'N';
    },
    /**
     * 懒加载显示图片
     * @param {[type]} key [description]
     */
    setImageUrl(key) {
      return this.utils.constant.DOMAIN + key + '?imageView2/1/w/300/h/300/q/100';
    },

    /**
     * 安卓端点击选择图片
     * @return {[type]} [description]
     */
    chooseImage() {
      this.$emit('upload')
    },

    /**
     * 分组全选
     * @return {[type]} [description]
     */
    handleGroupSelect(e) {
      e.preventDefault();
      let $target = $(e.target);
      $target.toggleClass('checked');
      let $parent = $target.parents('.uploader');
      if (!$target.hasClass('checked')) {
        $parent.find('.selected').removeClass('selected');
        this.syncDocTitle();
        return;
      }
      let hasSelectedLength = this.selectCount;
      const restCount = this.restCount;
      $parent.find('.imageItem').each(function(index) {
        let total = hasSelectedLength + index + 1;
        if (total <= restCount) {
          $(this).addClass('selected')
        }
      });
      this.syncDocTitle();
    },

    /**
     * 图片删除或选择事件
     * @param  {[type]} event      [description]
     * @param  {[type]} imageId    [description]
     * @param  {[type]} groupIndex [description]
     * @param  {[type]} imageIndex [description]
     * @return {[type]}            [description]
     */
    handleImageOperate(event, imageId, groupIndex, imageIndex) {
      let target = event.currentTarget,
        status,
        that = this;
      if (!this.deleteStatus) {
        status = target.getAttribute('data-selected');
        toggleClass(target, 'selected');
        if (document.querySelectorAll('.selected').length > this.restCount) {
          this.toast('不能再选啦!');
          removeClass(target, 'selected');
          removeClass(target.parentNode, 'selected');
          return;
        }
        this.syncDocTitle();
      } else {
        this.$emit('delete', [imageId], groupIndex, imageIndex)
      }
    },

    /**
     * 处理全选事件
     * @return {[type]} [description]
     */
    handleSelectAll() {
      if (this.deleteStatus) return;
      const restCount = this.restCount;
      let $selectedList = document.querySelectorAll('.selected'),
        $imageObjectList = document.querySelectorAll('.imageItem');
      if (this.selectAllStatus) {
        $selectedList.forEach(function(item) {
          item.classList.remove('selected');
        });
        this.selectAllStatus = false;
      } else {
        $imageObjectList.forEach(function(item, index) {
          if (index <= restCount - 1) {
            item.classList.add('selected');
          }
        })
        this.selectAllStatus = true;
      }
      this.syncDocTitle();
    },


    handleConfirm(e) {
      e.preventDefault();
      console.log(2)
      if (this.deleteStatus) return;
      let selectedImageLength = $('.selected').length;
      if (selectedImageLength == 0) {
        this.toast('请至少选择一张图片');
        return;
      } else if (selectedImageLength > this.restCount) {
        this.toast('选多啦');
        return;
      } else {
        let $list = $('.selected');
        let page = Number(this.$route.query.page),
          index = Number(this.$route.query.index);
        if (this.mode == 'group') {
          Canvas.fillImageByGroup($list);
          this.$emit('confirm', Canvas.photo);
          return;
        }
      }
    },

    /**
     * 同步顶部标题栏
     * @return {[type]} [description]
     */
    syncDocTitle() {
      this.selectCount = document.querySelectorAll('.selected').length;
    },

    /**
     * 同步已选择的图片数据
     * @return {[type]} [description]
     */
    syncSelectedImageList() {
      let photoList = Canvas.photo;
      for (let i = 0; i < photoList.length; i++) {
        let item = photoList[i],
          list = item.list;
        if (undefined == list) continue;
        for (let j = 0; j < list.length; j++) {
          if ('' != list[j].key) {
            this.selectedImageList.push(list[j].key);
          }
        }
      }
    },

    /**
     * 七牛token获取完成后调用
     * @param  {[type]} token [description]
     * @return {[type]}       [description]
     */
    afterTokenCreated(token) {
      let that = this;
      timepackUtil.fileUploader({
        buttonId: 'uploaderButton',
        uptoken: token,
        size: '100mb'
      }, {
        added(up, files) {
          if (up.files.length > 50) { //最多选择50张
            up.splice(50, 999);
          }
          that.Files = files;
          that.isUploading = true;
        },
        progress(up, file) {
          let index = 0;
          for (let i = 0; i < that.Files.length; i++) {
            if (file === that.Files[i]) {
              index = (i + 1);
              break;
            }
          }
          that.progressMessage = '正在上传第' + index + '张图片' + file.percent + '%';
        },
        complete() {
          that.isUploading = false;
          that.progressMessage = '';
        },
        uploaded(key) {
          getImageInfo(key).then(result => {
            result.key = key;
            that.$emit('save', result);
          })
        },
        error(up, error, errTip) {
          that.isUploading = false;
          that.progressMessage = '';
          let errorText = '';
          if (error.code == '-601') {
            errorText = '请上传图片类型!'
          }
          MessageBox({
            title: '',
            message: errorText == '' ? errTip : errorText
          })
        }
      })

    },

    /**
     * 图片懒加载完成后进行数据处理
     * @param  {[type]} page [description]
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    afterImageLoaded(page, data) {
      if (data.length == 0) {
        this.loadingOver = true;
        return;
      }
      let group, lastIndex = this.imageList.length - 1;
      if (this.imageList.length > 0) {
        group = this.imageList[lastIndex].group;
      }
      for (let i = 0; i < data.length; i++) {
        let item = data[i];
        //最后一项尚未加载完成
        if (undefined != group && item.group == group) {

          for (let j = 0; j < item.items.length; j++) {
            this.imageList[lastIndex].items.push(item.items[j]);
          }
        } else {
          this.imageList.push(item);
        }
      }
      if (page == 1) {
        //第一页初始化当天的图片列表
        this.currentList = this.imageList[0];
      }
      this.loading = false;
      this.$emit('pageChange');
    },

    /**
     * 图片删除请求完成后执行删除DOM操作
     * @param  {[type]} groupIndex [description]
     * @param  {[type]} imageIndex [description]
     * @return {[type]}            [description]
     */
    afterImageDeleted(groupIndex, imageIndex) {
      this.imageList[groupIndex].items.splice(imageIndex, 1);
      Toast('删除成功!');
    },

    /**
     * 图片保存完成后调用
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    afterImageSaved(data) {
      this.currentList.items.unshift(data);
    }
  }
}

function toggleClass(obj, className) {
  if (hasClass(obj, className)) {
    removeClass(obj, className);
  } else {
    addClass(obj, className);
  }
}

function removeClass(obj, className) {
  obj.classList.remove(className);
}

function addClass(obj, className) {
  obj.classList.add(className);
}

function hasClass(obj, className) {
  return obj.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
}


const getImageInfo = (key) => {
  return axios.get(`${timepackUtil.constant.DOMAIN}${key}?imageInfo`).then(response => {
    return response.data;
  })
}
