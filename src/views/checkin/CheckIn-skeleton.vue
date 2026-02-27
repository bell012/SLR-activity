<script setup lang="ts">
import checkinBg from '@/assets/svg/checkin/checkin-bg.svg'

const props = defineProps<{
  background?: string
}>()

const backgroundImage = props.background || checkinBg
</script>

<template>
  <div class="check-in-page">
    <div class="check-in-modal skeleton-modal">
      <div class="modal-bg" :style="{ backgroundImage: `url(${backgroundImage})` }" />

      <div class="skeleton-header">
        <div class="skeleton-pill" />
      </div>
      <div class="skeleton-title" />
      <div class="skeleton-subtitle" />
      <div class="skeleton-card" />

      <div class="skeleton-section">
        <div class="skeleton-row">
          <div class="skeleton-icon" />
          <div class="skeleton-line w-60" />
        </div>
        <div class="skeleton-line w-50" />
        <div class="skeleton-grid">
          <div v-for="n in 6" :key="n" class="skeleton-bonus-card">
            <div class="skeleton-ticket" />
            <div class="skeleton-col">
              <div class="skeleton-line w-40" />
              <div class="skeleton-line w-30" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.check-in-page {
  width: 100%;
  min-height: 100vh;
  background: #000;
  display: flex;
  justify-content: flex-start;
  align-items: stretch;
  font-size: 12.5px;
  padding: env(safe-area-inset-top) 0 env(safe-area-inset-bottom);
}

.check-in-modal {
  position: relative;
  width: 100%;
  max-width: 100%;
  margin-top: 44px;
  padding: 22px 18px 20px;
  border-radius: 34px 34px 0 0;
  overflow: hidden;
  isolation: isolate;
  box-sizing: border-box;
}

.skeleton-modal {
  background: #ffffff;
}

.skeleton-modal > :not(.modal-bg) {
  position: relative;
  z-index: 2;
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
  z-index: 1;
  pointer-events: none;
}

.skeleton-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.skeleton-pill {
  width: 120px;
  height: 24px;
  border-radius: 12px;
  background: #f2f3f5;
}

.skeleton-circle {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #f2f3f5;
}

.skeleton-title {
  width: 60%;
  height: 22px;
  border-radius: 8px;
  background: #f2f3f5;
  margin-bottom: 8px;
}

.skeleton-subtitle {
  width: 45%;
  height: 14px;
  border-radius: 6px;
  background: #f2f3f5;
  margin-bottom: 16px;
}

.skeleton-card {
  width: 60%;
  height: 256px;
  justify-self: center;
  border-radius: 20px;
  background: #f2f3f5;
  margin-bottom: 18px;
}

.skeleton-section {
  padding: 12px;
  border-radius: 16px;
  background: #fff7f7;
}

.skeleton-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.skeleton-icon {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: #f2f3f5;
}

.skeleton-line {
  height: 12px;
  border-radius: 6px;
  background: #f2f3f5;
}

.skeleton-line.w-60 {
  width: 60%;
}

.skeleton-line.w-50 {
  width: 50%;
  margin-bottom: 12px;
}

.skeleton-line.w-40 {
  width: 40px;
}

.skeleton-line.w-30 {
  width: 30px;
}

.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 7px;
}

.skeleton-bonus-card {
  min-height: 52px;
  border-radius: 12px;
  border: 2px solid #ffffff;
  background: #ffe5e7;
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 7.5px 10px;
  box-sizing: border-box;
}

.skeleton-ticket {
  width: 45px;
  height: 37px;
  border-radius: 8px;
  background: #f2f3f5;
}

.skeleton-col {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
</style>
