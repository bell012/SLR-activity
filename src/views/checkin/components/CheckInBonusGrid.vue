<script setup lang="ts">
import checkinTicketDefault from '@/assets/svg/checkin/checkin-ticket-default.svg'

defineProps<{
  list: { day: string; amount: string }[]
}>()
</script>

<template>
  <div class="bonus-grid">
    <div v-for="item in list" :key="item.day" class="bonus-card">
      <img :src="checkinTicketDefault" alt="ticket" class="ticket" />
      <div class="bonus-info">
        <span class="bonus-day">{{ item.day }}</span>
        <span class="bonus-amount">{{ item.amount }}</span>
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
