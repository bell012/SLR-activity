<!-- 单个金蛋组件 Lottie 动画 -->
<template>
  <div class="jindan-item">
    <div ref="lottieContainer" class="lottie-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import lottie from 'lottie-web'
import jindanDaijiJson from '@/static/ticket/animation/jindan-daiji.json'

const lottieContainer = ref(null)
let animation: any = null

onMounted(() => {
  if (lottieContainer.value) {
    animation = lottie.loadAnimation({
      container: lottieContainer.value,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: jindanDaijiJson
    })
  }
})

onBeforeUnmount(() => {
  if (animation) {
    animation.destroy()
  }
})
</script>

<style scoped lang="scss">
.jindan-item {
  position: relative;
  width: 80px;
  height: 92px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.lottie-container {
  width: 100%;
  height: 100%;
}
</style>
