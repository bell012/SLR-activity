/**
 * 移动端适配方案
 * 基于 375px 设计稿
 * PC 端固定使用 37.5px 作为 1rem
 */

const MAX_WIDTH = 640 // PC 端最大宽度
const BASE_FONT_SIZE = 37.5 // 基准字体大小（基于 375px 设计稿）

function setRemUnit() {
  const docEl = document.documentElement
  const clientWidth = docEl.clientWidth

  // PC 端（宽度 > 640px）：固定使用 37.5px 作为 1rem
  if (clientWidth > MAX_WIDTH) {
    docEl.style.fontSize = BASE_FONT_SIZE + 'px'
    return
  }

  // 移动端：动态计算 rem
  // 375px 设计稿：375 / 10 = 37.5px = 1rem
  const rem = clientWidth / 10
  docEl.style.fontSize = rem + 'px'
}

// 初始化
setRemUnit()

// 监听窗口变化
window.addEventListener('resize', setRemUnit)
window.addEventListener('pageshow', (e) => {
  if (e.persisted) {
    setRemUnit()
  }
})

// 监听字体大小变化
if ('onorientationchange' in window) {
  window.addEventListener('orientationchange', setRemUnit)
}
