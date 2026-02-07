<script setup lang="ts">
import { ref } from 'vue'
import { useCheckInSlider } from './composables/useCheckInSlider'

import checkinBg from '@/assets/svg/checkin/checkin-bg.svg'
import checkinCardMain from '@/assets/svg/checkin/checkin-card-main.svg'
import checkinGiftBox from '@/assets/svg/checkin/checkin-gift-box.svg'
import checkinTicketDefault from '@/assets/svg/checkin/checkin-ticket-default.svg'

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

      <h1 class="title">CHECK-IN EVENT</h1>
      <p class="subtitle">Check in daily and meet the requiements to claim rewards</p>

      <div
        class="card-deck"
        :class="[
          direction === 'next' ? 'is-next' : '',
          direction === 'prev' ? 'is-prev' : '',
          isResetting ? 'is-resetting' : ''
        ]"
        @pointerdown="onPointerDown"
        @pointerup="onPointerUp"
        @pointercancel="onPointerCancel"
      >
        <div
          v-if="prevCard"
          class="card card-left"
          :style="{ backgroundImage: `url(${checkinCardMain})` }"
          @click="slide('prev')"
        />
        <div class="card card-center" :style="{ backgroundImage: `url(${checkinCardMain})` }">
          <span class="card-day">{{ currentCard.day }}</span>
        </div>
        <div
          v-if="nextCard"
          class="card card-right"
          :style="{ backgroundImage: `url(${checkinCardMain})` }"
          @click="slide('next')"
        />
      </div>

      <section class="bonus-section">
        <div class="bonus-header">
          <img :src="checkinGiftBox" alt="gift box" class="gift-icon" />
          <span class="bonus-title">CHECK-IN BONUS</span>
          <div class="rules">
            <span class="rules-text">Check-In Rules</span>
            <span class="rules-arrow" aria-hidden="true" />
          </div>
        </div>
        <p class="bonus-subtitle">Cumulative check-ins earn more rewards</p>

        <div class="bonus-grid">
          <div v-for="item in bonusList" :key="item.day" class="bonus-card">
            <img :src="checkinTicketDefault" alt="ticket" class="ticket" />
            <div class="bonus-info">
              <span class="bonus-day">{{ item.day }}</span>
              <span class="bonus-amount">{{ item.amount }}</span>
            </div>
          </div>
        </div>
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
  font-size: calc(1rem / 3);
  padding: env(safe-area-inset-top) 0 env(safe-area-inset-bottom);
}

.check-in-modal {
  position: relative;
  width: 100%;
  margin-top: 3.52em;
  padding: 1.76em 1.44em 1.6em;
  border-radius: 2.72em 2.72em 0 0;
  background: linear-gradient(180deg, #ff6c69 0%, #ffc1bf 100%);
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
  gap: 0.8em;
}

.start-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 2.4em;
  padding: 0 1.6em;
  background: rgba(255, 247, 247, 0.5);
  border-radius: 2.4em;
  font-family: 'Inter', sans-serif;
  font-size: 1.04em;
  color: #f15e62;
}

.back-btn {
  width: 3.04em;
  height: 3.04em;
  border-radius: 999px;
  background: rgba(244, 122, 122, 0.2);
  border: 1px solid #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  width: 1.28em;
  height: 1.33em;
  position: relative;
}

.back-icon::before,
.back-icon::after {
  content: '';
  position: absolute;
  width: 0.19em;
  border-radius: 90px;
  background: #d66666;
  left: 50%;
  top: 50%;
}

.back-icon::before {
  height: 0.85em;
  transform: translate(-180%, -10%) rotate(-50deg);
}

.back-icon::after {
  height: 1.46em;
  transform: translate(-20%, -50%) rotate(30deg);
}

.title {
  position: relative;
  margin-top: 0.8em;
  font-family: 'AaHouDiHei', 'Inter', sans-serif;
  font-size: 2.4em;
  color: #ffffff;
  z-index: 2;
  -webkit-text-stroke: 6px #ffa6a0;
  text-shadow: none;
}

