import { onBeforeUnmount, onMounted, ref } from 'vue'

export function useScaleFit(designW: number, designH: number) {
  const scale = ref(1)
  const canvasWidth = ref('0px')
  const canvasHeight = ref('0px')

  let raf = 0

  const recalc = () => {
    const vw = document.documentElement.clientWidth
    const s = vw / designW

    scale.value = s

    // ✅ 宽度直接等于 viewport 宽度（杜绝 +1px）
    canvasWidth.value = `${vw}px`

    // ✅ 高度按比例算，建议 round（避免抖动/裁切）
    canvasHeight.value = `${Math.round(designH * s)}px`
  }

  const onResize = () => {
    cancelAnimationFrame(raf)
    raf = requestAnimationFrame(recalc)
  }

  onMounted(() => {
    recalc()
    window.addEventListener('resize', onResize, { passive: true })
    window.visualViewport?.addEventListener('resize', onResize, { passive: true })
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', onResize)
    window.visualViewport?.removeEventListener('resize', onResize)
    cancelAnimationFrame(raf)
  })

  return { scale, canvasWidth, canvasHeight }
}
