<template>
  <div class="wins-container">
    <div class="title-section">
      <img src="@/static/ticket/bottom_title.png" alt="" />
    </div>
    <div class="list-section">
      <div class="scroll-wrapper" :style="{ transform: `translateY(${translateY}px)` }">
        <div v-for="item in displayList" :key="item.key" class="item">
          <span class="name">{{ item.name }}</span>
          <span class="money">₱ {{ item.money }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const originalList = [
  { id: 1, name: '*******001', money: '15.48' },
  { id: 2, name: '*******002', money: '15.48' },
  { id: 3, name: '*******003', money: '15.48' },
  { id: 4, name: '*******004', money: '15.48' },
  { id: 5, name: '*******005', money: '15.48' },
  { id: 6, name: '*******006', money: '15.48' },
  { id: 7, name: '*******007', money: '15.48' },
  { id: 8, name: '*******008', money: '15.48' },
  { id: 9, name: '*******009', money: '15.48' },
  { id: 10, name: '*******010', money: '15.48' },
  { id: 11, name: '*******011', money: '15.48' },
  { id: 12, name: '*******012', money: '15.48' }
]

const translateY = ref(0)
const displayList = ref<any[]>([])
let animationFrame: number | null = null
let startTime: number | null = null

const initList = () => {
  displayList.value = [
    ...originalList.map((item, index) => ({ ...item, key: `original-${index}` })),
    ...originalList.slice(0, 4).map((item, index) => ({ ...item, key: `copy-${index}` }))
  ]
}

// 无限滚动动画
const animate = (timestamp: number) => {
  if (!startTime) startTime = timestamp

  const elapsed = timestamp - startTime
  const itemHeight = 62
  const speed = 30
  translateY.value = -((elapsed * speed) / 1000)
  const totalHeight = originalList.length * itemHeight
  if (Math.abs(translateY.value) >= totalHeight) {
    translateY.value = 0
    startTime = timestamp
  }

  animationFrame = window.requestAnimationFrame(animate)
}

onMounted(() => {
  initList()
  window.setTimeout(() => {
    animationFrame = window.requestAnimationFrame(animate)
  }, 1000)
})

onUnmounted(() => {
  if (animationFrame) {
    window.cancelAnimationFrame(animationFrame)
  }
})
</script>

<style lang="scss" scoped>
.wins-container {
  width: 100%;
  max-height: 390px;
  overflow: hidden;
  background: url('@/static/ticket/bottomBG.png') no-repeat;
  background-size: 100% 100%;
  padding: 15px;
  .title-section {
    width: 100%;
    height: 35px;
    margin: 30px 0 25px 0;
    > img {
      width: 100%;
      height: 100%;
      object-fit: fill;
    }
  }
  .list-section {
    width: 100%;
    height: 248px;
    overflow: hidden;
    position: relative;

    .item {
      display: flex;
      align-items: center;
      justify-content: space-around;
      width: 100%;
      height: 52px;
      background: url('@/static/ticket/bottom_item.png') no-repeat;
      background-size: 100% 100%;
      margin-bottom: 10px;
      .name {
        font-size: 14px;
        color: #fef1d4;
      }
      .money {
        font-size: 15px;
        background: linear-gradient(180deg, #ffffff 22.22%, #e9bb89 79.63%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
    }
  }
}
</style>
