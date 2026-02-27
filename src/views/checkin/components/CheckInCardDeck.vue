<script setup lang="ts">
// Vue 组合式 API
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

// 静态资源（卡片背景、装饰、分割线）
import checkinCardMain from '@/assets/svg/checkin/checkin-card-main.svg'
import checkinDecorationBg from '@/assets/svg/checkin/checkin-decoration-bg.svg'
import checkinVectorDivider from '@/assets/svg/checkin/checkin-vector-divider.svg'
import type { AnimationItem } from 'lottie-web'
import lottie from 'lottie-web'
import CheckInConditionsPanel from './CheckInConditionsPanel.vue'

// Lottie 动画 JSON
import cardFlipAnim from '@/assets/lottie/checkin/checkin-card-flip.json'
import cardIdleAnim from '@/assets/lottie/checkin/checkin-card-idle.json'

// 批量导入 day 图片（1DAY.png / 2DAY.png ...）
const dayImageMap = import.meta.glob('@/assets/date/*.png', {
  eager: true, // 打包时就全部导入
  import: 'default' // 只要默认导出（资源 URL）
}) as Record<string, string>

// 把路径映射成 { '1DAY': url, '2DAY': url ... }，方便查找
const dayImageLookup = Object.keys(dayImageMap).reduce(
  (acc, path) => {
    const filename = path.split('/').pop()?.replace('.png', '')
    if (filename) acc[filename.toUpperCase()] = dayImageMap[path]
    return acc
  },
  {} as Record<string, string>
)

// 统一 day 的 key 格式：比如 1 / "1" / "1day" / "Day 1" → "1DAY"
const normalizeDayKey = (value?: string | number) => {
  const raw = (value ?? '').toString().toUpperCase().replace(/\s+/g, '')
  if (!raw) return ''
  if (raw.endsWith('DAY')) return raw
  const numeric = raw.match(/\d+/)?.[0]
  return numeric ? `${numeric}DAY` : raw
}

// 根据 day 找到对应图片，找不到则兜底 1DAY
const resolveDayImage = (day?: string | number) => {
  const key = normalizeDayKey(day)
  return dayImageLookup[key] ?? dayImageLookup['1DAY'] ?? ''
}

// 卡片数据结构
type CardItem = {
  day?: string | number
  betAmount?: number | string | null
  rechargeAmount?: number | string | null
  depositProgress?: number | string | null
  betProgress?: number | string | null
  isReceived?: boolean | null
}

// 入参：当前卡/上一张/下一张、滑动方向、是否重置、货币符号
const props = defineProps<{
  current: CardItem
  prev: CardItem | null
  next: CardItem | null
  direction: 'next' | 'prev' | null
  isResetting: boolean
  symbol?: string
}>()

// 事件：左右切换、点中心、指针事件（拖拽/滑动）
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

// 动画状态
const isFlipping = ref(false) // 正在播放翻牌动画
const isFlipped = ref(false) // 翻牌完成（进入“背面/条件面板”）
let lottieIns: AnimationItem | null = null

// 动画缩放/位移参数
const idleScale = 0.97
const flipScale = 1.1
const dayImageScale = 0.7

// Lottie 内部某层的名字（用于缩放/替换 day 图片）
const DAY_LAYER_NAME = '2DAY.png'
const SIGNED_ICON_LAYER_NAME = '已签到图标.png'
const CARD_MIDDLE_LAYER_NAME = '中间卡片.png'
const IDLE_DAY_ASSET_ID = 'image_0'
const FLIP_DAY_ASSET_ID = 'image_1'

// idle / flip 的 Y 方向偏移（让动画整体往上）
const idleOffsetY = -10
const flipOffsetY = -10

// 根据当前状态生成 transform（位移 + 缩放）
const lottieStyle = computed(() => {
  const scale = isFlipping.value ? flipScale : idleScale
  const offsetY = isFlipping.value ? flipOffsetY : idleOffsetY
  return { transform: `translateY(${offsetY}px) scale(${scale})` }
})

// 当前卡是否已领取
const isCurrentReceived = computed(() => Boolean(props.current?.isReceived))
const centerAnimationImage = computed(() =>
  isCurrentReceived.value ? checkinVectorDivider : resolveDayImage(props.current.day)
)

// 把各种金额/进度值转成数字，非法/<=0 则置 0
const normalizeAmount = (value: number | string | null | undefined) => {
  const numeric = Number(value)
  return Number.isFinite(numeric) && numeric > 0 ? numeric : 0
}

// 目标/进度值
const depositTarget = computed(() => normalizeAmount(props.current?.rechargeAmount))
const betTarget = computed(() => normalizeAmount(props.current?.betAmount))
const depositProgressValue = computed(() => normalizeAmount(props.current?.depositProgress))
const betProgressValue = computed(() => normalizeAmount(props.current?.betProgress))

