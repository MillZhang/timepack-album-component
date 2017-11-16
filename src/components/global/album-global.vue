<!-- album editor global preview component-->
<template>
  <div class="editor album-global">
    <main class="main page clearfix">
      <div class="tip f12" v-if="null!=product">您选择的产品是{{product.productName}}<span class="f12 price">¥ {{product.productPrice}}</span></div>
      <div class="tip f12">
        亲爱的用户,请最好一次性编辑完成{{product.albumType == 0 ? '相册' : '台历'}}, 如果做一半离开,防止浏览器开小差丢了您的{{product.albumType == 0 ? '相册' : '台历'}};点击照片进入
        <span class="f12 functionalButton">【编辑】</span>可以调整照片哦!</div>
      <!--主体内容 -->
      <template v-for="(item,n) in photoList">
        <template v-if="n%2==0">
          <div class="floor-info" :class="{mt0:n==0}">
            {{null== layout ? '' : layout[n].name}}/{{null== layout ? '' : layout[n+1].name}}
          </div>
        </template>
        <div class="block" :class="{ml:n%2==0}">
          <div class="edit" href="javascript:;" :data-page="n" :style="{height:getPageHeight(n)}">
            <div class="pageDiv">
              <div class="templateDiv" :style="templateStyle(n)"></div>
              <template v-for="(imageItem,imageIndex) in item.list">
                <div class="photoDiv" :style="photoItemStyle(n,imageIndex)"></div>
              </template>
            </div>
          </div>
        </div>
      </template>
    </main>
    <div class="footer">
      <template v-if="restCount>0">
        <a href="javascript:;" class="batch" @click="handleImport">批量导入</a>
      </template>
      <template v-else>
        <a href="javascript:;">确定</a>
      </template>
    </div>
    <!--     <mt-actionsheet :closeOnClickModal="false" :actions="[{name:'重置编辑',method:resetAlbum}]" v-model="sheetVisible">
    </mt-actionsheet> -->
  </div>
</template>
<script>
import {
  Toast,
  MessageBox
} from 'mint-ui';
import Canvas from '../../tools/canvas/index.js'
export default {
  data() {
    return {
      editorWidth: window.innerWidth * .44,
      mainHeight: window.innerHeight,
      gapHeight: '',
      restCount: 0
    }
  },
  props: {
    //产品信息数据
    product: {
      type: Object,
      default: null,
      required: false
    },
    //容器信息数据
    layout: {
      type: Array,
      default: [],
      required: true
    },
    //图片信息数据
    photoList: {
      type: Array,
      default: [],
      required: true
    }
  },
  created() {
    this.init();
  },
  methods: {
    /**
     * 初始化数据结构
     * @return {[type]} [description]
     */
    init() {
      if (this.photoList.length == 0) {
        Canvas.render(null, this.layout);
        Canvas.init();
        this.$emit('change', Canvas.photo, Canvas.layout)
      } else {
        Canvas.render(this.photoList, this.layout);
      }
      this.restCount = Canvas.getter().rest();
    },
    /**
     * 获取单页的高度
     * @param  {[type]} n [description]
     * @return {[type]}   [description]
     */
    getPageHeight(n) {
      let height = this.editorWidth / Canvas.getter().radio(n);
      return height + 'px';
    },
    /**
     * 设置模板的背景图片
     * @param  {[type]} n [description]
     * @return {[type]}   [description]
     */
    templateStyle(n) {
      return 'background:url(' + Canvas.getter().template(n) + ') center no-repeat;background-size:cover';
    },
    /**
     * 单页模板和图片合成
     * @param  {[type]} index      [description]
     * @param  {[type]} imageIndex [description]
     * @return {[type]}            [description]
     */
    photoItemStyle(index, imageIndex) {
      return Canvas.setter().editPageStyle(index, imageIndex, this.editorWidth, false);
    },
    /**
     * 导入事件处理
     * @return {[type]} [description]
     */
    handleImport(e) {
      e.preventDefault();
      this.$emit('upload');
    }
  }
}

</script>
<style scoped lang="scss">
.editor {
  border-left: 1px solid #fff;
  background: #EDEDED;
  overflow: hidden;
  padding-bottom: 1.3rem;
  .main {
    background: #EDEDED;
  }
  .tip {
    padding: 0.02rem 0.2rem;
    color: #777777;
    width: 100%;
    box-sizing: border-box;
    .price {
      margin-left: 10px;
      color: #bc223d;
    }
  }
  /* 楼层头部信息 */
  .floor-info {
    position: relative;
    height: 0.6rem;
    line-height: 0.6rem;
    padding-left: 0.2rem;
    float: left;
    width: 80%;
    margin: 0.1rem 0.3rem;
    box-sizing: border-box;
    &::before {
      content: "";
      width: 0.14rem;
      height: 0.14rem;
      background: #969696;
      display: block;
      position: absolute;
      left: -0.2rem;
      top: 0.2rem;
      border-radius: 50%;
      z-index: 2;
    }
    &::after {
      content: "";
      width: 1px;
      height: 5.4rem;
      background: #ffffff;
      position: absolute;
      left: -0.14rem;
      top: 0.4rem;
    }
  }
  /*楼层*/
  .floor {
    border-radius: 4px;
    margin-left: 0.4rem;
    padding: 0.3rem 0;
    display: flex;
    display: -webkit-flex;
    width: 100%;
    box-sizing: border-box;
  }
  /**照片块*/
  .block {
    width: 44%;
    float: left;
    background: #f8f8f8;
    padding: 1%;
    &.ml {
      margin-left: 4%;
      border-right: 2px solid #ffffff;
    }
    img {
      width: 100%;
    }
    .edit {
      width: 100%;
      display: block;
      position: relative;
      z-index: 999;
    }
    .pageDiv {
      position: relative;
      width: 100%;
      height: 100%;
    }
    .templateDiv {
      width: 100%;
      height: 100%;
      position: relative;
      z-index: 1000;
    }
  }
  /*底部button*/
  .footer {
    position: fixed;
    left: 0;
    bottom: 0;
    right: 0;
    height: 1.2rem;
    background: #fff;
    z-index: 1001;
    display: flex;
    box-shadow: 0 0 5px #ccc;
    a {
      text-align: center;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fc6767;
      &:first-child {
        border-right: 1px solid #cccccc;
      }
    }
  }
}

</style>
