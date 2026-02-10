<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'

const props = defineProps<{
  show: boolean
  code: string
  phone: string
  canResend: boolean
  secondsLeft: number
  isSending: boolean
}>()

const emit = defineEmits<{
  'update:show': [boolean]
  'update:code': [string]
  resend: []
  submit: []
}>()

const inputRef = ref<{ focus: () => void } | null>(null)

const codeChars = computed(() => {
  const chars = props.code.split('')
  while (chars.length < 6) chars.push('')
  return chars.slice(0, 6)
})

const displayPhone = computed(() => (props.phone ? props.phone : 'your phone'))

const focusInput = async () => {
  await nextTick()
  inputRef.value?.focus()
}

const handleInput = (event: { target: { value?: string } }) => {
  const value = (event.target?.value ?? '').replace(/\D/g, '').slice(0, 6)
  emit('update:code', value)
  if (value.length === 6) {
    emit('submit')
  }
}

watch(
  () => props.show,
  (visible) => {
    if (visible) {
      focusInput()
    }
  }
)
</script>

<template>
  <van-popup
    :show="show"
    :overlay="true"
    overlay-class="verify-overlay"
    :close-on-click-overlay="false"
    class="verify-popup"
    @update:show="(value: boolean) => emit('update:show', value)"
  >
    <div class="verify-dialog">
      <button
        class="verify-close"
        type="button"
        aria-label="Close verification"
        @click="emit('update:show', false)"
      >
        ×
      </button>

      <h3 class="verify-title">SMS verification</h3>
      <p class="verify-desc">
        Verification code has been sent to <span>{{ displayPhone }}</span>
      </p>

      <div class="verify-code" @click="focusInput">
        <input
          ref="inputRef"
          class="verify-input"
          inputmode="numeric"
          autocomplete="one-time-code"
          pattern="[0-9]*"
          maxlength="6"
          :value="code"
          @input="handleInput"
          @keyup.enter="emit('submit')"
        />
        <div class="code-boxes">
          <span
            v-for="(char, index) in codeChars"
            :key="index"
            :class="['code-box', { active: index === code.length }]"
          >
            {{ char }}
          </span>
        </div>
      </div>

      <div class="verify-resend-row" aria-live="polite">
        <button v-if="canResend" class="verify-resend-btn" type="button" @click="emit('resend')">
          Resend
        </button>
        <span v-else-if="secondsLeft > 0" class="verify-resend-text">
          Resend in {{ secondsLeft }} seconds
        </span>
        <span v-else-if="isSending" class="verify-resend-text">Sending...</span>
      </div>
    </div>
  </van-popup>
</template>

<style scoped lang="scss">
.verify-popup {
  padding: 0;
  background: transparent;
}

:deep(.verify-overlay) {
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(12px);
}

.verify-dialog {
  position: relative;
  width: 301px;
  max-width: 88vw;
  padding: 22px 20px 18px;
  border-radius: 23px;
  background: #ffffff;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.2);
}

.verify-close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.06);
  color: #888;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
}

.verify-title {
  margin: 6px 0 6px;
  font-size: 18px;
  font-weight: 700;
  color: #2b2b2b;
}

.verify-desc {
  margin: 0 0 14px;
  font-size: 12px;
  line-height: 1.5;
  color: #666;
}

.verify-desc span {
  color: #d62847;
  font-weight: 600;
}

.verify-code {
  position: relative;
  width: 100%;
  height: 36px;
  cursor: text;
}

.verify-input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: none;
  background: transparent;
  color: transparent;
  caret-color: transparent;
  outline: none;
}

.code-boxes {
  display: flex;
  gap: 7px;
  justify-content: space-between;
}

.code-box {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: #f0f0f0;
  border: 1px solid rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
  color: #d62847;
}

.code-box.active {
  border-color: #007ef7;
}

.verify-resend-row {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
  min-height: 20px;
  font-size: 12px;
  color: #d62847;
}

.verify-resend-btn {
  border: none;
  background: transparent;
  color: #d62847;
  font-weight: 600;
  cursor: pointer;
}

.verify-resend-text {
  font-weight: 600;
}
</style>
