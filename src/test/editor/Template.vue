<template>
  <div id="templateList">
    <section class="main page" v-infinite-scroll="loadMore" :infinite-scroll-distance="100" infinite-scroll-disabled="loading">
      <div class="t-list" v-if="templateList.length >0" v-show="status" :style="{'position':previewStatus?'relative':'absolute'}">
        <template v-for="(item,index) in templateList">
          <!-- 相簿模板预览方式 -->
          <div class="t-item" @click="previewTemplate($event,item.id,item.preview)" v-if="typeId == 0">
            <div class="image">
              <img v-lazy="item.coverImg+'?imageMogr2/thumbnail/600x600'" alt="模板图片">
            </div>
            <p class="name" :id="item.id" :data-name="item.tempName">{{item.tempName}}</p>
          </div>
          <!-- 台历模板预览方式-->
          <div class="t-calendar" @click="previewTemplate($event,item.id,item.preview)" v-else>
            <div class="image">
              <img v-lazy="item.coverImg+'?imageMogr2/thumbnail/600x600'" alt="模板图片">
            </div>
            <p class="name" :id="item.id" :data-name="item.tempName">{{item.tempName}}</p>
          </div>
        </template>
      </div>
      <div class="t-empty-list" v-else v-show="status">
        模板加载中...
      </div>
    </section>
    <div class="t-layer" v-show="previewStatus"></div>
    <div class="t-popup" v-show="previewStatus">
      <section class="content" :style="{height:contentHeight}">
        <mt-swipe :auto="0" :showIndicators="false" @change="handleChange" :defaultIndex="defaultIndex" ref="swipe">
          <template v-for="(item,index) in previewList">
            <mt-swipe-item>
              <img :src="item+'?imageMogr2/thumbnail/600x600'" alt="">
            </mt-swipe-item>
          </template>
        </mt-swipe>
        <section class="pagenation f16">
          {{currentIndex}}/{{previewList.length}}
        </section>
        <a href="javascript:;" class="t-button" @click="selectTemplateEvent($event)">确定</a>
        <section class="close" @click="closePreview">
          <img src="../../assets/images/icon/icon-cha.png" alt="">
        </section>
      </section>
    </div>
  </div>
</template>
<script>
import Service from 'service/service'
import Cache from 'jsPath/tool/Cache'
import {
  MessageBox
} from 'mint-ui';
export default {
  name: 'tempalteList',
  data() {
    return {
      templateList: [],
      previewList: [],
      previewStatus: false,
      contentHeight: '',
      status: false,
      currentIndex: 1,
      selectedTemplateIndex: 1,
      defaultIndex: 0,
      loading: false,
      loadingOver: false,
      pageNum: 1,
      pageSize: 5,
      typeId: 1,
      rate: 1,
      land: true,
      calendarBg: ''
    }
  },
  created() {
    this.loadMore();
    this.validateRegister();
    this.fetchProductData();
  },
  computed: {
    getCalendarPreview() {
      return {
        backgroundImage: 'url(' + (this.calendarBg + '?' + new Date().getTime()) + ')'
      }
    }
  },
  methods: {
    loadMore() {
      if (this.loading) return;
      if (this.loadingOver) return;
      this.loading = true;
      this.fetchTemplateList();
    },
    fetchTemplateList() {
      Service.getTemplateList({
        ticket: this.config.ticket,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }, result => {
        if (result.success) {
          if (result.data.length == 0) {
            this.loadingOver = true;
            return;
          }
          this.templateList.push(...result.data);
          this.rate = result.data[0].width / result.data[0].height;
          if (this.rate > 1) {
            this.land = true
          } else {
            this.land = false;
          }
          this.pageNum++;
          this.loading = false;
        }
      });
    },
    fetchProductData() {
      Service.getProduct({
        ticket: this.config.ticket
      }, result => {
        if (result.success) {
          this.typeId = undefined == result.data.typeId ? 0 : result.data.typeId;
        }
      });
    },
    validateRegister() {
      let ticket = App.config.ticket;
      if ("" == ticket || null == ticket || undefined == ticket) {
        MessageBox({
          title: '',
          message: '缺少ticket,请先注册后再使用!'
        });
        this.status = false;
        return;
      }
      this.status = true;
    },
    previewTemplate(e, id, previewList) {
      e.preventDefault();
      let that = this;
      this.currentIndex = 1;
      this.defaultIndex = 0;
      this.$refs.swipe.index = 0;
      this.$wrap.find('.mint-swipe-item').removeClass('is-active');
      this.$wrap.find('.mint-swipe-item:first-child').addClass('is-active');
      this.selectedTemplateIndex = id;
      this.previewStatus = true;
      this.previewList = previewList;
      this.$nextTick(() => {
        this.contentHeight = ($('.mint-swipe').width() / this.rate).toFixed(2) + 'px';
      });
    },
    handleChange(index) {
      this.currentIndex = index + 1;
    },
    pageClick(e, type) {
      e.preventDefault();
      let runToIndex = this.currentIndex - 1;
      if (type == 'next') {
        runToIndex += 1;
        this.currentIndex < this.previewList.length ? this.currentIndex += 1 : this.previewList.length;
      } else {
        runToIndex -= 1;
        this.currentIndex > 1 ? this.currentIndex -= 1 : 1;
      }
      let $activeObj = $($('.mint-swipe-items-wrap').find('.mint-swipe-item')[runToIndex]);
      if ($activeObj.length > 0) {
        $('.mint-swipe-item').removeClass('is-active');
        $activeObj.addClass('is-active');
      }
    },
    closePreview(e) {
      e.preventDefault();
      this.previewStatus = false;
    },
    selectTemplateEvent(e) {
      e.preventDefault();
      let that = this;
      let id = this.selectedTemplateIndex;
      let cacheTemplateId = Cache.template().getter();
      Service.clearCache({
        ticket: App.config.ticket
      }, result => {
        if (result.success) {
          //已经生成了订单,则清除缓存
          Cache.remove();
        } else {
          if (id != cacheTemplateId) {
            Cache.remove();
          }
        }
        Cache.template().setter(id)
        that.$router.push('/editor/global');
      });
    }
  },
  mounted() {
    this.$wrap = $('.mint-swipe-items-wrap');
  }
}

