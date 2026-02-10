<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import checkinCardMain from '@/assets/svg/checkin/checkin-card-main.svg'
import checkinVectorDivider from '@/assets/svg/checkin/checkin-vector-divider.svg'
import type { AnimationItem } from 'lottie-web'
import lottie from 'lottie-web'

import cardFlipAnim from '@/assets/lottie/checkin/checkin-card-flip.json'
import cardIdleAnim from '@/assets/lottie/checkin/checkin-card-idle.json'

const props = defineProps<{
  current: { day: string }
  prev: { day: string } | null
  next: { day: string } | null
  direction: 'next' | 'prev' | null
  isResetting: boolean
}>()

const emit = defineEmits<{
  prev: []
  next: []
  centerClick: []
  pointerdown: [PointerEvent]
  pointerup: [PointerEvent]
  pointercancel: []
}>()

// eslint-disable-next-line no-undef
const cardLottieEl = ref<HTMLDivElement | null>(null)
const isFlipping = ref(false)
const isFlipped = ref(false)
let lottieIns: AnimationItem | null = null
const DAY_TEXT_LAYER_NAME = 'dayText'
const idleScale = 0.97
const flipScale = 1.1
// const lottieScale = computed(() => (isFlipping.value ? flipScale : idleScale))
const idleOffsetY = -10
const flipOffsetY = -10 // 往上 10px
const lottieStyle = computed(() => {
  const scale = isFlipping.value ? flipScale : idleScale
  const offsetY = isFlipping.value ? flipOffsetY : idleOffsetY
  return { transform: `translateY(${offsetY}px) scale(${scale})` }
})

const applyLottieText = (text: string) => {
  if (!lottieIns) return
  const renderer = lottieIns.renderer as any
  const elements = renderer?.elements || []
  const textLayer = elements.find(
    (el: any) => el?.data?.ty === 5 && el?.data?.nm === DAY_TEXT_LAYER_NAME
  )
  textLayer?.updateDocumentData?.({ t: text })
}

const bindTextOnLoad = () => {
  if (!lottieIns) return
  lottieIns.addEventListener('DOMLoaded', () => {
    applyLottieText(props.current.day)
  })
}

const onCenterClick = () => {
  emit('centerClick')
}

const playIdle = () => {
  if (!cardLottieEl.value || isFlipped.value) return
  lottieIns?.destroy()
  lottieIns = lottie.loadAnimation({
    container: cardLottieEl.value,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    animationData: cardIdleAnim
  })
  bindTextOnLoad()
}

const playFlip = () => {
  if (!cardLottieEl.value || isFlipping.value || isFlipped.value) return
  isFlipping.value = true
  lottieIns?.destroy()
  lottieIns = lottie.loadAnimation({
    container: cardLottieEl.value,
    renderer: 'svg',
    loop: false,
    autoplay: true,
    animationData: cardFlipAnim
  })
  bindTextOnLoad()
  lottieIns.addEventListener('complete', () => {
    isFlipping.value = false
    isFlipped.value = true
    lottieIns?.destroy()
    lottieIns = null
  })
}

onMounted(playIdle)
onBeforeUnmount(() => lottieIns?.destroy())

watch(
  () => props.current.day,
  (value) => {
    isFlipped.value = false
    isFlipping.value = false
    playIdle()
    applyLottieText(value)
  }
)

defineExpose({ playFlip })
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
    >
      <span class="card-day">{{ prev.day }}</span>
    </div>
    <div
      class="card card-center"
      :style="{ backgroundImage: isFlipped ? `url(${checkinCardMain})` : '' }"
      @click="onCenterClick"
    >
      <div v-show="!isFlipped" ref="cardLottieEl" class="card-lottie" :style="lottieStyle" />
      <img
        v-show="isFlipped"
        :src="checkinVectorDivider"
        alt=""
        aria-hidden="true"
        class="card-divider"
      />

      <!-- <span class="card-day">{{ current.day }}</span> -->
    </div>
    <div
      v-if="next"
      class="card card-right"
      :style="{ backgroundImage: `url(${checkinCardMain})` }"
      @click="emit('next')"
    >
      <span class="card-day">{{ next.day }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card-lottie {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  transform-origin: center;
}

.card-divider {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 58px;
  height: 49px;
  transform: translate(-50%, -50%);
  z-index: 1;
  pointer-events: none;
}
.card-day {
  position: relative;
  z-index: 2;
}

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
  display: flex;
  align-items: center;
  justify-content: center;
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
  left: -30.1%;
  top: 9%;
  opacity: 0.9;
}

.card-center {
  width: 50.9%;
  height: 100%;
  left: 24.5%;
  top: 0;
  transform: scale(1.05);
  transform-origin: center;
  z-index: 2;
}

.card .card-day {
  font-family: 'Inter', sans-serif;
  font-size: 25px;
  font-weight: 700;
  background: linear-gradient(180deg, #ffffff 0%, #ffe5d2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  // text-shadow: 0 4px 4px #f4a464;
}

.card-right {
  width: 46.3%;
  height: 91%;
  left: 83.8%;
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

<!-- checkin-card-idle.json（默认跳动）
checkin-card-flip.json（点击翻牌） -->
