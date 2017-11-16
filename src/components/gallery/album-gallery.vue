<!-- 相簿图库 -->
<template>
  <section class="album-gallery">
    <header class="header">已选{{selectCount}}张,可选{{restCount}}张</header>
    <main class="main page" style="background: #ffffff;bottom: 1.2rem;" v-infinite-scroll="loadMore" :infinite-scroll-distance="60">
      <p class="warn">带有 <img src="../../assets/images/icon-warn.png" alt="">的图片像素太低,请慎重选择!</p>
      <div class="banner">
        <span>照片库</span>
        <a href="javascript:;" class="delete" @click="deleteStatus?deleteStatus=false:deleteStatus=true;selectAllStatus=false">
          <template v-if="deleteStatus">取消</template>
          <template v-else>删除</template>
        </a>
      </div>
      <div class="uploader" style="border-bottom: none;">
        <div class="timeline">
          添加图片
        </div>
        <div class="imageList">
          <img src="../../assets/images/icon-uploader.png" alt="" :style="{height:thumbWidth+'px',width:thumbWidth+'px'}" id="uploaderButton" @click="chooseImage">
        </div>
      </div>
      <div class="infiniteList">
        <template v-for="(item,index) in imageList" v-if="item.items.length>0">
          <div class="uploader">
            <div class="timeline">
              <p>{{item.group}}</p>
              <p>{{item.detail}}</p>
              <label class="groupSelect" @click="handleGroupSelect"></label>
            </div>
            <div class="imageList">
              <template v-for="(image,pos) in item.items">
                <div class="imageItem" :class="{mr0:pos%3==2,del:deleteStatus,warned:image.size<1}" :data-selected="hasSelected(image.key)" @click="handleImageOperate($event,image.id,index,pos)">
                  <img class="image" v-lazy="setImageUrl(image.key)" alt="" :data-width="image.width" :data-height="image.height" :data-key="image.key" :data-degree="image.degree">
                </div>
              </template>
            </div>
          </div>
        </template>
      </div>
    </main>
    <footer class="footer">
      <div class="u-buttons">
        <a href="javascript:;" class="selectAll" :class="{disable:deleteStatus}" @click="handleSelectAll">
          <template v-if="selectAllStatus">取消全选</template>
          <template v-else>全选</template>
        </a>
        <a href="javascript:;" class="ensure" :class="{disable:deleteStatus}" @click="handleConfirm">确定</a>
      </div>
    </footer>
    <section class="u-upload" v-show="isUploading">
      {{progressMessage}}
    </section>
    <div class="u-layer" v-show="isUploading"></div>
  </section>
</template>
<script src="./gallery.js"></script>
<style src="./gallery.scss" lang="scss" scoped></style>
