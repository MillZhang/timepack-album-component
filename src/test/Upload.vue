<template>
  <div>
    <album-gallery :layout="layout" :photoList="photoList" :mode="mode" @load="handleLoad" @pageChange="handlePageChange" @delete="handleImageDelete" @upload="handleImageUploaded" @save="handleImageSave" @confirm="handleConfirm"></album-gallery>
  </div>
</template>
<script type="text/javascript">
//引入移动端自适应库
import AlbumGallery from 'components/gallery/album-gallery'
import Service from 'service'
import WxUtils from 'assets/js/WxUtils'
export default {
  data() {
    return {
      layout: this.cache.layout().getter(),
      photoList: this.cache.photoList().getter(),
      isAndroid: this.utils.browser().isAndroid(),
      mode: this.$route.query.mode,
      pageNum: 1,
      pageSize: 20
    }
  },
  components: {
    AlbumGallery
  },
  created() {
    this.fetchQiniuToken();
  },
  methods: {

    /**
     * 请求获取图片列表
     * @return {[type]} [description]
     */
    handleLoad() {
      Service.getImageList({
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        ticket: this.config.ticket
      }).then(result => {
        if (result.success) {
          this.$children[0].afterImageLoaded(result.currentPage, result.data);
        }
      });
    },

    /**
     * 获取七牛的uptoken
     * @return {[type]} [description]
     */
    fetchQiniuToken() {
      if (!this.isAndroid) { //非安卓初始化七牛控件
        Service.getQiniuToken().then(result => {
          if (result.success) {
            this.$children[0].afterTokenCreated(result.data)
          } else {
            this.toast('当前排队人数过多,请稍后再试')
          }
        });
      }
    },

    /**
     * 图片删除操作
     * @param  {[type]} ids        [description]
     * @param  {[type]} groupIndex [description]
     * @param  {[type]} imageIndex [description]
     * @return {[type]}            [description]
     */
    handleImageDelete(ids, groupIndex, imageIndex) {
      Service.deleteImage({
        ticket: this.config.ticket,
        ids: ids
      }).then(result => {
        if (result.success) {
          this.$children[0].afterImageDeleted(groupIndex, imageIndex)
        }
      });
    },

    /**
     * 安卓端图片上传
     * @return {[type]}      [description]
     */
    handleImageUploaded() {
      let that = this;
      WxUtils.wxChooseImage(data => {
        Service.uploadImage({
          ticket: that.config.ticket,
          localId: data.localId,
          mediaId: data.mediaId
        }).then(result => {
          if (result.success) {
            let imageItem = result.data;
            imageItem.url = that.utils.constant.DOMAIN + imageItem.key + '?imageView2/1/w/300/h/300/q/100';
            that.$children[0].afterImageSaved(imageItem)
          }
        });
      });

    },

    /**
     * 图片保存
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    handleImageSave(data) {
      if (data.width == 0 || data.height == 0) return;
      Service.saveImage({
        ticket: this.config.ticket,
        width: data.width,
        height: data.height,
        url: data.key,
        degree: data.degree
      }).then(result => {
        if (result.success) {
          let imageItem = result.data;
          imageItem.url = this.utils.constant.DOMAIN + imageItem.key + '?imageView2/1/w/300/h/300/q/100';
          this.$children[0].afterImageSaved(imageItem)
        }
      });
    },

    handleConfirm(data) {
      this.cache.photoList().setter(data);
      this.$router.push('/test/global');
    },

    /**
     * 页数变化
     * @return {[type]} [description]
     */
    handlePageChange() {
      this.pageNum++;
    }
  },
  mounted() {}
}

</script>
