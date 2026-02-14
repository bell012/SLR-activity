<script setup lang="ts">
import iconCashEvent from '@/assets/common/icon-cash-event.svg'
import iconGoldenEgg from '@/assets/common/icon-golden-egg.svg'
import iconLuckyWheel from '@/assets/common/icon-lucky-wheel.svg'
import iconRedPacket from '@/assets/common/icon-red-packet.svg'
import checkinTicketDefault from '@/assets/svg/checkin/checkin-ticket-default.svg'

type BonusItem = {
  day?: number | string
  ticketId?: number | string
  ticketType?: number | string | null
  betAmount?: number | string | null
  rechargeAmount?: number | string | null
  amountRange?: number[] | null
  rewardAmount?: number | string | null
  receivedAmount?: number | string | null
  isReceived?: boolean | null
}

const props = defineProps<{
  list: BonusItem[]
  symbol?: string
}>()

const emit = defineEmits<{
  itemClick: [BonusItem]
}>()

const hasRequirements = (item: BonusItem) => {
  const rechargeTarget = Number(item?.rechargeAmount)
  const betTarget = Number(item?.betAmount)
  return (
    (Number.isFinite(rechargeTarget) && rechargeTarget > 0) ||
    (Number.isFinite(betTarget) && betTarget > 0)
  )
}

const resolveTicketIcon = (item: BonusItem) => {
  const type = item?.ticketType == null ? null : Number(item.ticketType)
  if (type === 3) return iconGoldenEgg
  if (type === 1) return iconCashEvent
  if (type === 2) return iconRedPacket
  if (type === 4) return iconLuckyWheel
  return checkinTicketDefault
}

const formatDay = (item: BonusItem) => {
  if (item?.day == null || item.day === '') return '--'
  const text = String(item.day).trim()
  return /day/i.test(text) ? text : `${text}DAY`
}

const formatAmount = (item: BonusItem) => {
  const hasRange = Array.isArray(item?.amountRange) && item.amountRange.length >= 2
  const formatK = (value: number | string | null | undefined) => {
    const numeric = Number(value)
    if (Number.isFinite(numeric) && numeric >= 1000 && numeric % 1000 === 0) {
      return `${numeric / 1000}K`
    }
    return value == null ? '--' : String(value)
  }
  const withSymbol = (value: number | string | null | undefined) => {
    if (value == null || value === '') return '--'
    return props.symbol ? `${props.symbol}${value}` : `${value}`
  }

  if (item?.isReceived && item.receivedAmount != null && item.receivedAmount !== '') {
    return withSymbol(item.receivedAmount)
  }

  if (hasRange && item.amountRange?.[0] !== item.amountRange?.[1]) {
    const min = item.amountRange?.[0]
    const max = item.amountRange?.[1]
    const minText = formatK(min)
    const maxText = formatK(max)
    if (props.symbol) return `${props.symbol}${minText}～${props.symbol}${maxText}`
    return `${minText}～${maxText}`
  }

  if (item?.rewardAmount != null && item.rewardAmount !== '') {
    return withSymbol(item.rewardAmount)
  }

  return '--'
}

const handleItemClick = (item: BonusItem) => {
  if (item?.isReceived) return
  if (!hasRequirements(item)) return
  emit('itemClick', item)
}
</script>

<template>
  <div class="bonus-grid">
    <div
      v-for="(item, index) in props.list"
      :key="item.ticketId ?? item.day ?? index"
      :class="['bonus-card', { 'is-received': item.isReceived }]"
      role="button"
      @click.stop="handleItemClick(item)"
    >
      <div v-if="item.isReceived" class="corner-badge">
        <div class="corner-bg"></div>
        <div class="corner-text">Claimed</div>
      </div>
      <img :src="resolveTicketIcon(item)" alt="ticket" class="ticket" />
      <div class="bonus-info">
        <span class="bonus-day">{{ formatDay(item) }}</span>
        <span class="bonus-amount">{{ formatAmount(item) }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.bonus-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 7px;
  margin-top: 10px;
}

.bonus-card {
  position: relative;
  width: 100%;
  min-height: 51.62px;
  background: #ffdfe1;
  border: 2px solid #ffffff;
  border-radius: 12px;
  padding: 7.5px 10px;
  display: flex;
  align-items: center;
  gap: 7px;
  box-sizing: border-box;
}

.bonus-card.is-received {
  cursor: not-allowed;
  pointer-events: none; /* 核心：禁止点击 */
  opacity: 0.6; /* 核心：视觉变淡 */
}

.corner-badge {
  position: absolute;
  width: 55px;
  height: 18px;
  right: 1px;
  top: 1px;
  z-index: 1;
  pointer-events: none;
}

.corner-bg {
  position: absolute;
  left: 0;
  top: 0;
  width: 55px;
  height: 18px;
  background: #a7e5ab;
  border-radius: 0px 11px 0px 13px;
}

.corner-text {
  position: absolute;
  left: 9px;
  top: 3px;
  width: 39px;
  height: 12px;
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 10px;
  line-height: 12px;
  display: flex;
  align-items: center;
  color: #ffffff;
}

.ticket {
  width: 45.38px;
  height: 37px;
}

.bonus-info {
  display: flex;
  flex-direction: column;
  gap: 2.5px;
}

.bonus-day {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: #d62847;
}

.bonus-amount {
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: #d62847;
}
</style>
