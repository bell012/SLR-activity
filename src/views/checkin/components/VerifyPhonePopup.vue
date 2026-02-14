<script setup lang="ts">
import closeIcon from '@/assets/common/close-icon.svg'
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

const handleInput = (event: unknown) => {
  const target = event as { target?: { value?: string } | null } | null
  const value = (target?.target?.value ?? '').replace(/\D/g, '').slice(0, 6)
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
        <img :src="closeIcon" alt="Close" />
      </button>

      <h3 class="verify-title">SMS VERIFICATION</h3>
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
          Reacquire
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
  height: 218.33px;
  max-width: 88vw;
  padding: 15px 25px 0;
  border-radius: 23px;
  background: #ffffff;
  box-shadow: 0 6px 13.33px rgba(0, 0, 0, 0.2);
}

.verify-close {
  position: absolute;
  top: 13px;
  right: 14px;
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 50%;
  background: rgba(146, 146, 146, 0.1);
  border: 1px solid rgba(149, 147, 147, 0.4);
  color: #cacaca;
  font-size: 12px;
  line-height: 1;
  cursor: pointer;
}

.verify-title {
  margin: 0 0 30px;
  width: 189.67px;
  font-family: 'Inter', sans-serif;
  font-size: 20px;
  font-weight: 700;
  line-height: 24.33px;
  letter-spacing: 0%;
  text-transform: uppercase;
  vertical-align: middle;
  color: #000000;
}

.verify-desc {
  width: 251px;
  margin: 0 0 20px;
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  font-weight: 400;
  line-height: 18px;
  letter-spacing: 0%;
  vertical-align: middle;
  color: rgba(0, 0, 0, 0.7);
}

.verify-desc span {
  color: #000000;
  font-family: 'PingFang SC', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;
  letter-spacing: 0%;
  vertical-align: middle;
}

.verify-code {
  position: relative;
  width: 251px;
  height: 36px;
  margin: 0 0 20px;
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
  border: 0.33px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Inter', sans-serif;
  font-size: 17px;
  font-weight: 600;
  line-height: 20.67px;
  letter-spacing: 0%;
  text-align: center;
  vertical-align: middle;
  color: #000000;
}

.code-box.active {
  border-color: #007ef7;
}

.verify-resend-row {
  width: 251px;
  margin-top: 0;
  display: flex;
  justify-content: flex-end;
  min-height: 19.33px;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: 19.33px;
  letter-spacing: 0%;
  text-align: right;
  color: rgba(0, 0, 0, 0.7);
}

.verify-resend-btn {
  border: none;
  background: transparent;
  color: rgba(0, 0, 0, 0.7);
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: 19.33px;
  letter-spacing: 0%;
  text-align: right;
  cursor: pointer;
}

.verify-resend-text {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: 19.33px;
  letter-spacing: 0%;
  text-align: right;
}
</style>
