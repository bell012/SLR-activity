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

<style lang="scss" scoped>
.card-deck {
  position: relative;
  width: 100%;
  height: 256px;
  margin-top: 12.5px;
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
  font-size: 25px;
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
</style>
