<script setup lang="ts">
import { checkinApi } from '@/api'
import type { MbSignResult } from '@/api/checkin'
import { onMounted, ref } from 'vue'
import { useCheckInSlider } from './composables/useCheckInSlider'

import checkinBg from '@/assets/svg/checkin/checkin-bg.svg'
import checkinGiftBox from '@/assets/svg/checkin/checkin-gift-box.svg'
import rulesIcon from '@/assets/svg/checkin/rules-icon.svg'
import CheckInBonusGrid from './components/CheckInBonusGrid.vue'
import CheckInCardDeck from './components/CheckInCardDeck.vue'
const SLIDE_DURATION = 360

const bonusList = ref([
  { day: '1DAY', amount: '₱100' },
  { day: '2DAY', amount: '₱200' },
  { day: '3DAY', amount: '₱300' },
  { day: '4DAY', amount: '₱500' },
  { day: '5DAY', amount: '₱800' },
  { day: '6DAY', amount: '₱1000' },
  { day: '7DAY', amount: '₱1500' },
  { day: '8DAY', amount: '₱2000' },
  { day: '9DAY', amount: '₱2500' },
  { day: '10DAY', amount: '₱3000' }
])

const slider = useCheckInSlider(bonusList.value, SLIDE_DURATION)

const {
  isResetting,
  direction,
  currentCard,
  prevCard,
  nextCard,
  slide,
  onPointerDown,
  onPointerUp,
  onPointerCancel
} = slider

const activityId = 1
const verifyCode = ''
const signInfo = ref<MbSignResult | null>(null)

onMounted(async () => {
  try {
    const response = await checkinApi.mbSign({ activityId, verifyCode })
    signInfo.value = response.data.result
    console.log('mbSign 响应:', response)
  } catch (error) {
    console.error('mbSign 失败:', error)
  }
})
</script>

<template>
  <div class="check-in-page">
    <div class="check-in-modal">
      <div class="modal-bg" :style="{ backgroundImage: `url(${checkinBg})` }" />

      <header class="modal-header">
        <div class="start-tag">Starts On: January 30, 2026</div>
        <button class="back-btn" aria-label="Back">
          <span class="back-icon" />
        </button>
      </header>

      <div class="title">CHECK-IN EVENT</div>
      <p class="subtitle">Check in daily and meet the requiements to claim rewards</p>

      <CheckInCardDeck
        :current="currentCard"
        :prev="prevCard"
        :next="nextCard"
        :direction="direction"
        :is-resetting="isResetting"
        @prev="slide('prev')"
        @next="slide('next')"
        @pointerdown="onPointerDown"
        @pointerup="onPointerUp"
        @pointercancel="onPointerCancel"
      />

      <section class="bonus-section">
        <div class="bonus-header">
          <img :src="checkinGiftBox" alt="gift box" class="gift-icon" />
          <div class="title-container">
            <div class="title-wrapper">
              <span class="bonus-title">CHECK-IN BONUS</span>
              <div class="rules">
                <span class="rules-text">Check-In Rules</span>
                <img :src="rulesIcon" alt="rules" class="rules-icon" />
              </div>
            </div>
            <p class="bonus-subtitle">Cumulative check-ins earn more rewards</p>
          </div>
        </div>

        <CheckInBonusGrid :list="bonusList" />
      </section>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.check-in-page {
  min-height: 100vh;
  background: #000;
  display: flex;
  justify-content: center;
  font-size: 12.5px;
  padding: env(safe-area-inset-top) 0 env(safe-area-inset-bottom);
}

.check-in-modal {
  position: relative;
  width: 100%;
  margin-top: 44px;
  padding: 22px 18px 20px;
  border-radius: 34px 34px 0 0;
  overflow: hidden;
  isolation: isolate;
}

.modal-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center top;
  opacity: 1;
  z-index: 0;
}

.modal-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  opacity: 0.2;
  background: linear-gradient(0deg, #ff6c69 0%, #ffc1bf 100%);
  // inset: 30% 0 0 0;
  z-index: 1;
  pointer-events: none;
}

.check-in-modal::before {
  content: '';
  position: absolute;
  left: 5%;
  top: 12%;
  width: 90%;
  height: 60%;
  background: rgba(255, 255, 255, 0.6);
  filter: blur(150px);
  z-index: 1;
  pointer-events: none;
}

.modal-header {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.start-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  padding: 0 20px;
  background: rgba(255, 247, 247, 0.5);
  border-radius: 30px;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: #f15e62;
}

.back-btn {
  width: 38px;
  height: 38px;
  border-radius: 999px;
  background: rgba(244, 122, 122, 0.2);
  border: 1px solid #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  width: 16px;
  height: 16.62px;
  position: relative;
}

.back-icon::before,
.back-icon::after {
  content: '';
  position: absolute;
  width: 2.38px;
  border-radius: 90px;
  background: #d66666;
  left: 50%;
  top: 50%;
}

.back-icon::before {
  height: 10.62px;
  transform: translate(-180%, -10%) rotate(-50deg);
}

.back-icon::after {
  height: 18.25px;
  transform: translate(-20%, -50%) rotate(30deg);
}

.title {
  position: relative;
  margin-top: 10px;
  font-family: 'AaHouDiHei', 'Inter', sans-serif;
  font-weight: 400;
  font-size: 30px;
  font-style: normal;
  color: #ffffff;
  z-index: 2;
  -webkit-text-stroke: 2px #ffa6a0;

  text-shadow: none;
}

.subtitle {
  position: relative;
  margin-top: 2.5px;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: #f19791;
  z-index: 2;
}

.bonus-section {
  position: relative;
  z-index: 2;
  margin-top: 20px;
}

.bonus-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.gift-icon {
  width: 42.33px;
  height: 44.67px;
}
.title-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.title-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.bonus-title {
  font-family: 'AaHouDiHei', 'Inter', sans-serif;
  font-size: 17px;
  font-weight: 400;
  font-style: normal;
  color: #ffffff;
  text-transform: uppercase;
  background: linear-gradient(90deg, #830404 0%, #000000 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.rules {
  display: flex;
  align-items: center;
  gap: 5px;
}

.rules-text {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: #ff002d;
}

.rules-icon {
  width: 15px;
  height: 15px;
  display: block;
}

.bonus-subtitle {
  margin-top: 5px;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: #810404;
}
</style>
