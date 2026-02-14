<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import checkinCardMain from '@/assets/svg/checkin/checkin-card-main.svg'
import checkinDecorationBg from '@/assets/svg/checkin/checkin-decoration-bg.svg'
import checkinVectorDivider from '@/assets/svg/checkin/checkin-vector-divider.svg'
import CheckInConditionsPanel from './CheckInConditionsPanel.vue'
import type { AnimationItem } from 'lottie-web'
import lottie from 'lottie-web'

import cardFlipAnim from '@/assets/lottie/checkin/checkin-card-flip.json'
import cardIdleAnim from '@/assets/lottie/checkin/checkin-card-idle.json'

const dayImageMap = import.meta.glob('@/assets/date/*.png', {
  eager: true,
  import: 'default'
}) as Record<string, string>

const dayImageLookup = Object.keys(dayImageMap).reduce(
  (acc, path) => {
    const filename = path.split('/').pop()?.replace('.png', '')
    if (filename) acc[filename.toUpperCase()] = dayImageMap[path]
    return acc
  },
  {} as Record<string, string>
)

const normalizeDayKey = (value?: string | number) => {
  const raw = (value ?? '').toString().toUpperCase().replace(/\s+/g, '')
  if (!raw) return ''
  if (raw.endsWith('DAY')) return raw
  const numeric = raw.match(/\d+/)?.[0]
  return numeric ? `${numeric}DAY` : raw
}

const resolveDayImage = (day?: string | number) => {
  const key = normalizeDayKey(day)
  return dayImageLookup[key] ?? dayImageLookup['1DAY'] ?? ''
}

type CardItem = {
  day?: string | number
  betAmount?: number | string | null
  rechargeAmount?: number | string | null
  depositProgress?: number | string | null
  betProgress?: number | string | null
  isReceived?: boolean | null
}

