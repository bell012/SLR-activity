<script setup lang="ts">
import { checkinApi, smsApi, ticketApi } from '@/api'
import type { MbSignResult, ReceiveRewardResult } from '@/api/checkin'

import { showToast } from 'vant'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCheckInSlider } from './composables/useCheckInSlider'

import checkinBg from '@/assets/svg/checkin/checkin-bg.svg'
import checkinGiftBox from '@/assets/svg/checkin/checkin-gift-box.svg'
import checkinTopScrollOverlay from '@/assets/svg/checkin/checkin-top-scroll-overlay.svg'
import rulesIcon from '@/assets/svg/checkin/rules-icon.svg'
import CheckInBonusGrid from './components/CheckInBonusGrid.vue'
import CheckInCardDeck from './components/CheckInCardDeck.vue'
import VerifyPhonePopup from './components/VerifyPhonePopup.vue'
const SLIDE_DURATION = 360

const router = useRouter()
const route = useRoute()

const pickLocalizedText = (
  list?: Array<{ languageCode?: string; name?: string }>,
  fallback = ''
) => {
  if (!Array.isArray(list) || list.length === 0) return fallback
  const target =
    list.find((item) => item.languageCode === 'eng' || item.languageCode === 'en') || list[0]
  return target?.name || fallback
}

const symbol = computed(() => {
  const currency = activityCurrency.value
  return getCurrencySymbol(currency)
})

const formatDate = (value?: number) => {
  if (!value) return ''
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: '2-digit',
    year: 'numeric'
  }).format(new Date(value))
}

const getCurrencySymbol = (currency?: string) => {
  const map: Record<string, string> = {
    PHP: '₱',
    USD: '$',
    EUR: '€',
    GBP: '£'
  }
  if (!currency) return ''
  return map[currency] ?? `${currency} `
}

const resolveImage = (value?: string) => {
  if (!value) return ''
  if (value.startsWith('http') || value.startsWith('data:')) return value
  return ''
}

const activityDetail = ref<any | null>(null)
const activityTitle = computed(
  () =>
    pickLocalizedText(activityDetail.value?.activityName) ||
    activityDetail.value?.activiName ||
    'CHECK-IN EVENT'
)
const activitySubtitle = computed(
  () =>
    pickLocalizedText(activityDetail.value?.activityDesc) ||
    'Check in daily and meet the requiements to claim rewards'
)
const startTagText = computed(() => {
  const dateText = formatDate(activityDetail.value?.startDate)
  return dateText ? `Starts On: ${dateText}` : 'Starts On: --'
})
const activityCurrency = computed(
  () => activityDetail.value?.config?.PHP?.currency || activityDetail.value?.currencyList?.[0]
)
const activityBackground = computed(() => {
  const config = activityDetail.value?.config?.PHP
  return resolveImage(config?.bgImage || config?.bgLogo) || checkinBg
})

const bonusList = ref([{ day: '', amount: '' }])

const slider = useCheckInSlider(bonusList, SLIDE_DURATION)

const {
  currentIndex,
  isResetting,
  direction,
  currentCard,
  prevCard,
  nextCard,
  slide,
  onPointerDown,
  onPointerUp,
  onPointerCancel
} = slider

// 后续url取值
const verifyCode = '123456'
const activityId = computed(() => Number(route.query.activityId) || 111)

const signInfo = ref<MbSignResult | null>(null)
const rewardInfo = ref<ReceiveRewardResult | null>(null)
const cardDeckRef = ref<InstanceType<typeof CheckInCardDeck> | null>(null)
const showVerifyPopup = ref(false)
const verifyCodeInput = ref('')
const canResend = ref(false)
const resendSeconds = ref(0)
const resendTimer = ref<number | null>(null)
const isSendingSms = ref(false)
const phoneNumber = ref('')
// 国家区号
const areaCode = ref('+63')

const showTopOverlay = ref(false)

const handleScroll = () => {
  showTopOverlay.value = window.scrollY > 10
}

const getAllowedSignIndex = () => {
  const signedDays = signInfo.value?.signDays ?? 1
  return Math.max(0, signedDays - 1)
}

const goToDetail = () => {
  router.push({
    name: 'CheckInDetail',
    query: { activityId: activityId.value }
  })
}