// 是否存在“需要完成的条件”
const hasRequirements = computed(() => depositTarget.value > 0 || betTarget.value > 0)

// 条件面板展示：有条件，并且（翻牌中 / 翻牌后 / 已领取）
const showRequirementsPanel = computed(
  () => hasRequirements.value && !isCurrentReceived.value && (isFlipped.value || isFlipping.value)
)

// 分割线展示：已领取始终展示；未领取则在无条件且翻牌后展示
const showDivider = computed(
  () => isCurrentReceived.value || (!hasRequirements.value && isFlipped.value)
)
const isRequirementsFlipping = computed(
  () => hasRequirements.value && isFlipping.value && !isCurrentReceived.value
)

const getAnimationDurationMs = (data: any, fallback = 1000) => {
  const fr = Number(data?.fr)
  const ip = Number(data?.ip)
  const op = Number(data?.op)
  if (!Number.isFinite(fr) || fr <= 0 || !Number.isFinite(ip) || !Number.isFinite(op)) {
    return fallback
  }
  const duration = ((op - ip) / fr) * 1000
  return Number.isFinite(duration) && duration > 0 ? duration : fallback
}
const flipDurationMs = getAnimationDurationMs(cardFlipAnim, 1000)
const requirementsPanelStyle = computed(() => ({
  '--requirements-flip-duration': `${flipDurationMs}ms`
}))

// 中间卡片背景：根据状态切装饰背景/主背景/空
const cardBackground = computed(() => {
  if (isCurrentReceived.value) return `url(${checkinCardMain})`
  if (!isFlipped.value) return ''
  return `url(${checkinCardMain})`
})

