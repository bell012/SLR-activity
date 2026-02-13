<script setup lang="ts">
import CheckInConditionsPanel from './CheckInConditionsPanel.vue'
import closeIcon from '@/assets/common/close-icon.svg'

type ConditionsItem = {
  day?: number | string
  rechargeAmount?: number | string | null
  betAmount?: number | string | null
  depositProgress?: number | string | null
  betProgress?: number | string | null
}

defineProps<{
  show: boolean
  item: ConditionsItem | null
  symbol?: string
}>()

const emit = defineEmits<{
  'update:show': [boolean]
}>()
</script>

<template>
  <van-popup
    :show="show"
    :overlay="true"
    overlay-class="conditions-overlay"
    :close-on-click-overlay="true"
    class="conditions-popup"
    @update:show="(value: boolean) => emit('update:show', value)"
  >
    <div class="conditions-dialog">
      <button
        class="conditions-close"
        type="button"
        aria-label="Close"
        @click="emit('update:show', false)"
      >
        <img :src="closeIcon" alt="Close" />
      </button>
      <CheckInConditionsPanel
        v-if="item"
        :day="item.day"
        :deposit-target="item.rechargeAmount"
        :deposit-progress="item.depositProgress"
        :bet-target="item.betAmount"
        :bet-progress="item.betProgress"
        :symbol="symbol"
        class="conditions-panel"
      />
    </div>
  </van-popup>
</template>

<style scoped lang="scss">
.conditions-popup {
  padding: 0;
  background: transparent;
}

:deep(.conditions-overlay) {
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(12px);
}

.conditions-dialog {
  position: relative;
  width: 320px;
  max-width: 88vw;
  padding: 24px 16px;
  border-radius: 18px;
  background: #fff7f0;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.conditions-close {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 50%;
  background: rgba(146, 146, 146, 0.1);
  border: 1px solid rgba(149, 147, 147, 0.4);
  cursor: pointer;
}

.conditions-panel {
  position: relative;
  inset: auto;
  width: 100%;
  margin-top: 8px;
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