const handleCenterClick = async () => {
  if (currentIndex.value !== getAllowedSignIndex()) {
    showToast({ message: '请先签到当天', position: 'top' })
    return
  }
  const needVerify = rewardInfo.value?.ticket?.completeVerification?.verifyPhone === 1
  if (needVerify) {
    showVerifyPopup.value = true
    return
  }

  // 领取奖励
  try {
    const response = await checkinApi.receiveReward({ activityId: activityId.value, verifyCode })
    console.log('----receiveReward-rewardInfo----:', response)

    rewardInfo.value = response.result
    if (response.message === '签到成功' || response.message === '今日已签到') {
      // 签到成功 在执行lottie
      cardDeckRef.value?.playFlip()
    }
    showToast({
      message: response.message || '活动不存在',
      position: 'top'
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : '领取奖励失败'

    showToast({ message: message || '领取奖励失败', position: 'top' })
    console.error('receiveReward 失败:', error)
  }
}

const handleResendCode = () => {
  if (!canResend.value || isSendingSms.value) return
  void sendSmsCode()
}

const handleVerifySubmit = () => {
  // TODO: 调用校验验证码接口
  showVerifyPopup.value = false
  cardDeckRef.value?.playFlip()
}

const startResendCountdown = (seconds = 60) => {
  if (resendTimer.value) {
    window.clearInterval(resendTimer.value)
  }
  resendSeconds.value = seconds
  canResend.value = false
  resendTimer.value = window.setInterval(() => {
    resendSeconds.value -= 1
    if (resendSeconds.value <= 0) {
      if (resendTimer.value) {
        window.clearInterval(resendTimer.value)
      }
      resendTimer.value = null
      canResend.value = true
      resendSeconds.value = 0
    }
  }, 1000)
}

const sendSmsCode = async () => {
  if (!phoneNumber.value) {
    showToast({ message: '手机号缺失', position: 'top' })
    canResend.value = true
    return
  }
  isSendingSms.value = true
  canResend.value = false
  resendSeconds.value = 0
  try {
    const response = await smsApi.sendSmsCode({
      telephone: phoneNumber.value,
      areaCode: areaCode.value
    })
    console.log('----sendSmsCode----:', response)
    // 1) 接口失败：直接提示并结束
    if (response.code !== 'C2') {
      showToast({
        message: response.message || '获取验证码失败',
        position: 'top'
      })
      return
    }
    startResendCountdown(60)
  } catch (error) {
    showToast({ message: '发送验证码失败', position: 'top' })
    canResend.value = true
    console.error('发送验证码失败:', error)
  } finally {
    isSendingSms.value = false
  }
}

watch(
  () => showVerifyPopup.value,
  (visible) => {
    if (visible) {
      verifyCodeInput.value = ''
      canResend.value = false
      resendSeconds.value = 0
      void sendSmsCode()
    } else if (resendTimer.value) {
      window.clearInterval(resendTimer.value)
      resendTimer.value = null
    }
  }
)

const extractActivityList = (response: any) => {
  if (Array.isArray(response?.result.records)) return response.result.records
  return []
}

const applyActivityDetail = (item: any) => {
  activityDetail.value = item
  const signList = item?.config?.PHP?.sign
  if (Array.isArray(signList) && signList.length > 0) {
    bonusList.value = signList
  }
}

const fetchActivityDetail = async () => {
  try {
    const response = await ticketApi.getMbTicketList({})

    const list = extractActivityList(response)

    const matched = list.find((item: { rowId?: number }) => Number(item.rowId) === activityId.value)

    if (matched) {
      applyActivityDetail(matched)
    } else if (list.length > 0) {
      showToast({
        message: '未获取到该活动信息',
        position: 'top'
      })
    }
    console.log('----response----:', response)
    console.log('----matched----:', matched)
  } catch (error) {
    const message = error instanceof Error ? error.message : '活动列表失败:'
    showToast({
      message: message,
      position: 'top'
    })
    console.error('活动列表失败:', error)
  }
}

onMounted(async () => {
  await fetchActivityDetail()

  // 会员签到信息
  try {
    const response = await checkinApi.mbSign({ activityId: activityId.value, verifyCode })
    signInfo.value = response.result
    console.log('----mbSign-signInfo----:', response)
    // if (response.result?.signDays) {
    //   const targetIndex = Math.max(
    //     0,
    //     Math.min(bonusList.value.length - 1, response.result.signDays - 1)
    //   )
    //   currentIndex.value = targetIndex
    // }
    // if (response.result == null) {
    //   showToast({
    //     message: response.message || '活动不存在',
    //     position: 'top'
    //   })
    // }
  } catch (error) {
    const message = error instanceof Error ? error.message : '获取会员签到信息失败'
    showToast({
      message: message,
      position: 'top'
    })
    console.error('mbSign 失败:', error)
  }
  // ToDo：获取会员信息
  try {
    const response = await smsApi.selectMember({ memberId: '1000011590' })

    console.log('----selectMember----:', response)
    phoneNumber.value = (response.result?.memberId ?? '').trim()
    areaCode.value = (response.result?.areaCode ?? '').trim()

    // 1) 接口失败：直接提示并结束
    if (response.code !== 'C2') {
      showToast({
        message: response.message || '获取会员信息失败',
        position: 'top'
      })
      return
    }

    // 2) 接口成功但未绑定手机号：提示并结束
    if (!phoneNumber.value) {
      showToast({
        message: '请绑定手机号后再进行签到',
        position: 'top'
      })
      return
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : '获取会员信息失败'
    showToast({
      message: message,
      position: 'top'
    })
  }

  window.addEventListener('scroll', handleScroll)
})
onUnmounted(() => {
  if (resendTimer.value) {
    window.clearInterval(resendTimer.value)
    resendTimer.value = null
  }
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="check-in-page">
    <img
      :src="checkinTopScrollOverlay"
      class="top-scroll-overlay"
      :class="{ 'is-visible': showTopOverlay }"
      alt=""
    />
    <div class="check-in-modal">
      <div class="modal-bg" :style="{ backgroundImage: `url(${activityBackground})` }" />

      <header class="modal-header">
        <div class="start-tag">{{ startTagText }}</div>
        <button class="back-btn" aria-label="Back">
          <span class="back-icon" />
        </button>
      </header>

      <div class="title">{{ activityTitle }}</div>
      <p class="subtitle">{{ activitySubtitle }}</p>

      <CheckInCardDeck
        ref="cardDeckRef"
        :current="currentCard"
        :prev="prevCard"
        :next="nextCard"
        :direction="direction"
        :is-resetting="isResetting"
        @prev="slide('prev')"
        @next="slide('next')"
        @center-click="handleCenterClick"
        @pointerdown="onPointerDown"
        @pointerup="onPointerUp"
        @pointercancel="onPointerCancel"
      />

      <section class="bonus-section" role="button" @click="goToDetail">
        <div class="bonus-header">
          <img :src="checkinGiftBox" alt="gift box" class="gift-icon" />
          <div class="title-container">
            <div class="title-wrapper">
              <span class="bonus-title">CHECK-IN BONUS</span>
              <div class="rules">
                <span class="rules-text">Check-In Rules</span>
                <img :src="rulesIcon" alt="rules" class="rules-icon" />
              </div>
            </div>
            <p class="bonus-subtitle">Cumulative check-ins earn more rewards</p>
          </div>
        </div>

        <CheckInBonusGrid :list="bonusList" :symbol="symbol" />
      </section>

      <VerifyPhonePopup
        v-model:show="showVerifyPopup"
        v-model:code="verifyCodeInput"
        :phone="'+' + areaCode + phoneNumber"
        :can-resend="canResend"
        :seconds-left="resendSeconds"
        :is-sending="isSendingSms"
        @resend="handleResendCode"
        @submit="handleVerifySubmit"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.check-in-page {
  min-height: 100vh;
  background: #000;
  display: flex;
  justify-content: center;
  font-size: 12.5px;
  padding: env(safe-area-inset-top) 0 env(safe-area-inset-bottom);
}

.check-in-modal {
  position: relative;
  width: 100%;
  margin-top: 44px;
  padding: 22px 18px 20px;
  border-radius: 34px 34px 0 0;
  overflow: hidden;
  isolation: isolate;
}

.modal-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center top;
  opacity: 1;
  z-index: 0;
}

.modal-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  opacity: 0.2;
  background: linear-gradient(0deg, #ff6c69 0%, #ffc1bf 100%);
  // inset: 30% 0 0 0;
  z-index: 1;
  pointer-events: none;
}

.check-in-modal::before {
  content: '';
  position: absolute;
  left: 5%;
  top: 12%;
  width: 90%;
  height: 60%;
  background: rgba(255, 255, 255, 0.6);
  filter: blur(150px);
  z-index: 1;
  pointer-events: none;
}

.modal-header {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.start-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  padding: 0 20px;
  background: rgba(255, 247, 247, 0.5);
  border-radius: 30px;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: #f15e62;
}

.back-btn {
  width: 38px;
  height: 38px;
  border-radius: 999px;
  background: rgba(244, 122, 122, 0.2);
  border: 1px solid #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  width: 16px;
  height: 16.62px;
  position: relative;
}

.back-icon::before,
.back-icon::after {
  content: '';
  position: absolute;
  width: 2.38px;
  border-radius: 90px;
  background: #d66666;
  left: 50%;
  top: 50%;
}

.back-icon::before {
  height: 10.62px;
  transform: translate(-180%, -10%) rotate(-50deg);
}

.back-icon::after {
  height: 18.25px;
  transform: translate(-20%, -50%) rotate(30deg);
}

.title {
  position: relative;
  margin-top: 10px;
  font-family: 'AaHouDiHei', 'Inter', sans-serif;
  font-weight: 400;
  font-size: 30px;
  font-style: normal;
  color: #ffffff;
  z-index: 2;
  -webkit-text-stroke: 2px #ffa6a0;

  text-shadow: none;
}

.subtitle {
  position: relative;
  margin-top: 2.5px;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: #f19791;
  z-index: 2;
}

.bonus-section {
  position: relative;
  z-index: 2;
  margin-top: 20px;
  cursor: pointer;
}

.bonus-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.gift-icon {
  width: 42.33px;
  height: 44.67px;
}
.title-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.title-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.bonus-title {
  font-family: 'AaHouDiHei', 'Inter', sans-serif;
  font-size: 17px;
  font-weight: 400;
  font-style: normal;
  color: #ffffff;
  text-transform: uppercase;
  background: linear-gradient(90deg, #830404 0%, #000000 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.rules {
  display: flex;
  align-items: center;
  gap: 5px;
}

.rules-text {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: #ff002d;
}

.rules-icon {
  width: 15px;
  height: 15px;
  display: block;
}

.bonus-subtitle {
  margin-top: 5px;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: #810404;
}

.top-scroll-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 99;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;

  &.is-visible {
    opacity: 1;
  }
}
</style>
