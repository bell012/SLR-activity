import { createI18n } from 'vue-i18n'
import zh from './zh'
import en from './en'

const getBrowserLanguage = (): string => {
  const lang = navigator.language.toLowerCase()
  if (lang.includes('zh')) {
    return 'zh'
  }
  return 'en'
}

const getStoredLanguage = (): string => {
  return window.localStorage.getItem('language') || getBrowserLanguage()
}

const i18n = createI18n({
  legacy: false,
  locale: getStoredLanguage(),
  fallbackLocale: 'en',
  messages: {
    zh,
    en
  }
})

export default i18n

// 切换语言
export const setLanguage = (lang: string) => {
  i18n.global.locale.value = lang as 'en' | 'zh'
  window.localStorage.setItem('language', lang)
}

// 获取当前语言
export const getCurrentLanguage = () => {
  return i18n.global.locale.value
}
