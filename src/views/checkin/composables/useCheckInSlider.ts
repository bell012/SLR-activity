import { computed, ref } from 'vue'

export function useCheckInSlider<T>(list: T[], slideDuration = 360) {
  const currentIndex = ref(0)
  const isAnimating = ref(false)
  const isResetting = ref(false)
  const direction = ref<'next' | 'prev' | null>(null)
  const pointerStart = ref<{ x: number; y: number } | null>(null)

  const canPrev = computed(() => currentIndex.value > 0)
  const canNext = computed(() => currentIndex.value < list.length - 1)

  const currentCard = computed(() => list[currentIndex.value])
  const prevCard = computed(() => (canPrev.value ? list[currentIndex.value - 1] : null))
  const nextCard = computed(() => (canNext.value ? list[currentIndex.value + 1] : null))

  const slide = (dir: 'next' | 'prev') => {
    if (isAnimating.value) return
    if (dir === 'next' && !canNext.value) return
    if (dir === 'prev' && !canPrev.value) return

    isAnimating.value = true
    direction.value = dir

    window.setTimeout(() => {
      isResetting.value = true
      currentIndex.value += dir === 'next' ? 1 : -1
      direction.value = null
      isAnimating.value = false

      window.requestAnimationFrame(() => {
        isResetting.value = false
      })
    }, slideDuration)
  }

  const onPointerDown = (event: globalThis.PointerEvent) => {
    if (isAnimating.value) return
    pointerStart.value = { x: event.clientX, y: event.clientY }
  }

  const onPointerUp = (event: globalThis.PointerEvent) => {
    if (!pointerStart.value || isAnimating.value) return
    const dx = event.clientX - pointerStart.value.x
    const dy = event.clientY - pointerStart.value.y
    pointerStart.value = null

    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy)) return
    if (dx < 0) slide('next')
    if (dx > 0) slide('prev')
  }

  const onPointerCancel = () => {
    pointerStart.value = null
  }

  return {
    currentIndex,
    isAnimating,
    isResetting,
    direction,
    canPrev,
    canNext,
    currentCard,
    prevCard,
    nextCard,
    slide,
    onPointerDown,
    onPointerUp,
    onPointerCancel
  }
}
