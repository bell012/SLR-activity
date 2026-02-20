<script setup lang="ts">
import { useAppStore } from '@/store/modules/app'
import { computed } from 'vue'
const props = defineProps<{
  imageUrl?: string
  buttonText?: string
  buttonDisabled?: boolean
  buttonBg?: string
}>()

const emit = defineEmits<{
  action: []
}>()
const appStore = useAppStore()
const imageUrl = computed(() => buildOssUrl(props.imageUrl))

const buildOssUrl = (value?: string): string => {
  if (!value) return ''
  if (value.startsWith('http') || value.startsWith('data:')) return value
  const base = appStore.ossDomain?.replace(/\/$/, '') || ''
  if (!base) return value
  const path = value.startsWith('/') ? value : `/${value}`
  return `${base}${path}`
}

const buttonStyle = computed(() => {
  if (!props.buttonBg) return {}
  return { backgroundImage: `url(${props.buttonBg})` }
})

const handleClick = () => {
  if (props.buttonDisabled) return
  emit('action')
}
</script>

<template>
  <div class="custom-style">
    <img v-if="imageUrl" :src="imageUrl" alt="treasure" class="custom-image" />
    <button
      type="button"
      class="custom-button"
      :class="{ 'is-disabled': buttonDisabled }"
      :style="buttonStyle"
      :disabled="buttonDisabled"
      @click="handleClick"
    >
      <span>{{ buttonText || 'Check In' }}</span>
    </button>
  </div>
</template>

<style scoped lang="scss">
.custom-style {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-top: 6px;
  position: relative;
  z-index: 2;
}

.custom-image {
  width: 220px;
  max-width: 80%;
  height: auto;
  display: block;
}

.custom-button {
  width: 220px;
  max-width: 80%;
  height: 46px;
  border: none;
  border-radius: 999px;
  background: linear-gradient(180deg, #ffd1ac 0%, #fcb572 100%);
  color: #8b3a00;
  font-size: 16px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  cursor: pointer;
}

.custom-button.is-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
