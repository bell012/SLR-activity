<!-- 单个金蛋组件 Lottie 动画 -->
<template>
  <div class="jindan-item" @click="handleClick">
    <div ref="lottieContainer" class="lottie-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import lottie from 'lottie-web'
import jindanDaijiJson from '@/static/ticket/animation/jindan-daiji.json'
import jindanZakaiJson from '@/static/ticket/animation/jindan-zakai.json'

const lottieContainer = ref(null)
let animation: any = null
const isSmashing = ref(false) // 是否正在砸蛋

const emit = defineEmits<{
  click: []
}>()

// 播放待机动画
const playIdleAnimation = () => {
  if (animation) {
    animation.destroy()
  }
  if (lottieContainer.value) {
    animation = lottie.loadAnimation({
      container: lottieContainer.value,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: jindanDaijiJson
    })
  }
}

// 播放砸蛋动画
const playSmashAnimation = () => {
  if (animation) {
    animation.destroy()
  }
  if (lottieContainer.value) {
    animation = lottie.loadAnimation({
      container: lottieContainer.value,
      renderer: 'svg',
      loop: false,
      autoplay: true,
      animationData: jindanZakaiJson
    })

    // 监听动画完成事件
    animation.addEventListener('complete', () => {
      isSmashing.value = false
      // 砸蛋动画完成后，恢复待机动画
      playIdleAnimation()
    })
  }
}

// 点击金蛋
const handleClick = () => {
  if (isSmashing.value) return

  isSmashing.value = true
  playSmashAnimation()
  emit('click')
}

onMounted(() => {
  playIdleAnimation()
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
