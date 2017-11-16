<template id="designer">
  <div class="page">
    <div class="designer">
      <p class="tip">往下一步自动保存</p>
      <div class="button-group">
        <div class="item" style="padding-left: 0.133rem;">
          <mt-switch v-model="exchange" class="mint-switch-custom" @change="handleSwitchChange">
            <span class="f10" :class="{'disable':!exchange}">图间互换</span>
          </mt-switch>
        </div>
        <div class="item" @click="handleSingleRotate">
          <template v-if="!exchange">
            <img src="../../assets/images/icon/icon_xuanzhuan@2x.png" alt="" class="icon">
          </template>
          <template v-else>
            <img src="../../assets/images/icon/icon_xuanzhuan_n@2x.png" alt="" class="icon">
          </template>
          <span class="f10" :class="{'disable':exchange}">旋转</span>
        </div>
        <div class="item" @click="handleSingleChange">
          <template v-if="!exchange">
            <img src="../../assets/images/icon/icon_dantutihuan@2x.png" alt="" class="icon">
          </template>
          <template v-else>
            <img src="../../assets/images/icon/icon_dantutihuan_n@2x.png" alt="" class="icon">
          </template>
          <span class="f10" :class="{'disable':exchange}">单图更换</span>
        </div>
        <div class="item" @click="handleSingleDelete">
          <template v-if="!exchange">
            <img src="../../assets/images/icon/icon_del@2x.png" alt="" class="icon delete">
          </template>
          <template v-else>
            <img src="../../assets/images/icon/icon_del_n@2x.png" alt="" class="icon delete">
          </template>
          <span class="f10" :class="{'disable':exchange}">删除</span>
        </div>
      </div>
      <div class="block">
        <div class="edit" href="javascript:;" :style="{height:editorHeight+'px'}">
          <div class="pageDiv">
            <div class="tap" @touchstart="handleTapStart" @touchmove="handleTapMove" @touchend="handleTapEnd"></div>
            <div class="templateDiv" :style="templateStyle()"></div>
            <template v-for="(imageItem,imageIndex) in designPhoto.list">
              <div class="photoDiv" :style="photoItemStyle(imageIndex)">
                <img class="itemImage" :data-index="imageIndex" :data-zoom="imageItem.zoom" :class="{insertBtn:imageItem.key == '',changeBtn:imageItem.key!=''}" :src="photoItemImageSrc(imageIndex)" alt="" :style="photoItemImageStyle(imageIndex)" @touchstart="touchStartEvent" @touchmove="touchMoveEvent" @touchend="touchEndEvent">
                <div class="resize-button" v-if="imageItem.key!=''">
                  <a href="javascript:;" class="zoomBtn enlarge" @click="handleZoomEvent(1)">
                    <img src="../../assets/images/editor/icon_1@2x.png" alt="" class="disable">
                  </a>
                  <a href="javascript:;" class="zoomBtn narrow disable" @click="handleZoomEvent(0)">
                    <img src="../../assets/images/editor/icon_3@2x.png" alt="">
                  </a>
                </div>
              </div>
            </template>
          </div>
        </div>
        <a href="javascript:;" class="prev" :class="{hidden:page<=0}" @click="goPreviousEvent"></a>
        <a href="javascript:;" class="next" :class="{hidden:page>=(totalPage-1)}" @click="goNextEvent"></a>
      </div>
      <p class="pagination">
        {{layout.name}}/共{{totalPage}}页
      </p>
      <div class="p-state">
        <p class="f12">说明:</p>
        <p class="f12">1.点击上传照片可以旋转或者更换图片</p>
        <p class="f12">2.上传的照片请<span style="color: #ff4545;">上下左右移动</span>调整好照片的位置,确认人脸在相框最合适的位置,不在相框里面的照片将被裁切;</p>
        <p class="f12">3.点击相框左右两边箭头,可以进行翻页编辑。</p>
      </div>
    </div>
    <div class="footer">
      <template v-if="showTemp">
        <div class="t-layout" v-show="designLayout.length>0">
          <template v-for="(item,index) in designLayout">
            <img class="templateImage" v-lazy="item.pngImg+'?imageMogr2/thumbnail/600x600'" @click="changeTemplateLayout($event,index)">
          </template>
        </div>
      </template>
      <router-link href="javascript:;" class="saveAll f12" :to="{path:'/editor/global'}">全部保存</router-link>
    </div>
  </div>
