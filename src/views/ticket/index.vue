<template>
  <div class="ticketBox">
    <div class="title-section">
      <img :src="titleImg" alt="title" class="title-img" />
    </div>

    <div class="nav-section">
      <img :src="btnLeft" alt="left" class="nav-arrow" />

      <div class="icon-list">
        <div
          v-for="(item, index) in iconList"
          :key="index"
          class="icon-item"
          :class="{ active: activeIndex === index }"
          @click="handleIconClick(index)"
        >
          <img :src="item.icon" :alt="item.name" class="icon-img" />
        </div>
      </div>

      <img :src="btnRight" alt="right" class="nav-arrow" />
    </div>

    <div class="text-section">Register and get ₱3-₱888 bonus!</div>

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
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Jindan from './component/jindan/index.vue'
import Zhuanpan from './component/zhuanpan/index.vue'
import Hongbao from './component/hongbao/index.vue'
import Xianjin from './component/xianjin/index.vue'
import titleImg from '@/static/ticket/title.png'
import btnLeft from '@/static/ticket/btn_left.png'
import btnRight from '@/static/ticket/btn_right.png'
import alarmImg from '@/static/ticket/alarm.png'
import icon1 from '@/static/ticket/icon_1.png'
import icon2 from '@/static/ticket/icon_2.png'
import icon3 from '@/static/ticket/icon_3.png'
import icon4 from '@/static/ticket/icon_4.png'

// 图标列表
const iconList = [
  {
    icon: icon1,
    name: 'jindan',
    component: Jindan
  },
  {
    icon: icon2,
    name: 'zhuanpan',
    component: Zhuanpan
  },
  {
    icon: icon3,
    name: 'hongbao',
    component: Hongbao
  },
  {
    icon: icon4,
    name: 'xianjin',
    component: Xianjin
  }
]

const activeIndex = ref(0)
const currentComponent = computed(() => iconList[activeIndex.value].component)
const handleIconClick = (index: number) => {
  activeIndex.value = index
}
</script>

<style lang="scss" scoped>
.ticketBox {
  width: 100%;
  min-height: 100vh;
  background-color: #342c54;
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

    .nav-arrow {
      width: 20px;
      height: 20px;
      cursor: pointer;
    }

    .icon-list {
      flex: 1;
      display: flex;
      padding: 0 10px;
      gap: 10px;

      .icon-item {
        display: flex;
        align-items: center;
        cursor: pointer;

        .icon-img {
          width: auto;
          height: 60px;
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
    min-height: 400px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 20px;
    padding: 20px;
  }
}
</style>
