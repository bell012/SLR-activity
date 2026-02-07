<script setup lang="ts">
import checkinCardMain from '@/assets/svg/checkin/checkin-card-main.svg'

defineProps<{
  current: { day: string }
  prev: { day: string } | null
  next: { day: string } | null
  direction: 'next' | 'prev' | null
  isResetting: boolean
}>()

const emit = defineEmits<{
  prev: []
  next: []
  pointerdown: [PointerEvent]
  pointerup: [PointerEvent]
  pointercancel: []
}>()
</script>

<template>
  <div
    class="card-deck"
    :class="[
      direction === 'next' ? 'is-next' : '',
      direction === 'prev' ? 'is-prev' : '',
      isResetting ? 'is-resetting' : ''
    ]"
    @pointerdown="emit('pointerdown', $event)"
    @pointerup="emit('pointerup', $event)"
    @pointercancel="emit('pointercancel')"
  >
    <div
      v-if="prev"
      class="card card-left"
      :style="{ backgroundImage: `url(${checkinCardMain})` }"
      @click="emit('prev')"
    />
    <div class="card card-center" :style="{ backgroundImage: `url(${checkinCardMain})` }">
      <span class="card-day">{{ current.day }}</span>
    </div>
    <div
      v-if="next"
      class="card card-right"
      :style="{ backgroundImage: `url(${checkinCardMain})` }"
      @click="emit('next')"
    />
  </div>
</template>