</template>
<script type="text/javascript">
import Cache from 'jsPath/tool/Cache'
import canvas from 'jsPath/module/AlbumModel'
import Service from 'service/service'
import {
  Toast
} from 'mint-ui';
export default {
  name: "designer",
  data() {
    return {
      editorWidth: this.utils.getConstant().EditorWidth,
      editorHeight: this.utils.getConstant().EditorWidth * 600 / 500,
      page: 0,
      totalPage: Cache.photoList().getter().length,
      designPhoto: {},
      layout: {},
      selectedImageIndex: null,
      lastSelectedIndex: null,
      designLayout: [],
      showTemp: true,
      exchange: false,
      imgTarget: null
    }
  },
  created() {
    this.page = Number(this.$route.query.page);
    this.designPhoto = Cache.photoList().getter()[this.page];
    this.editorHeight = this.editorWidth / canvas.getImageRadio(this.page);
    this.fetchTemplateLayoutList();
  },
  methods: {
    fetchTemplateLayoutList() {
      if (null != Cache.templateLayout().getter()) return;
      Service.getTemplateLayoutList({
        tempId: Cache.template().getter(),
        ticket: this.config.ticket
      }, result => {
        if (result.success) {
          if (result.data.showContainers) {
            Cache.templateLayout().setter(result.data);
            this.getCurrentDesignLayout();
          } else {
            this.showTemp = false;
          }
        }
      });
    },

    getCurrentDesignLayout() {
      let list = Cache.templateLayout().getter();
      console.log(this.totalPage)
      if (null == list) return;
      if (this.page == 0) {
        //获取封面模板列表
        this.designLayout = list.coverTemp;
      } else if (this.page == 1) {
        //获取封底模板列表
        this.designLayout = list.backCoverTemp;
      } else if (this.page == 2 && list.typeId == 0) {
        //扉页模板列表--只有相簿具有扉页
        this.designLayout = list.fyTemp;
      } else if (this.page > 2 && this.page < (this.totalPage - 1) && list.typeId == 0) {
        //内页模板列表--相簿
        this.designLayout = list.contentTemp;
      } else if (this.page > 1 && this.page <= (this.totalPage - 1) && list.typeId == 1) {
        //内页模板列表--台历
        let singlePageLayout = list.contentTemp[this.page - 2];
        this.designLayout = undefined == singlePageLayout ? [] : singlePageLayout;
      } else if (this.page == (this.totalPage - 1)) {
        //扉底模板列表
        this.designLayout = list.fdTemp;
      }
    },

    templateStyle() {
      return 'background:url(' + canvas.getTemplateImage(this.page) + ') center no-repeat;';
    },
    photoItemStyle(index) {
      return canvas.setEitorPage(Cache.layout().getter(), Cache.photoList().getter(), this.page, index, this.editorWidth, true);
    },
    photoItemImageSrc(index) {
      return canvas.getPhotoItemImageUrl(this.page, index);
    },
    photoItemImageStyle(index) {
      return canvas.setPhotoItemImageStyle(this.page, index);
    },
    goPreviousEvent(event) {
      event.preventDefault();
      //先清当前页的缓存
      Cache.tempPhoto().remove();
      this.$toast(`已保存`);
      $('.templateImage').removeClass('selected');
      this.$router.replace('/editor/design?page=' + (this.page -= 1));
    },
    goNextEvent(event) {
      event.preventDefault();
      Cache.tempPhoto().remove();
      this.$toast(`已保存`);
      $('.templateImage').removeClass('selected');
      this.$router.replace('/editor/design?page=' + (this.page += 1));
    },
    handleSingleRotate() {
      if (!this.validateCurrentSelected()) return;
      this.designPhoto = canvas.rotateImage(this.page, this.selectedImageIndex);
    },
    handleSingleChange() {
      if (!this.validateCurrentSelected()) return;
      this.$router.replace('/editor/upload?mode=change&page=' + this.page + '&index=' + this.selectedImageIndex);
    },
    handleSingleDelete() {
      if (!this.validateCurrentSelected()) return;
      this.designPhoto = canvas.deleteImageByIndex(this.page, this.selectedImageIndex);
    },
    handleSwitchChange() {
      //每次切换,置空选择图片的下标值
      this.resetImageIndex();
      $('.img-opacity').removeClass(`img-opacity`);
    },

    /**
     * 处理放大或缩小操作
     * @return {[type]} [description]
     */
    handleZoomEvent(type) {
      let that = this;
      let style = canvas.zoomImage(this.page, this.selectedImageIndex, type);
      if (null === style) return;
      this.designPhoto = Cache.photoList().getter()[this.page];
      $('.itemImage').each(function(index) {
        if (index == that.selectedImageIndex) {
          $(this).css(style);
          return false;
        }
      });
    },

    changeTemplateLayout(e, index) {
      e.preventDefault();
      let $target = $(e.target);
      $('.templateImage').removeClass('selected');
      $target.addClass('selected');
      let layout = Cache.layout().getter();
      let name = layout[this.page].name;
      layout[this.page] = this.designLayout[index];
      layout[this.page].name = name;
      Cache.layout().setter(layout);
      this.designPhoto = canvas.updatePhotoContainer(this.page);
    },
    touchStartEvent(e) {
      e.preventDefault();
      let $target = $(e.target);
      if ($target.hasClass('insertBtn')) {
        this.$router.replace('/editor/upload?mode=single&page=' + this.page);
        return;
      } else {
        this.lastSelectedIndex = this.selectedImageIndex;
        this.selectedImageIndex = $target.attr('data-index');
        $('.resize-button').hide();
        $target.next().show().css({ display: 'flex' });
      }
      if (this.exchange) {
        $target.addClass(`img-opacity`);
        return;
      }
      let list = Cache.photoList().getter()[this.page].list;
      if (undefined == list) return;
      this.position = list[this.selectedImageIndex].location.position;
      this.startPosition = canvas.touchStart(e);
    },
    touchMoveEvent(e) {
      e.preventDefault();
      if (this.exchange) return;
      canvas.touchMove(e, this.startPosition, this.position);
    },
    touchEndEvent(e) {
      e.preventDefault();
      if (this.exchange) {
        if (null == this.lastSelectedIndex || null == this.selectedImageIndex || this.lastSelectedIndex == this.selectedImageIndex) {
          return;
        }
        this.designPhoto = canvas.exchangeImage(this.page, this.lastSelectedIndex, this.selectedImageIndex);
        //切换完成,置空图片下标
        this.resetImageIndex();
        $('.img-opacity').removeClass(`img-opacity`);
        return;
      }
      if (null != this.selectedImageIndex) {
        canvas.touchEnd(e, this.page, this.selectedImageIndex, this.position);
      }
      return true;
    },
    validateCurrentSelected() {
      if (this.exchange) {
        this.$toast(this.msg.CLOSE_EXCHANGE_BUTTON);
        return false;
      }
      if (null == this.selectedImageIndex) {
        this.$toast(this.msg.SELECT_IMAGE_FIRST);
        return false;
      }
      if (this.designPhoto.list[this.selectedImageIndex].key == '') {
        this.$toast(this.msg.SELECT_IMAGE_FIRST);
        return false;
      }
      return true;
    },
    resetImageIndex() {
      this.selectedImageIndex = null;
      this.lastSelectedIndex = null;
    },
    handleTapStart(e) {
      e.preventDefault();
      let $target = $(this.getCurrentDOM(e));
      //点击插入图片
      if ($target.hasClass('insertBtn')) {
        this.$router.replace('/editor/upload?mode=single&page=' + this.page);
        return;
      } else {
        this.lastSelectedIndex = this.selectedImageIndex;
        this.selectedImageIndex = $target.attr('data-index');
        $target.next().show().css({ display: 'flex' });
      }

      //点击更换图片位置
      if (this.exchange) {
        $('.resize-button').hide();
        $target.addClass(`img-opacity`);
        return;
      }

      //点击缩放区域
      if ($target.hasClass('zoomBtn')) {
        this.selectedImageIndex = $target.parent().prev().addClass('zoom').attr('data-index');
        this.handleZoomEvent($target.hasClass('enlarge') ? 1 : 0);
        return;
      }

      //点击模板空白区域
      if (null == $target || $target.length == 0) {
        $('.resize-button').hide();
        return;
      }

      let list = Cache.photoList().getter()[this.page].list;
      if (undefined == list || undefined == list[this.selectedImageIndex]) return;
      this.position = list[this.selectedImageIndex].location.position;
      this.startPosition = canvas.touchStart(e, this.imgTarget);;
    },
    handleTapMove(e) {
      if (this.exchange || null == this.imgTarget) return;
      canvas.touchMove(e, this.startPosition, this.position, this.imgTarget);
    },
    handleTapEnd(e) {
      e.preventDefault();
      if (this.exchange) {
        if (null == this.lastSelectedIndex || null == this.selectedImageIndex || this.lastSelectedIndex == this.selectedImageIndex) {
          return;
        }
        this.designPhoto = canvas.exchangeImage(this.page, this.lastSelectedIndex, this.selectedImageIndex);
        //切换完成,置空图片下标
        this.resetImageIndex();
        $('.img-opacity').removeClass(`img-opacity`);
        return;
      }
      if (null != this.selectedImageIndex && null != this.imgTarget) {
        canvas.touchEnd(e, this.page, this.selectedImageIndex, this.position, this.imgTarget);
      }
      return true;
    },

    getCurrentDOM(e) {
      var target = null,
        that = this;
      if (e.targetTouches.length === 1) {
        let touch = e.targetTouches[0];
        $('.photoDiv').each(function() {
          let $img = $(this).find('.itemImage'),
            image = $img[0],
            rect = this.getBoundingClientRect(),
            range = {
              minx: rect.left,
              maxx: rect.left + rect.width,
              miny: rect.top,
              maxy: rect.top + rect.height
            };

          let $zoomButton = $img.next();
          if ($zoomButton.length > 0) {
            let largeRect = $zoomButton.find('.enlarge')[0].getBoundingClientRect(),
              largeRange = {
                minx: largeRect.left,
                maxx: largeRect.left + largeRect.width,
                miny: largeRect.top,
                maxy: largeRect.top + largeRect.height
              },
              narrowRect = $zoomButton.find('.narrow')[0].getBoundingClientRect(),
              narrowRange = {
                minx: narrowRect.left,
                maxx: narrowRect.left + narrowRect.width,
                miny: narrowRect.top,
                maxy: narrowRect.top + narrowRect.height
              }
            if (that.edgeDetection(touch, largeRange)) {
              target = $zoomButton.find('.enlarge')[0];
              return false;
            }

            if (that.edgeDetection(touch, narrowRange)) {
              target = $zoomButton.find('.narrow')[0];
              return false;
            }
          }

          if (that.edgeDetection(touch, range)) {
            target = image;
            that.imgTarget = target;
            $('.resize-button').hide();
            $(target).removeClass('zoom')
            $(target).next().show().css({ display: 'flex' });
            return false;
          }
        });

      } else {}
      return target;
    },

    edgeDetection(touch, range) {
      if (touch.pageX >= range.minx && touch.pageX <= range.maxx && touch.pageY >= range.miny && touch.pageY <= range.maxy) {
        return true
      }
      return false;
    }
  },
  mounted() {
    this.$nextTick(function() {

    });
  },
  watch: {
    page: function() { //一旦page发生变化,实时的获取新的designPhoto
      this.designPhoto = Cache.photoList().getter()[this.page];
      this.layout = Cache.layout().getter()[this.page];
      this.exchange = false;
      this.editorHeight = this.editorWidth / canvas.getImageRadio(this.page);
      this.getCurrentDesignLayout();
    },
    designPhoto: function() {}
  }
}

