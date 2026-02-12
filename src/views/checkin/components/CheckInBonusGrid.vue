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
}

const props = defineProps<{
  list: BonusItem[]
  symbol?: string
}>()

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
  return /day/i.test(text) ? text : `DAY ${text}`
}

const formatAmount = (item: BonusItem) => {
  const hasRange = Array.isArray(item?.amountRange) && item.amountRange.length >= 2
  const withSymbol = (value: number | string | null | undefined) => {
    if (value == null || value === '') return '--'
    return props.symbol ? `${props.symbol}${value}` : `${value}`
  }

  if (hasRange && item.amountRange?.[0] !== item.amountRange?.[1]) {
    const min = item.amountRange?.[0]
    const max = item.amountRange?.[1]
    if (props.symbol) return `${props.symbol}${min}～${props.symbol}${max}`
    return `${min}～${max}`
  }

  if (item?.rewardAmount != null && item.rewardAmount !== '') {
    return withSymbol(item.rewardAmount)
  }

  return '--'
}
</script>

<template>
  <div class="bonus-grid">
    <div
      v-for="(item, index) in props.list"
      :key="item.ticketId ?? item.day ?? index"
      class="bonus-card"
    >
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
