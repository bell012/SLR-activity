import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const ossDomain = ref<string>('')

  const setOssDomain = (value: string) => {
    ossDomain.value = value || ''
  }

  return {
    ossDomain,
    setOssDomain
  }
})