</script>
<style scoped lang="scss">
.t-list {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 0.5rem 0.3rem;
  .t-item {
    width: 4.5rem;
    padding-top: 0.3rem;
    position: relative;
    margin-bottom: 0.5rem;
    .name {
      text-align: center;
      margin: 0.333rem auto 0;
      color: #3d4245;
    }
    .image {
      width: 100%;
      &:before {
        content: "";
        background: url("../../assets/images/icon/icon-book-shadow.png") center no-repeat;
        background-size: cover;
        width: 100%;
        height: 0.533rem;
        position: absolute;
        top: -0.2rem;
        left: 0;
      }
      img {
        width: 100%;
        box-shadow: 0 0 0.533rem #8e8e8e;
        position: relative;
        z-index: 2;
      }
    }
  }

  .t-calendar {
    width: 4.5rem;
    padding-top: 0.3rem;
    position: relative;
    margin-bottom: 0.5rem;
    .image {
      width: 100%;
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
      &.land {
        padding: 0.5rem 0;
      }
      &.vertical {
        padding: 0.8rem 0;
      }
      img {
        width: 98%;
        margin: 0 auto;
        position: relative;
        z-index: 2;
      }
    }
    .name {
      text-align: center;
      margin: 0.333rem auto 0;
      color: #3d4245;
    }
  }
}

.t-empty-list {
  text-align: center;
  padding-top: 50%;
}

.t-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, .4);
  z-index: 999;
}

.t-popup {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 1000;
}

.t-popup .content {
  background: #ffffff;
  border-radius: 0.25rem;
  width: 8rem;
  left: 1rem;
  position: absolute;
  top: 0.5rem;
  color: #797979;
  /*padding: 8% 8% 14%;*/
  padding-bottom: 2.43rem;
}

.t-popup .close {
  width: 0.6533rem;
  margin: 1rem auto 0;
}

.t-popup .close img {
  width: 100%;
}

.t-button {
  display: block;
  height: 0.96rem;
  width: 3.63rem;
  line-height: 0.96rem;
  background: #FB5151;
  color: #ffffff;
  text-align: center;
  border-radius: 1.2rem;
  margin: 0.3rem auto 1rem;
}

.mint-swipe {
  border-top-left-radius: 0.25rem;
  border-top-right-radius: 0.25rem;
}

.mint-swipe-item img {
  width: 100%;
  /*border-radius: 0.25rem;*/
}

.pagenation {
  width: 100%;
  text-align: right;
  padding-top: 0.2rem;
  padding-right: 0.3rem;
  box-sizing: border-box;
  /*display: flex;*/
  /*display: -webkit-flex;*/
}

.pagenation .prev {
  display: block;
  background: url("../../assets/images/icon/icon-arrow-l.png") center no-repeat;
  background-size: contain;
  width: 30%;
}

.pagenation>span {
  width: 40%;
}

.pagenation .next {
  display: block;
  background: url("../../assets/images/icon/icon-arrow-r.png") center no-repeat;
  background-size: contain;
  width: 30%;
}

</style>
