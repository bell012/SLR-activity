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
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useTicketStore } from '@/store/modules/ticket'

const ticketStore = useTicketStore()

// 获取当前票券
const currentTicket = computed(() => ticketStore.getCurrentTicket())
const currentRowId = computed(() => currentTicket.value?.rowId || 0)
const currentTicketType = computed(() => currentTicket.value?.type || 0)

// 获取中奖数据
const marqueeData = computed(() => {
  if (!currentTicketType.value) return null
  return ticketStore.getMarqueeByType(currentTicketType.value)
})

// 转换接口数据为列表格式
const originalList = computed(() => {
  if (!marqueeData.value || !marqueeData.value.records) {
    return []
  }
  return marqueeData.value.records.map((item, index) => ({
    id: index + 1,
    name: item.memberAccount,
    money: item.amountDisplay
  }))
})

const translateY = ref(0)
const displayList = ref<any[]>([])
let animationFrame: number | null = null
let startTime: number | null = null

const initList = () => {
  const list = originalList.value
  if (list.length === 0) {
    displayList.value = []
    return
  }
  displayList.value = [
    ...list.map((item, index) => ({ ...item, key: `original-${index}` })),
    ...list.slice(0, 4).map((item, index) => ({ ...item, key: `copy-${index}` }))
  ]
}

// 无限滚动动画
const animate = (timestamp: number) => {
  if (!startTime) startTime = timestamp

  const elapsed = timestamp - startTime
  const itemHeight = 62
  const speed = 30
  translateY.value = -((elapsed * speed) / 1000)
  const totalHeight = originalList.value.length * itemHeight
  if (Math.abs(translateY.value) >= totalHeight) {
    translateY.value = 0
    startTime = timestamp
  }

  animationFrame = window.requestAnimationFrame(animate)
}

// 加载中奖数据
const loadMarqueeData = async () => {
  if (!currentTicketType.value) return
  await ticketStore.fetchMarqueeData(currentTicketType.value)
  initList()
}

// 重置动画
const resetAnimation = () => {
  if (animationFrame) {
    window.cancelAnimationFrame(animationFrame)
    animationFrame = null
  }
  translateY.value = 0
  startTime = null
}

// 启动动画
const startAnimation = () => {
  window.setTimeout(() => {
    animationFrame = window.requestAnimationFrame(animate)
  }, 1000)
}

onMounted(() => {
  loadMarqueeData().then(() => {
    startAnimation()
  })
})

watch(currentRowId, (newRowId) => {
  if (newRowId) {
    resetAnimation()
    loadMarqueeData().then(() => {
      startAnimation()
    })
  }
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
