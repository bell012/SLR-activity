<script setup lang="ts">
import checkinDecorationLeft from '@/assets/svg/checkin/checkin-decoration-left.svg'
import checkinDecorationRight from '@/assets/svg/checkin/checkin-decoration-right.svg'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    day?: string | number
    depositTarget?: number | string | null
    depositProgress?: number | string | null
    betTarget?: number | string | null
    betProgress?: number | string | null
    symbol?: string
    isShowDay?: boolean
  }>(),
  {
    day: '',
    depositTarget: 0,
    depositProgress: 0,
    betTarget: 0,
    betProgress: 0,
    symbol: '',
    isShowDay: true
  }
)

const normalizeAmount = (value: number | string | null | undefined) => {
  const numeric = Number(value)
  return Number.isFinite(numeric) && numeric > 0 ? numeric : 0
}

const formatDayLabel = (value?: string | number) => {
  const text = String(value ?? '').trim()
  if (!text) return '--'
  return /day/i.test(text) ? text.toUpperCase() : `${text}DAY`
}

const formatScaleValue = (value: number) => {
  return props.symbol ? `${props.symbol}${value}` : `${value}`
}

const formatRequirementValue = (value: number) => {
  return props.symbol ? `${props.symbol}${value}` : `${value}`
}

const depositTargetValue = computed(() => normalizeAmount(props.depositTarget))
const betTargetValue = computed(() => normalizeAmount(props.betTarget))
const depositProgressValue = computed(() => normalizeAmount(props.depositProgress))
const betProgressValue = computed(() => normalizeAmount(props.betProgress))
const hasDeposit = computed(() => depositTargetValue.value > 0)
const hasBet = computed(() => betTargetValue.value > 0)
const depositPercent = computed(() => {
  if (!depositTargetValue.value) return 0
  return Math.min(100, (depositProgressValue.value / depositTargetValue.value) * 100)
})
const betPercent = computed(() => {
  if (!betTargetValue.value) return 0
  return Math.min(100, (betProgressValue.value / betTargetValue.value) * 100)
})
</script>

<template>
  <div class="card-requirements">
    <div v-if="isShowDay" class="card-day-row">
      <img :src="checkinDecorationLeft" alt="" aria-hidden="true" class="card-decor" />
      <span class="card-day-text">{{ formatDayLabel(day) }}</span>
      <img :src="checkinDecorationRight" alt="" aria-hidden="true" class="card-decor" />
    </div>
    <div class="card-conditions">
      <div v-if="hasDeposit" class="card-condition">
        <div class="card-condition-head">
          <span class="card-condition-title">Deposit:</span>
          <span class="card-condition-value">
            {{ formatRequirementValue(depositTargetValue) }}
          </span>
        </div>
        <div class="card-progress">
          <div class="card-progress-scale">
            <span class="card-progress-min">{{ formatScaleValue(0) }}</span>
            <span class="card-progress-max">{{ formatScaleValue(depositTargetValue) }}</span>
          </div>
          <div class="card-progress-track">
            <span class="card-progress-fill" :style="{ width: `${depositPercent}%` }" />
          </div>
        </div>
      </div>
      <div v-if="hasBet" class="card-condition">
        <div class="card-condition-head">
          <span class="card-condition-title">Valid Bet:</span>
          <span class="card-condition-value">
            {{ formatRequirementValue(betTargetValue) }}
          </span>
        </div>
        <div class="card-progress">
          <div class="card-progress-scale">
            <span class="card-progress-min">{{ formatScaleValue(0) }}</span>
            <span class="card-progress-max">{{ formatScaleValue(betTargetValue) }}</span>
          </div>
          <div class="card-progress-track">
            <span class="card-progress-fill" :style="{ width: `${betPercent}%` }" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.card-requirements {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;
}

.card-day-row {
  margin-top: 24%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.card-decor {
  width: 32px;
  height: 20px;
  filter: drop-shadow(0px 4px 4px #f4a464);
}

.card-day-text {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: clamp(18px, 4vw, 28px);
  line-height: 1.2;
  text-align: center;
  background: linear-gradient(180deg, #ffffff 23.08%, #ffe5d2 80.22%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0px 4px 4px #f4a464;
}

.card-conditions {
  width: 80%;
  margin-top: 5%;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.card-condition {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.card-condition-head {
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 8px;
}

.card-condition-title {
  font-family: 'Inter', sans-serif;
  font-size: clamp(14px, 3.2vw, 18px);
  font-weight: 500;
  color: #bc6513;
}

.card-condition-value {
  font-family: 'Inter', sans-serif;
  font-size: clamp(14px, 3.2vw, 18px);
  font-weight: 600;
  color: #ff830e;
}

.card-progress {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.card-progress-track {
  position: relative;
  height: 10px;
  border-radius: 999px;
  background: #fcb777;
  border: 2px solid #ffe7d2;
  overflow: hidden;
}

.card-progress-fill {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  background: #ff830e;
  border-radius: 999px;
}

.card-progress-scale {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: 'Inter', sans-serif;
  font-size: clamp(12px, 2.8vw, 14px);
  color: #bc6513;
}
</style>
