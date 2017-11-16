<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
export default {
  name: 'app',
  data() {
    return {

    }
  },
  methods: {
    author() {
      this.config.ticket = this.cache.ticket().getter();
    }
  },
  created() {
    this.author();
  },
  mounted() {},
  watch: {
    // 如果路由有变化，会再次执行该方法
    "$route": "author"
  }
}

</script>
<style>


</style>
