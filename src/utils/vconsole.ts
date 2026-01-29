import VConsole from 'vconsole'

let vConsole: VConsole | null = null

/**
 * 初始化 vConsole
 * 只在开发环境或特定条件下启用
 */
export function initVConsole() {
  // 只在开发环境启用
  if (import.meta.env.MODE === 'development') {
    if (!vConsole) {
      vConsole = new VConsole({
        theme: 'dark',
        defaultPlugins: ['system', 'network', 'element', 'storage'],
        maxLogNumber: 1000
      })
      console.log('vConsole 已启用')
    }
  }
}

/**
 * 销毁 vConsole
 */
export function destroyVConsole() {
  if (vConsole) {
    vConsole.destroy()
    vConsole = null
    console.log('vConsole 已销毁')
  }
}

/**
 * 切换 vConsole 显示/隐藏
 */
export function toggleVConsole() {
  if (vConsole) {
    if (vConsole.isInited) {
      destroyVConsole()
    }
  } else {
    initVConsole()
  }
}

export default {
  initVConsole,
  destroyVConsole,
  toggleVConsole
}
