<!-- 金蛋组件 -->
<template>
  <div class="jindan-container">
    <!-- 金蛋展示区 -->
    <div class="jindan-box">
      <div class="jindan-grid">
        <div class="jindan-row">
          <div v-for="i in 2" :key="`row1-${i}`" class="jindan-item">
            <img src="@/static/ticket/jindan.png" alt="金蛋" class="jindan-img" />
          </div>
        </div>

        <div class="jindan-row">
          <div v-for="i in 3" :key="`row2-${i}`" class="jindan-item">
            <img src="@/static/ticket/jindan.png" alt="金蛋" class="jindan-img" />
          </div>
        </div>

        <div class="jindan-row">
          <div v-for="i in 3" :key="`row3-${i}`" class="jindan-item">
            <img src="@/static/ticket/jindan.png" alt="金蛋" class="jindan-img" />
          </div>
        </div>
      </div>

      <div class="smash-btn" @click="showSmallPopup">
        <span class="btn-text">Smash</span>
      </div>
    </div>

    <!-- 进度条 -->
    <div class="progress-wrapper">
      <Progress :percentage="50" />
    </div>

    <!-- 中奖列表 -->
    <Wins />

    <div class="test-buttons">
      <button @click="showSmallPopup">显示小弹窗</button>
      <button @click="showBigPopup">显示大弹窗</button>
    </div>

    <!-- 小弹窗 -->
    <PopupSmall
      :visible="smallPopupVisible"
      subtitle="You've Earned Bonus"
      amount="100.00"
      button-text="NEXT ROUND"
      @close="smallPopupVisible = false"
      @action="handleSmallAction"
    />

    <!-- 大弹窗 -->
    <PopupBig
      :visible="bigPopupVisible"
      subtitle="You've Earned Bonus"
      :rewards="rewardsList"
      button-text="USE NOW"
      @close="bigPopupVisible = false"
      @action="handleBigAction"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Progress from '../progress.vue'
import Wins from '../wins.vue'
import PopupSmall from '../PopupSmall.vue'
import PopupBig from '../PopupBig.vue'

const smallPopupVisible = ref(false)
const bigPopupVisible = ref(false)

const rewardsList = ref([
  {
    icon: '/src/static/ticket/card_jindan.png',
    description: 'Register and get ₱3-₱888 bonus!',
    quantity: 1,
    bgColor: '#FEE554'
  },
  {
    icon: '/src/static/ticket/card_zhuanpan.png',
    description: 'Register and get ₱3-₱888 bonus!',
    quantity: 10,
    bgColor: '#FA9CFF'
  },
  {
    icon: '/src/static/ticket/card_hongbao.png',
    description: 'Register and get ₱3-₱888 bonus!',
    quantity: 5,
    bgColor: '#fba1a4'
  },
  {
    icon: '/src/static/ticket/card_xianjin.png',
    description: 'Register and get ₱3-₱888 bonus!',
    quantity: 3,
    bgColor: '#9affb1'
  }
])

const showSmallPopup = () => {
  smallPopupVisible.value = true
}

const showBigPopup = () => {
  bigPopupVisible.value = true
}

const handleSmallAction = () => {
  console.log('小弹窗按钮点击')
  smallPopupVisible.value = false
}

const handleBigAction = () => {
  console.log('大弹窗按钮点击')
  bigPopupVisible.value = false
}
</script>

<style lang="scss" scoped>
.jindan-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .progress-wrapper {
    width: 100%;
    height: 18px;
    border-radius: 10px;
    background: #00000066;
    border: 1px solid #ffffff4d;
    box-shadow: 0px 6px 12px 0px #00000040 inset;
    backdrop-filter: blur(18px);
    padding: 2px;
    margin: 10px 0;
  }

  .jindan-box {
    width: 100%;
    padding: 20px;
    background: url('@/static/ticket/jindanBG.png') no-repeat;
    background-size: 100% 100%;
    border-radius: 20px;

    .jindan-grid {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 15px;
      margin-bottom: 20px;

      .jindan-row {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 15px;

        .jindan-item {
          width: 80px;
          height: 92px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;

          .jindan-img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
        }
      }
    }

    .smash-btn {
      width: 100%;
      height: 40px;
      background: url('@/static/ticket/jindan_btn.png') no-repeat;
      background-size: 100% 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      .btn-text {
        font-size: 18px;
        font-weight: 700;
        background: linear-gradient(180deg, #ffffff 32.31%, #ffc37e 80%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
    }
  }

  .test-buttons {
    display: flex;
    gap: 10px;
    margin-top: 20px;
    justify-content: center;

    button {
      padding: 10px 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      font-weight: bold;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
      }

      &:active {
        transform: translateY(0);
      }
    }
  }
}
</style>
