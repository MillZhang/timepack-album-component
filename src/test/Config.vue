<template>
  <div class="main">
  </div>
</template>
<script>
export default {
  data() {
    return {

    }
  },
  created() {
    //模拟数据测试
    this.cache.ticket().setter('03508c0bca651626503cfa2ca6f8868c')
    this.cache.template().setter(99)
    this.$router.push('/test/global')
  }
}

</script>