</script>
<style scoped lang="scss">
.designer {
  width: 100%;
  overflow-y: auto;
  margin-top: 0.2rem;
  min-height: 15rem;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 2.8rem;
}

.designer .tip {
  text-align: center;
  position: absolute;
  width: 100%;
  top: 1%;
  display: none;
}

.designer .block {
  width: 80%;
  margin: 1.2rem auto 0.5rem;
  position: relative;
  box-shadow: 0 0 5px #ccc;
}

.designer .block .edit {
  width: 100%;
  display: block;
  position: relative;
  z-index: 999;
}

.designer .block .edit .pageDiv {
  position: relative;
  width: 100%;
  height: 100%;
}

.designer .block .edit .pageDiv .tap {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 500;
}

.designer .block .edit .pageDiv .templateDiv {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 400;
}

.designer .block .prev {
  background: url('../../assets/images/icon/icon_pages.png') center no-repeat;
  position: absolute;
  top: 42%;
  left: -0.5rem;
  background-position: 0 100%;
  background-size: 200%;
  width: 1.6rem;
  height: 1.6rem;
  display: block;
  z-index: 1000;
}

.designer .block .next {
  background: url('../../assets/images/icon/icon_pages.png') center no-repeat;
  position: absolute;
  top: 42%;
  right: -0.5rem;
  background-position: 104% 100%;
  background-size: 200%;
  width: 1.6rem;
  height: 1.6rem;
  display: block;
  z-index: 1000;
}

