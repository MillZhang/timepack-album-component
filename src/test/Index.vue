<template>
  <div>
    <album-global :product="product" :layout="layout" :photoList="photoList" @change="handlePhotoChange" @upload="handleUpload" v-if="show"></album-global>
  </div>
</template>
<script type="text/javascript">
import Service from 'service'
import AlbumGlobal from 'components/global/album-global'
export default {
  name: 'GlobalEditor',
  data() {
    return {
      product: null,
      layout: [],
      photoList: [],
      show: false
    }
  },
  components: {
    AlbumGlobal
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      Service.getProduct({
        ticket: this.config.ticket
      }).then(result => {
        if (result.success) {
          this.product = result.data;
          this.fetchEssentialData();
        }
      })
    },
    fetchEssentialData() {
      if (this.cache.photoList().getter() != null || undefined != this.temporaryId) {
        this.photoList = this.cache.photoList().getter();
        this.layout = this.cache.layout().getter()
        this.show = true;
        return;
      };
      Service.getLayout({
        tempId: this.cache.template().getter(),
        ticket: this.config.ticket
      }).then(result => {
        if (result.success) {
          this.layout = result.data.layout;
          this.show = true;
        }
      })
    },

    handlePhotoChange(photo, layout) {
      this.photoList = photo;
      this.cache.layout().setter(layout);
      this.cache.photoList().setter(photo);
    },

    handleUpload() {
      this.$router.push(`/test/upload?mode=group`);
    }
  }
}

</script>
