<template>
  <section class="image-sort-container page" :style="containerStyle">
    <div class="tip f12">拖拽图片,进行排序</div>
    <draggable v-model="imageList" class="list-group" :options="dragOptions" @start="isDragging=true" @end="isDragging=false">
      <transition-group type="transition" :name="'flip-list'" class="container">
        <div v-for="item in imageList" class="list-group-item" :key="item.key">
          <img :src="getImageUrl(item.key)" alt="" @load="imageLoaded">
        </div>
      </transition-group>
    </draggable>
    <div class="scroller_vertical" @touchstart="scrollerStart" @touchmove="scrollerMove" @touchend="scrollerEnd" v-if="showScrollBar"></div>
    <footer>
      <a href="javascript:;" @click="completeSort">完成</a>
    </footer>
  </section>
</template>
<script>
import canvas from 'jsPath/module/AlbumModel'
import Cache from 'jsPath/tool/Cache'
import draggable from 'vuedraggable'
export default {
  name: '',
  data() {
    return {
      imageList: Cache.groupPhoto().getter(),
      editable: true,
      isDragging: false,
      delayedDragging: false,
      top: 0,
      showScrollBar: false,
      loadImageSize: 0,
      dpr: $('html').attr('data-dpr'),
      pos: {

      }
    }
  },
  watch: {
    loadImageSize(newVal) {
      if (newVal == this.imageList.length) {
        console.log('图片加载完成');
        this.pos.contentHeight = $('span.container').height();
        this.pos.scrollHeight = window.innerHeight;
        this.pos.rate = this.pos.contentHeight / this.pos.scrollHeight;
        if (this.pos.contentHeight + 50 > this.pos.scrollHeight) {
          this.showScrollBar = true;
        }
      }
    }
  },
  computed: {
    dragOptions() {
      return {
        animation: 0,
        group: 'description',
        disabled: !this.editable,
        ghostClass: 'ghost'
      };
    },
    containerStyle() {
      return {
        width: '100%',
        height: window.innerHeight + 'px',
        overflow: 'hidden',
        position: 'absolute'
      }
    },
  },
  components: {
    draggable
  },
  methods: {
    getImageUrl(key) {
      return this.utils.getConstant().DOMAIN + key + '?imageView2/1/w/300/h/300/q/100';
    },
    completeSort() {
      canvas.fillImageBySortableGroup(this.imageList);
      Cache.groupPhoto().remove();
      this.$router.replace('/editor/global')
    },
    scrollerStart(e) {
      e.preventDefault();
      let startTop = e.targetTouches[0].pageY;
      if (undefined == this.pos.start) {
        this.pos.start = startTop;
      }

    },
    scrollerMove(e) {
      e.preventDefault();
      let touch = e.targetTouches[0];
      let moveTop = touch.pageY - this.pos.start,
        moveHeight = moveTop * this.pos.rate + window.innerHeight - 90;
      if (moveTop > 0 && moveHeight < this.pos.contentHeight) {
        $(e.target).css('top', moveTop + 'px');
        $('.container,.tip').css({
          position: 'relative',
          top: -moveTop * this.pos.rate + 'px'
        });
      } else if (moveTop < 0) {
        $(e.target).css('top', $('.tip').height() + 'px');
        $('.container,.tip').css({
          position: 'relative',
          top: '0px'
        });
      }

    },
    scrollerEnd(e) {
      e.preventDefault();
    },
    imageLoaded() {
      this.loadImageSize++;
    }
  },
  mounted() {
    //计算scrollbar的高度
    this.$nextTick(() => {});
  }
}

</script>
<style lang="scss" scoped>
.image-sort-container {
  .tip {
    background: #FFDFDF;
    padding-left: 0.267rem;
    height: 0.667rem;
    line-height: 0.667rem;
  }
}

.flip-list-move {
  transition: transform 0.5s;
}

.no-move {
  transition: transform 0s;
}

.ghost {
  opacity: .5;
  background: #C8EBFB;
}

.list-group {
  min-height: 0.267rem;
  .container {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: 0.267rem 0.5rem 1.3rem 0.133rem;
    .list-group-item {
      width: 30.5%;
      margin: 0.067rem;
      img {
        width: 100%;
      }
    }
  }
}

footer {
  display: flex;
  border-top: 1px solid #c8c7cc;
  background: #ffffff;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 1000;
  width: 100%;
  height: 1.2rem;
  &>a {
    width: 100%;
    height: 100%;
    display: block;
    text-align: center;
    line-height: 1.2rem;
    color: #e33e45;
    position: relative;
  }
}

</style>
