<template>
  <div class="ticket-container">
    <div class="ticketBox">
      <div class="title-section">
        <img :src="titleImg" alt="title" class="title-img" />
      </div>

      <div class="nav-section">
        <div class="nav-arrow" :class="{ disabled: !canGoPrev }" @click="handlePrev">
          <img :src="btnLeft" alt="left" />
        </div>

        <div class="icon-list">
          <div
            v-for="(item, index) in visibleIcons"
            :key="currentPage * itemsPerPage + index"
            class="icon-item"
            :class="{
              active: ticketStore.activeTicketIndex === currentPage * itemsPerPage + index
            }"
            @click="handleIconClick(index)"
          >
            <img
              :src="item.icon"
              :alt="item.name"
              class="icon-img"
              :class="{
                'active-img': ticketStore.activeTicketIndex === currentPage * itemsPerPage + index
              }"
            />
          </div>
        </div>

        <div class="nav-arrow" :class="{ disabled: !canGoNext }" @click="handleNext">
          <img :src="btnRight" alt="right" />
        </div>
      </div>

      <div class="text-section">{{ currentText }}</div>

      <!-- 时间倒计时 -->
      <div class="time-section">
        <img :src="alarmImg" alt="alarm" class="alarm-icon" />
        <span class="time-label">Time Left</span>
        <div class="time-numbers">
          <span class="time-num">9</span>
          <span class="time-num">9</span>
          <span class="time-separator">:</span>
          <span class="time-num">9</span>
          <span class="time-num">9</span>
          <span class="time-separator">:</span>
          <span class="time-num">9</span>
          <span class="time-num">9</span>
        </div>
      </div>

      <!-- 组件切换 -->
      <div class="component-section">
        <component :is="currentComponent" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useTicketStore } from '@/store/modules/ticket'
import Jindan from './component/jindan/index.vue'
import Zhuanpan from './component/zhuanpan/index.vue'
import Hongbao from './component/hongbao/index.vue'
import Xianjin from './component/xianjin/index.vue'
import titleImg from '@/static/ticket/title.png'
import btnLeft from '@/static/ticket/btn_left.png'
import btnRight from '@/static/ticket/btn_right.png'
import alarmImg from '@/static/ticket/alarm.png'

// 组件映射
const componentMap: Record<string, any> = {
  Jindan,
  Zhuanpan,
  Hongbao,
  Xianjin
}

const ticketStore = useTicketStore()

// 动态生成图标列表
const iconList = computed(() => {
  const list = ticketStore.ticketList.map((ticket, index) => {
    const isActive = ticketStore.activeTicketIndex === index
    const iconPath = ticketStore.getIconByType(ticket.type, isActive)
    const name = ticket.languageInfo[0]?.name || ''
    return {
      icon: iconPath,
      name,
      type: ticket.type,
      component: componentMap[ticketStore.getComponentNameByType(ticket.type)]
    }
  })
  return list
})

// 当前组件
const currentComponent = computed(() => {
  const currentIcon = iconList.value[ticketStore.activeTicketIndex]
  return currentIcon?.component || Jindan
})

// 当前显示的文本
const currentText = computed(() => {
  const currentTicket = ticketStore.getCurrentTicket()
  const text = currentTicket?.languageInfo[0]?.name || ''
  return text
})

// 轮播相关
const currentPage = ref(0) // 当前页码（从0开始）
const itemsPerPage = 5 // 每页显示5个

// 当前页显示的图标列表
const visibleIcons = computed(() => {
  const start = currentPage.value * itemsPerPage
  const end = start + itemsPerPage
  return iconList.value.slice(start, end)
})

// 总页数
const totalPages = computed(() => {
  return Math.ceil(iconList.value.length / itemsPerPage)
})

// 是否可以向左翻页
const canGoPrev = computed(() => {
  return currentPage.value > 0
})

// 是否可以向右翻页
const canGoNext = computed(() => {
  return currentPage.value < totalPages.value - 1
})

// 向左翻页
const handlePrev = () => {
  if (canGoPrev.value) {
    currentPage.value--
  }
}

// 向右翻页
const handleNext = () => {
  if (canGoNext.value) {
    currentPage.value++
  }
}

// 点击图标
const handleIconClick = (index: number) => {
  const actualIndex = currentPage.value * itemsPerPage + index
  ticketStore.setActiveTicket(actualIndex)
}

// 初始化
onMounted(async () => {
  await ticketStore.fetchTicketList({
    current: 1,
    size: 10
  })
})
</script>

<style lang="scss" scoped>
.ticket-container {
  min-height: 100vh;
  height: 100vh;
  background: #000;
  padding: env(safe-area-inset-top) 0 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.ticketBox {
  position: relative;
  width: 100%;
  flex: 1;
  margin-top: 44px;
  border-radius: 34px 34px 0 0;
  background: url('@/static/ticket/BG.png') no-repeat;
  background-size: contain;
  overflow-y: auto;
  overflow-x: hidden;
  isolation: isolate;
  padding: 15px;

  .title-section {
    display: flex;
    align-items: center;
    justify-content: start;
    margin-bottom: 15px;

    .title-img {
      height: 45px;
      width: auto;
    }
  }

  .nav-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    height: 75px;
    min-height: 75px;
    gap: 8px;

    .nav-arrow {
      flex-shrink: 0;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      img {
        width: 20px;
        height: 20px;
      }

      &.disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }

      &:not(.disabled):hover {
        opacity: 0.8;
      }
    }

    .icon-list {
      flex: 1;
      display: flex;
      padding: 0;
      gap: 5px;
      justify-content: flex-start;
      align-items: center;
      overflow: visible;

      .icon-item {
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        flex: 0 0 auto;
        max-width: 19%;

        .icon-img {
          width: auto;
          height: 60px;
          max-width: 100%;
          max-height: 65px;
          display: block;
          transition: all 0.3s ease;

          &.active-img {
            height: 65px;
          }
        }

        &.active {
          .icon-img {
            height: 65px;
          }
        }

        &:hover:not(.active) {
          .icon-img {
            transform: scale(1.05);
          }
        }
      }
    }
  }
  .text-section {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #ffffff;
    margin-bottom: 10px;
  }
  .time-section {
    height: 50px;
    padding: 0 10px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: start;
    gap: 5px;
    margin-bottom: 15px;
    border-radius: 15px;
    border: 2px solid transparent;

    background:
    /* 内容背景渐变 */
      linear-gradient(88.74deg, #3f2b4d 1.35%, #1a142a 50.67%, #3f2b4d 100%) padding-box,
      /* 边框渐变 */
      linear-gradient(88.74deg, #d4ad10 1.01%, #6e5908 17.44%, #6e5908 83.99%, #d4ad10 100%)
        border-box;

    .alarm-icon {
      width: 22px;
      height: 27px;
    }

    .time-label {
      color: #ffbc47;
      font-size: 14px;
      font-weight: 600;
    }

    .time-numbers {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;

      .time-num {
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        width: 26px;
        height: 26px;
        border-radius: 7px;
        color: #ffbc47;
        font-size: 20px;
        font-weight: 600;
        border: 2px solid #ffffff33;
      }

      .time-separator {
        color: #ffbc47;
        font-size: 18px;
        font-weight: 600;
      }
    }
  }
  .component-section {
    width: 100%;
    height: 100%;
  }
}
</style>