const props = defineProps<{
  current: CardItem
  prev: CardItem | null
  next: CardItem | null
  direction: 'next' | 'prev' | null
  isResetting: boolean
  symbol?: string
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
const idleScale = 0.97
const flipScale = 1.1
const dayImageScale = 0.7
const DAY_LAYER_NAME = '2DAY.png'
const IDLE_DAY_ASSET_ID = 'image_0'
const FLIP_DAY_ASSET_ID = 'image_1'
// const lottieScale = computed(() => (isFlipping.value ? flipScale : idleScale))
const idleOffsetY = -10
const flipOffsetY = -10 // 往上 10px
const lottieStyle = computed(() => {
  const scale = isFlipping.value ? flipScale : idleScale
  const offsetY = isFlipping.value ? flipOffsetY : idleOffsetY
  return { transform: `translateY(${offsetY}px) scale(${scale})` }
})

const isCurrentReceived = computed(() => Boolean(props.current?.isReceived))

const normalizeAmount = (value: number | string | null | undefined) => {
  const numeric = Number(value)
  return Number.isFinite(numeric) && numeric > 0 ? numeric : 0
}

const depositTarget = computed(() => normalizeAmount(props.current?.rechargeAmount))
const betTarget = computed(() => normalizeAmount(props.current?.betAmount))
const depositProgressValue = computed(() => normalizeAmount(props.current?.depositProgress))
const betProgressValue = computed(() => normalizeAmount(props.current?.betProgress))
const hasRequirements = computed(() => depositTarget.value > 0 || betTarget.value > 0)
const showRequirementsPanel = computed(
  () => hasRequirements.value && (isFlipped.value || isCurrentReceived.value)
)
const showDivider = computed(
  () => !hasRequirements.value && (isCurrentReceived.value || isFlipped.value)
)

const cardBackground = computed(() => {
  if (showRequirementsPanel.value) return `url(${checkinDecorationBg})`
  if (isCurrentReceived.value) return `url(${checkinCardMain})`
  if (!isFlipped.value) return ''
  return `url(${checkinCardMain})`
})

const applyDayLayerScale = (data: any, scale: number) => {
  if (!Array.isArray(data?.layers)) return data
  if (!Number.isFinite(scale) || scale === 1) return data
  const scaled = Math.max(0.01, scale) * 100
  return {
    ...data,
    layers: data.layers.map((layer: any) => {
      if (layer?.nm !== DAY_LAYER_NAME || !layer?.ks?.s) return layer
      if (layer.ks.s.a === 0 && Array.isArray(layer.ks.s.k)) {
        return {
          ...layer,
          ks: {
            ...layer.ks,
            s: {
              ...layer.ks.s,
              k: [scaled, scaled, layer.ks.s.k[2] ?? 100]
            }
          }
        }
      }
      if (layer.ks.s.a === 1 && Array.isArray(layer.ks.s.k)) {
        return {
          ...layer,
          ks: {
            ...layer.ks,
            s: {
              ...layer.ks.s,
              k: layer.ks.s.k.map((frame: any) =>
                frame?.s ? { ...frame, s: [scaled, scaled, frame.s[2] ?? 100] } : frame
              )
            }
          }
        }
      }
      return layer
    })
  }
}

const buildAnimationData = (source: any, dayImage: string, assetId: string) => {
  const assets = Array.isArray(source?.assets)
    ? source.assets.map((asset: any) =>
        asset.id === assetId ? { ...asset, p: dayImage, u: '', e: 0 } : asset
      )
    : source?.assets
  return applyDayLayerScale({ ...source, assets }, dayImageScale)
}

const getIdleAnimationData = () =>
  buildAnimationData(cardIdleAnim, resolveDayImage(props.current.day), IDLE_DAY_ASSET_ID)

const getFlipAnimationData = () =>
  buildAnimationData(cardFlipAnim, resolveDayImage(props.current.day), FLIP_DAY_ASSET_ID)

const onCenterClick = () => {
  if (isFlipped.value) return
  if (isCurrentReceived.value && hasRequirements.value) return
  if (isCurrentReceived.value) return
  emit('centerClick')
}

const playIdle = () => {
  if (!cardLottieEl.value || isFlipped.value || isCurrentReceived.value) return
  lottieIns?.destroy()
  lottieIns = lottie.loadAnimation({
    container: cardLottieEl.value,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    animationData: getIdleAnimationData()
  })
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
    animationData: getFlipAnimationData()
  })
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
  () => {
    isFlipped.value = false
    isFlipping.value = false
    lottieIns?.destroy()
    lottieIns = null
    playIdle()
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
      <img
        v-if="!prev.isReceived"
        :src="resolveDayImage(prev.day)"
        :alt="String(prev.day ?? '')"
        class="card-day-image"
        aria-hidden="true"
      />
      <img
        v-else
        :src="checkinVectorDivider"
        alt=""
        aria-hidden="true"
        class="card-divider card-divider-mini"
      />
    </div>
    <div
      class="card card-center"
      :style="{ backgroundImage: cardBackground }"
      @click="onCenterClick"
    >
      <div
        v-show="!isFlipped && !isCurrentReceived"
        ref="cardLottieEl"
        class="card-lottie"
        :style="lottieStyle"
      />
      <img
        v-show="showDivider"
        :src="checkinVectorDivider"
        alt=""
        aria-hidden="true"
        class="card-divider"
      />
      <CheckInConditionsPanel
        v-if="showRequirementsPanel"
        class="card-requirements"
        :day="current.day"
        :deposit-target="depositTarget"
        :deposit-progress="depositProgressValue"
        :bet-target="betTarget"
        :bet-progress="betProgressValue"
        :symbol="symbol"
      />

      <!-- <span class="card-day">{{ current.day }}</span> -->
    </div>
    <div
      v-if="next"
      class="card card-right"
      :style="{ backgroundImage: `url(${checkinCardMain})` }"
      @click="emit('next')"
    >
      <img
        v-if="!next.isReceived"
        :src="resolveDayImage(next.day)"
        :alt="String(next.day ?? '')"
        class="card-day-image"
        aria-hidden="true"
      />
      <img
        v-else
        :src="checkinVectorDivider"
        alt=""
        aria-hidden="true"
        class="card-divider card-divider-mini"
      />
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

.card-divider-mini {
  width: 40px;
  height: 34px;
}

.card-day {
  position: relative;
  z-index: 2;
}

.card-day-image {
  position: relative;
  z-index: 2;
  transform: translateY(2.2px) scale(0.372);
  transform-origin: center;
  display: block;
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
  font-size: 23px;
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