// 给 Lottie 的某个 day 图层做缩放（改 JSON 的 layer.ks.s）
const applyDayLayerScale = (data: any, scale: number) => {
  if (!Array.isArray(data?.layers)) return data
  if (!Number.isFinite(scale) || scale === 1) return data

  const scaled = Math.max(0.01, scale) * 100

  return {
    ...data,
    layers: data.layers.map((layer: any) => {
      if (layer?.nm !== DAY_LAYER_NAME || !layer?.ks?.s) return layer

      // 静态缩放（a=0）
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

      // 动画缩放（a=1）
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

// 把 Lottie asset 里的图片替换成对应 day 图
const buildAnimationData = (source: any, dayImage: string, assetId: string) => {
  const assets = Array.isArray(source?.assets)
    ? source.assets.map((asset: any) =>
        asset.id === assetId ? { ...asset, p: dayImage, u: '', e: 0 } : asset
      )
    : source?.assets

  return applyDayLayerScale({ ...source, assets }, dayImageScale)
}

// 条件面板场景下，隐藏 flip 动画里的“已签到”图标图层
const applySignedIconLayerHidden = (data: any, hidden: boolean) => {
  if (!hidden || !Array.isArray(data?.layers)) return data
  return {
    ...data,
    layers: data.layers.map((layer: any) =>
      layer?.nm === SIGNED_ICON_LAYER_NAME ? { ...layer, hd: true } : layer
    )
  }
}

const getHalfFlipFrame = (data: any) => {
  const fallbackStart = Number.isFinite(Number(data?.ip)) ? Number(data.ip) : 0
  const fallbackEnd = Number.isFinite(Number(data?.op)) ? Number(data.op) : fallbackStart + 1
  const fallback = fallbackStart + (fallbackEnd - fallbackStart) * 0.5
  if (!Array.isArray(data?.layers)) return fallback
  const middleLayer = data.layers.find((layer: any) => layer?.nm === CARD_MIDDLE_LAYER_NAME)
  const rotateFrames = middleLayer?.ks?.ry?.a === 1 ? middleLayer?.ks?.ry?.k : null
  if (!Array.isArray(rotateFrames)) return fallback
  const halfFrame = rotateFrames.find(
    (frame: any) =>
      Array.isArray(frame?.s) && Number(frame.s[0]) >= 90 && Number.isFinite(Number(frame.t))
  )
  return Number.isFinite(Number(halfFrame?.t)) ? Number(halfFrame.t) : fallback
}

// 已签到图标隐藏的同一场景下，中间卡片在翻牌后半段同步隐藏
const applyMiddleLayerHiddenAfterHalf = (data: any, hidden: boolean) => {
  if (!hidden || !Array.isArray(data?.layers)) return data
  const hideAt = getHalfFlipFrame(data)
  const keepUntil = Math.max(0, hideAt - 0.01)
  return {
    ...data,
    layers: data.layers.map((layer: any) => {
      if (layer?.nm !== CARD_MIDDLE_LAYER_NAME || !layer?.ks) return layer
      return {
        ...layer,
        ks: {
          ...layer.ks,
          o: {
            a: 1,
            k: [
              { i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 0, s: [100] },
              {
                i: { x: [0.833], y: [0.833] },
                o: { x: [0.167], y: [0.167] },
                t: keepUntil,
                s: [100]
              },
              { t: hideAt, s: [0] }
            ],
            ix: layer.ks?.o?.ix ?? 11
          }
        }
      }
    })
  }
}

// idle / flip 动画数据（替换不同 assetId）
const getIdleAnimationData = () =>
  buildAnimationData(cardIdleAnim, centerAnimationImage.value, IDLE_DAY_ASSET_ID)

const getFlipAnimationData = () =>
  applyMiddleLayerHiddenAfterHalf(
    applySignedIconLayerHidden(
      buildAnimationData(cardFlipAnim, centerAnimationImage.value, FLIP_DAY_ASSET_ID),
      hasRequirements.value
    ),
    hasRequirements.value
  )

// 中间卡点击逻辑：翻过/已领/需要条件时，阻止触发
const onCenterClick = () => {
  if (isFlipped.value) return
  if (isCurrentReceived.value && hasRequirements.value) return
  if (isCurrentReceived.value) return
  emit('centerClick')
}

const onCenterCardClick = (event: globalThis.MouseEvent) => {
  if (isCurrentReceived.value) {
    event.preventDefault()
    event.stopPropagation()
    return
  }
  onCenterClick()
}

const onCenterPointerGuard = (event: PointerEvent) => {
  if (!isCurrentReceived.value) return
  event.stopPropagation()
}

// 播 idle：仅在“未翻牌 & 未领取”时播放循环动画
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

// 播 flip：播放一次，完成后标记 isFlipped=true，并销毁实例
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

// 组件挂载：先播 idle
onMounted(playIdle)

// 组件卸载：销毁 lottie 防止内存泄漏
onBeforeUnmount(() => lottieIns?.destroy())

// current.day 变化：重置翻牌状态，重播 idle（切卡时用）
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

// 暴露给父组件调用：parentRef.playFlip()
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
      @click="onCenterCardClick"
      @pointerdown="onCenterPointerGuard"
      @pointerup="onCenterPointerGuard"
      @pointercancel="onCenterPointerGuard"
    >
      <div
        v-if="showRequirementsPanel"
        class="card-decoration-bg"
        :class="{
          'is-decoration-flipping': isRequirementsFlipping,
          'is-decoration-visible': !isRequirementsFlipping
        }"
        :style="[requirementsPanelStyle, { backgroundImage: `url(${checkinDecorationBg})` }]"
      />
      <div
        v-show="!isFlipped && (!isCurrentReceived || isFlipping)"
        ref="cardLottieEl"
        class="card-lottie"
        :style="lottieStyle"
      />
      <img
        v-show="showDivider"
        :src="checkinVectorDivider"
        alt=""
        aria-hidden="true"
        :class="['card-divider', { 'card-divider-mini': isCurrentReceived }]"
      />
      <CheckInConditionsPanel
        v-if="showRequirementsPanel"
        class="card-requirements"
        :class="{
          'is-requirements-flipping': isRequirementsFlipping,
          'is-requirements-visible': !isRequirementsFlipping
        }"
        :style="requirementsPanelStyle"
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

.card-decoration-bg {
  position: absolute;
  inset: 0;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  z-index: 0;
  pointer-events: none;
  transform-origin: center;
  backface-visibility: hidden;
  will-change: transform, opacity;
}

.card-decoration-bg.is-decoration-flipping {
  opacity: 0;
  animation: requirements-flip-in var(--requirements-flip-duration, 1000ms) ease forwards;
}

.card-decoration-bg.is-decoration-visible {
  opacity: 1;
  transform: rotateY(0deg);
}

.card-requirements {
  transform-origin: center;
  backface-visibility: hidden;
  will-change: transform, opacity;
}

.card-requirements.is-requirements-flipping {
  opacity: 0;
  animation: requirements-flip-in var(--requirements-flip-duration, 1000ms) ease forwards;
}

.card-requirements.is-requirements-visible {
  opacity: 1;
  transform: rotateY(0deg);
}

@keyframes requirements-flip-in {
  0% {
    opacity: 0;
    transform: rotateY(-90deg) scale(0.98);
  }

  10% {
    opacity: 0;
    transform: rotateY(-90deg) scale(0.98);
  }

  100% {
    opacity: 1;
    transform: rotateY(0deg) scale(1);
  }
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