.designer .block .next {}

.templateDiv {
  background-size: cover !important;
}

.pagination {
  position: relative;
  top: 10%;
  text-align: right;
  width: 90%;
  margin: 0 auto;
  padding-right: 5%;
}

.button-group {
  display: flex;
  display: -webkit-flex;
  position: absolute;
  background: #515151;
  width: 90%;
  height: 0.965rem;
  border-radius: 0.965rem;
  left: 5%;
  top: 1%;
  z-index: 1001;
  align-items: center;
  justify-content: center;
}

.mint-switch-custom span {
  color: #fff;
}

.mint-switch-custom .disable {
  color: #606060;
}

.button-group .item {
  width: 25%;
  height: 100%;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  color: #fff;
}

.button-group .item img {
  width: 0.48rem;
  margin-right: 0.1rem;
}

.button-group .item img.delete {
  width: 0.4rem;
}

.button-group .item .disable {
  color: #908F8F;
}

.footer {
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1002;
  display: flex;
  background: #E4E4E4;
  .t-layout {
    width: 7.6rem;
    height: 2.5rem;
    display: -webkit-flex;
    overflow-y: hidden;
    overflow-x: auto;
    img {
      width: 2rem;
      height: 2rem;
      margin: 0.25rem;
      flex-shrink: 0;
      -webkit-flex-shrink: 0;
      &.selected {
        border: 2px solid #bc223d;
      }
    }
  }
}


.photoDiv {
  -webkit-overflow-scrolling: touch;
}

.photoDiv img.zoom {
  /*transition: all 0.4s ease-out;*/
}

.p-state {
  color: #a6a6a6;
  width: 90%;
  position: relative;
  top: 12%;
  margin: 0 auto;
  text-align: left;
}

.img-opacity {
  filter: brightness(0.5);
  -webkit-filter: brightness(0.5);
}

.saveAll {
  background: #515151;
  width: 2.1rem;
  height: 1.0rem;
  line-height: 1.0rem;
  text-align: center;
  display: block;
  border-radius: 1rem;
  color: #fff;
  bottom: 0.5rem;
  right: 0.1rem;
  z-index: 1000;
  position: fixed;
}

.resize-button {
  display: flex;
  width: 100%;
  height: 0.8rem;
  background: rgba(0, 0, 0, 0.5);
  z-index: 600;
  position: absolute;
  bottom: 0;
  left: 0;
  display: none;
}

.resize-button>a {
  width: 49%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.resize-button>a img {
  width: 0.4rem;
}

.resize-button>a.disable img {
  filter: grayscale(1);
}

</style>
