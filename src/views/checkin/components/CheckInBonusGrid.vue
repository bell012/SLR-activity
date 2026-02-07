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
