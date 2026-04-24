<template>
  <div class="index-banner">
    <h1 class="index-banner-title">淘宝用户购物行为聚类分析</h1>
  </div>
</template>

<script>

export default {
  name: 'IndexBanner',
  data() {
    return {
      title: '淘宝用户购物行为聚类分析'
    }
  }
}

</script>

<style scoped lang="scss">
.index-banner {
  width: 100%;
  height: 60px;
  background: url(../../assets/view_images/indexBanner.jpg) center;
  background-size: cover;
  overflow: hidden;
}

.index-banner-title {
  font-size: 24px;
  color: orange;
  text-align: center;
}
</style>
