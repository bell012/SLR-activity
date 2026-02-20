<script setup lang="ts">
import closeIcon from '@/static/ticket/close.png'
import { computed } from 'vue'
import CheckInConditionsPanel from './CheckInConditionsPanel.vue'

type ConditionsItem = {
  day?: number | string
  rechargeAmount?: number | string | null
  betAmount?: number | string | null
  depositProgress?: number | string | null
  betProgress?: number | string | null
}

const props = defineProps<{
  show: boolean
  item: ConditionsItem | null
  symbol?: string
  conditionRelation?: number | string | null
}>()

const emit = defineEmits<{
  'update:show': [boolean]
}>()

const normalizeAmount = (value: number | string | null | undefined) => {
  const numeric = Number(value)
  return Number.isFinite(numeric) && numeric > 0 ? numeric : 0
}

const hasDeposit = computed(() => normalizeAmount(props.item?.rechargeAmount) > 0)
const hasBet = computed(() => normalizeAmount(props.item?.betAmount) > 0)
const bothRequirements = computed(() => hasDeposit.value && hasBet.value)
const relationValue = computed(() => Number(props.conditionRelation))

const bottomTitle = computed(() => {
  if (!bothRequirements.value) return 'Complete the above tasks to check in'
  if (Number.isFinite(relationValue.value) && relationValue.value === 1) {
    return 'Complete the above tasks to check in'
  }
  return 'Complete any requirement to check in'
})
</script>

<template>
  <div v-if="show" class="popup-overlay" @click="emit('update:show', false)">
    <div class="conditions-dialog" @click.stop>
      <button
        class="conditions-close"
        type="button"
        aria-label="Close"
        @click="emit('update:show', false)"
      >
        <img :src="closeIcon" alt="Close" />
      </button>

      <div class="popup-content">
        <h2 class="title">Daily Check-in Task</h2>
        <CheckInConditionsPanel
          v-if="item"
          :is-show-day="false"
          :day="item.day"
          :deposit-target="item.rechargeAmount"
          :deposit-progress="item.depositProgress"
          :bet-target="item.betAmount"
          :bet-progress="item.betProgress"
          :symbol="symbol"
          class="conditions-panel"
        />
        <h2 class="bottom—title">{{ bottomTitle }}</h2>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #00000099;
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  box-sizing: border-box;
}

.conditions-dialog {
  position: relative;
  width: 100%;
  height: 320px;
  background: url('@/assets/common/checkin-popup-bg.png') no-repeat;
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 30px 30px;
}
.popup-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  .title {
    font-size: 22px;
    font-weight: 800;
    color: #f10e3d;
    text-align: center;
  }
  .bottom—title {
    font-size: 13px;
    font-weight: 400;
    color: #bc6513;
    text-align: center;

    // width: 100%;
    margin-top: 10px;
  }
}
.conditions-close {
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 25px;
  height: 25px;
  border: none;
  background: transparent;
  cursor: pointer;
}

.conditions-panel {
  position: relative;
  inset: auto;
  width: 75%;
  margin-top: 0;
}

:deep(.card-requirements) {
  position: relative;
}

:deep(.card-day-row) {
  margin-top: 0;
}

:deep(.card-conditions) {
  width: 100%;
  margin-top: 12px;
}
</style>
