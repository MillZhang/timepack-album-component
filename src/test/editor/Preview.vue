<template id="preview">
  <div class="preivew">
    <main class="main page">
      <div class="photo-container">
        <cm-previewer :data="photoList" :temp="layoutList" :width="editorWidth" :height="editorHeight" v-show="showPreview" @loaded="showChildComponent"></cm-previewer>
        <div class="p-tip-container">
          <p class="p-tips">点击左右翻动预览</p>
          <div class="p-state">
            <p class="f12">说明:</p>
            <p class="f12">1.请左右点击相册进行翻页预览,确认上传的每一张照片是在相框最合适的位置;</p>
            <p class="f12">2.如果照片在相框的位置不满意,请点击"返回"到【全局预览】,然后点击照片到【编辑】调整照片;</p>
            <p class="f12">3.点击"完成"按钮以后,相册<span class="f12" style="color: #ff4545;">将无法修改</span></p>
          </div>
          <div class="click-tip" v-show="showTip">
            <img src="../../assets/images/click.gif" alt="">
          </div>
        </div>
      </div>
    </main>
    <footer class="footer">
      <div class="p-button">
        <router-link :to="{path:'global'}" class="back">返回编辑</router-link>
        <a class="save" @click="saveAlbumEvent">下单购买</a>
      </div>
    </footer>
  </div>
</template>
<script>
import Cache from 'jsPath/tool/Cache'
import canvas from 'jsPath/module/AlbumModel'
import Service from 'service/service'
import cmPreviewer from '../common/cm-previewer'
import { Indicator } from 'mint-ui';
export default {
  name: 'album-preview',
  data() {
    return {
      editorWidth: window.innerWidth * .8,
      editorHeight: window.innerWidth * .8 / canvas.getImageRadio(0),
      photoList: Cache.photoList().getter(),
      layoutList: Cache.layout().getter(),
      tempId: Cache.template().getter(),
      tipHeight: '',
      coverImg: '',
      showTip: true,
      showPreview: false
    }
  },
  created() {},
  components: {
    cmPreviewer
  },
  methods: {
    showChildComponent() {
      this.showPreview = true;
    },
    /**
     * 保存相簿事件
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    saveAlbumEvent(e) {
      e.preventDefault();
      let that = this;
      this.alert({
        title: '友情提示',
        message: '相簿创建后就不可以修改哦<br>是否确认创建相簿?',
        showCancelButton: true
      }).then(action => {
        if (action == 'confirm') { //确认保存
          that.saveAlbumData();
        }
      });
    },

    /**
     * 保存相簿数据
     * @return {[type]} [description]
     */
    saveAlbumData() {
      let layout = this.layoutList[0],
        rate = layout.tw / this.utils.getConstant().EditorWidth,
        unInsertedCount = canvas.getRestEmptyCount();
      let that = this;
      Service.saveAlbumData({
        photoList: this.photoList,
        layout: this.layoutList,
        tempId: this.tempId,
        ticket: this.config.ticket,
        rate: rate.toFixed(5),
        complete: unInsertedCount == 0
      }, {
        redirect(url, temporaryId) {
          that.$router.push(url + '?temporaryId=' + temporaryId);
        }
      })
    }
  },
  mounted() {}
}

</script>
<style scoped lang="scss">
.main {
  background: url("../../assets/images/bg-4.jpg") center no-repeat;
  background-size: cover;
  padding-bottom: 1.25rem;
  padding-top: 1.2rem;
  box-sizing: border-box;
}


.footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  width: 100%;
  height: 1.2rem;
}

.p-button {
  display: flex;
  border-top: 1px solid #c8c7cc;
  background: #ffffff;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 1.2rem;
  &>a {
    flex: 1;
    display: block;
    text-align: center;
    color: #e33e45;
    position: relative;
    width: 50%;
    &:first-child {
      border-right: 1px solid #cccccc;
    }
  }
}

.p-tip-container {
  position: relative;
  width: 100%;
  text-align: center;
  .p-tips {
    color: #644020;
  }
  .p-state {
    width: 90%;
    margin: 0.4rem auto 0;
    color: #644020;
    text-align: left;
    padding-bottom: 0.5rem;
  }
  .click-tip {
    position: absolute;
    width: 0.8rem;
    top: -1rem;
    right: 10%;
    z-index: 2000;
    img {
      width: 100%;
    }
  }
}

</style>