.subtitle {
  position: relative;
  margin-top: 0.2em;
  font-family: 'Inter', sans-serif;
  font-size: 0.96em;
  color: #f19791;
  z-index: 2;
}

.card-deck {
  position: relative;
  width: 100%;
  height: 20.48em;
  margin-top: 1em;
  z-index: 2;
  touch-action: pan-y;
}

.card {
  position: absolute;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  transition:
    left 0.36s ease,
    top 0.36s ease,
    width 0.36s ease,
    height 0.36s ease,
    opacity 0.36s ease;
}

.card-left {
  width: 46.3%;
  height: 91%;
  left: -27.1%;
  top: 9%;
  opacity: 0.9;
}

.card-center {
  width: 50.9%;
  height: 100%;
  left: 24.5%;
  top: 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  z-index: 2;
}

.card-center .card-day {
  margin-top: 12%;
  font-family: 'Inter', sans-serif;
  font-size: 2em;
  font-weight: 700;
  background: linear-gradient(180deg, #ffffff 0%, #ffe5d2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 4px 4px #f4a464;
}

.card-right {
  width: 46.3%;
  height: 91%;
  left: 80.8%;
  top: 9%;
  opacity: 0.9;
}

.card-deck.is-next .card-left {
  left: -62.2%;
  opacity: 0;
}

.card-deck.is-next .card-center {
  width: 46.3%;
  height: 91%;
  left: -27.1%;
  top: 9%;
}

.card-deck.is-next .card-right {
  width: 50.9%;
  height: 100%;
  left: 24.5%;
  top: 0;
}

.card-deck.is-prev .card-right {
  left: 124.4%;
  opacity: 0;
}

.card-deck.is-prev .card-center {
  width: 46.3%;
  height: 91%;
  left: 80.8%;
  top: 9%;
}

.card-deck.is-prev .card-left {
  width: 50.9%;
  height: 100%;
  left: 24.5%;
  top: 0;
}

.card-deck.is-resetting .card {
  transition: none;
}

.bonus-section {
  position: relative;
  z-index: 2;
  margin-top: 1.6em;
}

.bonus-header {
  display: flex;
  align-items: center;
  gap: 0.8em;
}

.gift-icon {
  width: 3.39em;
  height: 3.57em;
}

.bonus-title {
  font-family: 'AaHouDiHei', 'Inter', sans-serif;
  font-size: 1.36em;
  text-transform: uppercase;
  background: linear-gradient(90deg, #830404 0%, #000000 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.rules {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 0.4em;
}

.rules-text {
  font-family: 'Inter', sans-serif;
  font-size: 1.04em;
  color: #ff002d;
}

.rules-arrow {
  width: 1.2em;
  height: 1.2em;
  border-radius: 999px;
  border: 1px solid #ff002d;
  background: rgba(255, 255, 255, 0.2);
  position: relative;
}

.rules-arrow::before,
.rules-arrow::after {
  content: '';
  position: absolute;
  width: 0.12em;
  height: 0.5em;
  background: #ffffff;
  left: 0.52em;
  top: 0.32em;
}

.rules-arrow::before {
  transform: rotate(-45deg);
}

.rules-arrow::after {
  transform: rotate(45deg);
  top: 0.56em;
}

.bonus-subtitle {
  margin-top: 0.4em;
  font-family: 'Inter', sans-serif;
  font-size: 0.96em;
  color: #810404;
}

.bonus-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.56em;
  margin-top: 0.8em;
}

.bonus-card {
  width: 100%;
  min-height: 4.13em;
  background: #ffdfe1;
  border: 2px solid #ffffff;
  border-radius: 0.96em;
  padding: 0.6em 0.8em;
  display: flex;
  align-items: center;
  gap: 0.56em;
  box-sizing: border-box;
}

.ticket {
  width: 3.63em;
  height: 2.96em;
}

.bonus-info {
  display: flex;
  flex-direction: column;
  gap: 0.2em;
}

.bonus-day {
  font-family: 'Inter', sans-serif;
  font-size: 1.04em;
  color: #d62847;
}

.bonus-amount {
  font-family: 'Inter', sans-serif;
  font-size: 1.2em;
  font-weight: 600;
  color: #d62847;
}
</style>
