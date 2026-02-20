<script setup lang="ts">
import { checkinApi, smsApi, ticketApi } from '@/api'
import type { MbSignResult, ReceiveRewardResult } from '@/api/checkin'

import { useAppStore } from '@/store/modules/app'
import { showToast } from 'vant'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCheckInSlider } from './composables/useCheckInSlider'

import activityTitleImg from '@/assets/png/checkin/checkin-activity-title.png'
import checkinBtnActive from '@/assets/png/checkin/checkin-btn-active.png'
import checkinBtnDisabled from '@/assets/png/checkin/checkin-btn-disabled.png'
import rulesIcon from '@/assets/svg/checkin/rules-icon.svg'

import checkinBg from '@/assets/svg/checkin/checkin-bg.svg'
import checkinGiftBox from '@/assets/svg/checkin/checkin-gift-box.svg'
import checkinTopScrollOverlay from '@/assets/svg/checkin/checkin-top-scroll-overlay.svg'
import PopupBig from '@/views/ticket/component/PopupBig.vue'
import PopupSmall from '@/views/ticket/component/PopupSmall.vue'
import CheckinSkeleton from './CheckIn-skeleton.vue'
import CheckInBonusGrid from './components/CheckInBonusGrid.vue'
import CheckInCardDeck from './components/CheckInCardDeck.vue'
import CheckInConditionsPopup from './components/CheckInConditionsPopup.vue'
import CheckInCustomStyle from './components/CheckInCustomStyle.vue'
import VerifyPhonePopup from './components/VerifyPhonePopup.vue'

const SLIDE_DURATION = 360
// 9、手机短信验证
const needVerify = ref(false)
const router = useRouter()
const route = useRoute()
const appStore = useAppStore()

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

const activitySubtitle = computed(
  () =>
    pickLocalizedText(activityDetail.value?.activityDesc) ||
    'Check in daily and meet the requiements to claim rewards'
)
const bonusSubtitle = computed(() => {
  const signType = activityDetail.value?.config?.PHP?.signType
  return Number(signType) === 0
    ? 'Consecutive check-ins earn more rewards'
    : 'Cumulative check-ins earn more rewards'
})
const startTagText = computed(() => {
  const startDate = activityDetail.value?.startDate
  const endDate = activityDetail.value?.endDate
  const now = Date.now()
  if (startDate && now < startDate) {
    const startText = formatDate(startDate)
    return startText ? `Starts On: ${startText}` : 'Starts On: --'
  }
  if (endDate && now <= endDate) {
    const endText = formatDate(endDate)
    return endText ? `Ends On: ${endText}` : 'Ends On: --'
  }
  if (endDate) {
    const endText = formatDate(endDate)
    return endText ? `Ends On: ${endText}` : 'Ends On: --'
  }
  const startText = formatDate(startDate)
  return startText ? `Starts On: ${startText}` : 'Starts On: --'
})
const activityCurrency = computed(
  () => activityDetail.value?.config?.PHP?.currency || activityDetail.value?.currencyList?.[0]
)
const activityBackground = computed(() => {
  const config = activityDetail.value?.config?.PHP
  return resolveImage(config?.bgImage || config?.bgLogo) || checkinBg
})
const conditionRelation = computed(() => activityDetail.value?.config?.PHP?.conditionRelation)
const styleType = computed(() => Number(activityDetail.value?.config?.PHP?.styleType ?? 1))
const isCustomStyle = computed(() => styleType.value === 2)
const customChestImage = computed(
  () =>
    resolveImage(activityDetail.value?.config?.PHP?.stylePicInfo) ||
    activityDetail.value?.config?.PHP?.stylePicInfo ||
    ''
)
const customButtonBg = computed(() =>
  customButtonState.value.disabled ? checkinBtnDisabled : checkinBtnActive
)

type BonusItem = {
  day?: number | string
  amount?: string
  ticketId?: number | string
  ticketType?: number | string | null
  betAmount?: number | string | null
  rechargeAmount?: number | string | null
  amountRange?: number[] | null
  rewardAmount?: number | string | null
  depositProgress?: number | string | null
  betProgress?: number | string | null
  isReceived?: boolean | null
}

const bonusList = ref<BonusItem[]>([{ day: '', amount: '' }])
const isLoading = ref(true)

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

const resolveQueryNumber = (value: unknown, fallback: number) => {
  const numeric = Number(value)
  return Number.isFinite(numeric) && numeric > 0 ? numeric : fallback
}

const activityId = computed(() =>
  resolveQueryNumber(route.query.activityId ?? route.query.rowId, 0)
)
const memberId = computed(() => {
  const raw = String(route.query.memberId ?? '').trim()
  return raw || '0'
})

const signInfo = ref<MbSignResult | null>(null)
const rewardInfo = ref<ReceiveRewardResult | null>(null)
const cardDeckRef = ref<InstanceType<typeof CheckInCardDeck> | null>(null)
const showVerifyPopup = ref(false)
const showConditionsPopup = ref(false)
const conditionsItem = ref<BonusItem | null>(null)
const smallPopupVisible = ref(false)
const smallPopupAmount = ref<string | number>('0.00')
const bigPopupVisible = ref(false)
const rewardsList = ref([
  {
    icon: '/src/static/ticket/card_jindan.png',
    description: 'Register and get ₱3-₱888 bonus!',
    quantity: 1,
    bgColor: '#FEE554'
  },
  {
    icon: '/src/static/ticket/card_zhuanpan.png',
    description: 'Register and get ₱3-₱888 bonus!',
    quantity: 10,
    bgColor: '#FA9CFF'
  },
  {
    icon: '/src/static/ticket/card_hongbao.png',
    description: 'Register and get ₱3-₱888 bonus!',
    quantity: 5,
    bgColor: '#fba1a4'
  },
  {
    icon: '/src/static/ticket/card_xianjin.png',
    description: 'Register and get ₱3-₱888 bonus!',
    quantity: 3,
    bgColor: '#9affb1'
  }
])
// TODO： 校验验证码接口，暂时固定
const verifyCodeInput = ref('123456')
const canResend = ref(false)
const resendSeconds = ref(0)
const resendTimer = ref<number | null>(null)
const isSendingSms = ref(false)
const lastSmsSentAt = ref(0)
const SMS_COOLDOWN_SECONDS = 60
const SMS_COOLDOWN_MS = SMS_COOLDOWN_SECONDS * 1000
const phoneNumber = ref('')
// 国家区号
const areaCode = ref('+63')

const maskPhoneNumber = (value: string) => {
  const raw = value?.trim() || ''
  if (!raw) return ''
  if (raw.length <= 7) return raw
  const start = raw.slice(0, 3)
  const end = raw.slice(-4)
  const maskLength = Math.max(0, raw.length - 7)
  return `${start}${'*'.repeat(maskLength)}${end}`
}

const maskedPhoneNumber = computed(() => maskPhoneNumber(phoneNumber.value))

const showTopOverlay = ref(false)

const handleScroll = () => {
  showTopOverlay.value = window.scrollY > 10
}

const getAllowedSignIndex = () => {
  const signedDays = signInfo.value?.signDays ?? 1
  return Math.max(0, signedDays - 1)
}

const normalizeProgressValue = (value: unknown) => {
  const numeric = Number(value)
  return Number.isFinite(numeric) && numeric > 0 ? numeric : 0
}

const applySignProgress = (signResult: MbSignResult | null) => {
  if (!signResult || bonusList.value.length === 0) return
  const targetIndex = Math.max(
    0,
    Math.min(bonusList.value.length - 1, (signResult.signDays ?? 1) - 1)
  )
  const historyList = Array.isArray(signResult.historySign) ? signResult.historySign : []
  const historyMap = new Map<number, any>()
  historyList.forEach((item) => {
    const dayValue = Number(item?.signDays)
    if (Number.isFinite(dayValue)) {
      historyMap.set(dayValue, item)
    }
  })
  const latest = historyList.length > 0 ? historyList[historyList.length - 1] : null
  const depositProgress = normalizeProgressValue(
    latest?.rechargeAmount ?? signResult.rechargeAmount
  )
  const betProgress = normalizeProgressValue(latest?.betAmount ?? signResult.betAmount)
  const todayReceived = Boolean(signResult.todayIsSign)

  bonusList.value = bonusList.value.map((item, index) => {
    const dayValue = Number(item?.day)
    const day = Number.isFinite(dayValue) ? dayValue : index + 1
    const history = historyMap.get(day)
    const receivedAmount = history?.todaySignAmount ?? history?.rewardAmount ?? history?.amount
    const isReceived = Boolean(history) || (index === targetIndex && todayReceived)
    if (index !== targetIndex) {
      return {
        ...item,
        isReceived,
        receivedAmount
      }
    }
    return {
      ...item,
      isReceived,
      receivedAmount,
      depositProgress,
      betProgress
    }
  })

  currentIndex.value = targetIndex
}

const hasRequirementLimit = (item: any) => {
  const rechargeTarget = Number(item?.rechargeAmount)
  const betTarget = Number(item?.betAmount)
  return (
    (Number.isFinite(rechargeTarget) && rechargeTarget > 0) ||
    (Number.isFinite(betTarget) && betTarget > 0)
  )
}

const isRequirementMet = (item: any) => {
  const rechargeTarget = Number(item?.rechargeAmount)
  const betTarget = Number(item?.betAmount)
  const rechargeProgress = Number(item?.depositProgress ?? 0)
  const betProgress = Number(item?.betProgress ?? 0)
  const needRecharge = Number.isFinite(rechargeTarget) && rechargeTarget > 0
  const needBet = Number.isFinite(betTarget) && betTarget > 0

  if (needRecharge && rechargeProgress < rechargeTarget) return false
  if (needBet && betProgress < betTarget) return false
  return true
}

const markCurrentReceived = () => {
  bonusList.value = bonusList.value.map((item, index) => {
    if (index !== currentIndex.value) return item
    return {
      ...item,
      isReceived: true
    }
  })
  if (signInfo.value) {
    signInfo.value.todayIsSign = true
  }
}

const goToDetail = () => {
  router.push({
    name: 'CheckInDetail',
    query: { activityId: activityId.value }
  })
}

const showTestPopups = () => {
  smallPopupVisible.value = true
  bigPopupVisible.value = true
}

const handleBonusItemClick = (item: BonusItem) => {
  conditionsItem.value = item
  showConditionsPopup.value = true
}

const showSmallPopupByReward = (result: ReceiveRewardResult | null | undefined) => {
  const amount = Number((result as any)?.amount)
  const bizSuccess = (result as any)?.success !== false
  if (!Number.isFinite(amount) || amount <= 0 || !bizSuccess) return
  smallPopupAmount.value = amount.toFixed(2)
  smallPopupVisible.value = true
}

const customButtonState = computed(() => {
  const current = currentCard.value
  if (!current) {
    return { text: 'Claim Bonus', disabled: true }
  }
  const isToday = currentIndex.value === getAllowedSignIndex()
  const hasLimit = hasRequirementLimit(current)
  const isMet = isRequirementMet(current)
  const isReceived = Boolean(current.isReceived)
  const startDate = activityDetail.value?.startDate
  const notStarted = startDate != null && Date.now() < Number(startDate)

  if (notStarted) {
    return { text: 'Coming Soon', disabled: true }
  }
  if (isReceived) {
    return { text: 'Claimed', disabled: true }
  }
  if (isToday && (!hasLimit || isMet)) {
    return { text: 'Claim Bonus', disabled: false }
  }
  return { text: 'Claim Bonus', disabled: true }
})

const handleCustomButtonClick = () => {
  const state = customButtonState.value
  if (state.disabled) return
  void handleCenterClick()
}

const handleCenterClick = async () => {
  const current = currentCard.value
  if (!current) return
  const isToday = currentIndex.value === getAllowedSignIndex()
  const hasLimit = hasRequirementLimit(current)
  const isMet = isRequirementMet(current)
  const isReceived = Boolean(current.isReceived)

  if (isReceived) {
    if (hasLimit) {
      cardDeckRef.value?.playFlip()
    }
    return
  }
  if (!isToday) {
    if (hasLimit) {
      cardDeckRef.value?.playFlip()
    }
    return
  }
  if (hasLimit && !isMet) {
    cardDeckRef.value?.playFlip()
    return
  }
  // 9、手机短信验证
  if (needVerify.value) {
    // ToDo：获取会员信息   // 获取手机号
    try {
      const response = await smsApi.selectMember({ memberId: memberId.value })

      console.log('----selectMember----:', response)
      // 1) 接口失败：直接提示并结束
      if (response.code !== 'C2') {
        showToast({
          message: response.message || '获取会员信息失败',
          position: 'top'
        })
        return
      }

      phoneNumber.value = (response.result?.memberId ?? '').trim()
      areaCode.value = (response.result?.areaCode ?? '').trim()
      // 2) 接口成功但未绑定手机号：提示并结束
      if (!phoneNumber.value) {
        showToast({
          message: '请绑定手机号后再进行签到',
          position: 'top'
        })
        return
      }

      // 弹窗
      showVerifyPopup.value = true
      return
    } catch (error) {
      const message = error instanceof Error ? error.message : '获取会员信息失败'
      showToast({
        message: message,
        position: 'top'
      })
    }
  }
  const result = await getReceiveReward()
  if (!hasLimit) {
    if (result === 'success') {
      cardDeckRef.value?.playFlip()
    }
    return
  }
  if (result === 'success' || result === 'already' || result === 'unmet') {
    cardDeckRef.value?.playFlip()
  }
}
//  // 领取奖励
type ReceiveStatus = 'success' | 'already' | 'unmet' | 'error'

const getReceiveReward = async (): Promise<ReceiveStatus> => {
  try {
    const response = await checkinApi.receiveReward({
      activityId: activityId.value,
      verifyCode: verifyCodeInput.value
    })
    console.log('----receiveReward-rewardInfo----:', response)

    const message = response.message || ''
    if (/今日已签到/.test(message)) {
      markCurrentReceived()
      showToast({
        message: message || '今日已签到',
        position: 'top'
      })
      return 'already'
    }

    if (/条件.*(未满足|为满足)/.test(message)) {
      showToast({
        message: message || '条件未满足',
        position: 'top'
      })
      return 'unmet'
    }

    const isSuccessCode = response.code === 'C2' || response.code === 200 || response.code === 0
    if (isSuccessCode) {
      rewardInfo.value = response.result
      markCurrentReceived()
      // 如果是金额奖励
      showSmallPopupByReward(response.result)
      // TODO：若是抽奖券

      showToast({
        message: message || '操作成功',
        position: 'top'
      })
      return 'success'
    }

    showToast({
      message: message || '活动不存在',
      position: 'top'
    })
    return 'error'
  } catch (error) {
    const message = error instanceof Error ? error.message : '领取奖励失败'

    showToast({ message: message || '领取奖励失败', position: 'top' })
    console.error('receiveReward 失败:', error)
    return 'error'
  }
}
const handleResendCode = () => {
  if (!canResend.value || isSendingSms.value) return
  void sendSmsCode()
}

const handleVerifySubmit = async () => {
  // TODO: 调用校验验证码接口
  showVerifyPopup.value = false

  // 领取奖励
  const result = await getReceiveReward()
  if (result === 'success') {
    cardDeckRef.value?.playFlip()
  }
}

const startResendCountdown = (seconds = SMS_COOLDOWN_SECONDS) => {
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
    lastSmsSentAt.value = Date.now()
    startResendCountdown(SMS_COOLDOWN_SECONDS)
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
      const elapsed = Date.now() - lastSmsSentAt.value
      if (lastSmsSentAt.value && elapsed < SMS_COOLDOWN_MS) {
        const remain = Math.ceil((SMS_COOLDOWN_MS - elapsed) / 1000)
        startResendCountdown(remain)
        return
      }
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
  isLoading.value = true
  try {
    const response = await ticketApi.getMbTicketList({})
    const list = extractActivityList(response)
    const matched = list.find((item: { rowId?: number }) => Number(item.rowId) === activityId.value)
    if (matched) {
      applyActivityDetail(matched)
      // 9、手机短信验证
      const limitList = (Array.isArray(matched.limit) ? matched.limit : []) as Array<
        number | string
      >
      needVerify.value = limitList.some((value: number | string) => Number(value) === 9)
    } else if (list.length > 0) {
      needVerify.value = false
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
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  // huoqu 活动列表
  await fetchActivityDetail()

  try {
    // 后台服务器配置：获取图片服务器地址
    const response = await checkinApi.syDlicgh({
      activityId: activityId.value,
      verifyCode: verifyCodeInput.value
    })
    appStore.setOssDomain(response.result?.baseSiteConfig?.ossDomain || '')
    if (!appStore.ossDomain) {
      showToast({
        message: response.message || '获取图片服务器地址失败',
        position: 'top'
      })
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : '获取图片服务器地址失败'

    showToast({
      message: message,
      position: 'top'
    })
    console.error('mbSign 失败:', error)
  }

  // 会员签到信息
  try {
    const response = await checkinApi.mbSign({
      activityId: activityId.value,
      verifyCode: verifyCodeInput.value
    })
    signInfo.value = response.result
    console.log('----mbSign-signInfo----:', response)
    applySignProgress(response.result)
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
    <CheckinSkeleton v-if="isLoading" />

    <div v-else class="check-in-modal">
      <div class="modal-bg" :style="{ backgroundImage: `url(${activityBackground})` }" />

      <header class="modal-header">
        <div class="start-tag">{{ startTagText }}</div>
        <button class="back-btn" aria-label="Back" @click="showTestPopups">
          <span class="back-icon" />
        </button>
      </header>

      <div class="title-img"><img :src="activityTitleImg" alt="activity title" /></div>
      <p class="subtitle">{{ activitySubtitle }}</p>

      <CheckInCustomStyle
        v-if="isCustomStyle"
        :image-url="customChestImage"
        :button-text="customButtonState.text"
        :button-disabled="customButtonState.disabled"
        :button-bg="customButtonBg"
        @action="handleCustomButtonClick"
      />
      <CheckInCardDeck
        v-else
        ref="cardDeckRef"
        :current="currentCard"
        :prev="prevCard"
        :next="nextCard"
        :direction="direction"
        :is-resetting="isResetting"
        :symbol="symbol"
        @prev="slide('prev')"
        @next="slide('next')"
        @center-click="handleCenterClick"
        @pointerdown="onPointerDown"
        @pointerup="onPointerUp"
        @pointercancel="onPointerCancel"
      />

      <section class="bonus-section" role="button">
        <div class="bonus-header">
          <img :src="checkinGiftBox" alt="gift box" class="gift-icon" />
          <div class="title-container">
            <div class="title-wrapper">
              <span class="bonus-title">CHECK-IN BONUS</span>
              <div class="rules" @click="goToDetail">
                <span class="rules-text">Check-In Rules</span>
                <img :src="rulesIcon" alt="rules" class="rules-icon" />
              </div>
            </div>
            <p class="bonus-subtitle">{{ bonusSubtitle }}</p>
          </div>
        </div>

        <CheckInBonusGrid :list="bonusList" :symbol="symbol" @item-click="handleBonusItemClick" />

        <CheckInConditionsPopup
          v-model:show="showConditionsPopup"
          :item="conditionsItem"
          :symbol="symbol"
          :condition-relation="conditionRelation"
        />
      </section>

      <VerifyPhonePopup
        v-model:show="showVerifyPopup"
        v-model:code="verifyCodeInput"
        :phone="'+' + areaCode + '-' + maskedPhoneNumber"
        :can-resend="canResend"
        :seconds-left="resendSeconds"
        :is-sending="isSendingSms"
        @resend="handleResendCode"
        @submit="handleVerifySubmit"
      />

      <PopupSmall
        :visible="smallPopupVisible"
        subtitle="You've Earned Bonus"
        :amount="smallPopupAmount"
        button-text="NEXT ROUND"
        @close="smallPopupVisible = false"
        @action="smallPopupVisible = false"
      />

      <PopupBig
        :visible="bigPopupVisible"
        subtitle="You've Earned Bonus"
        :rewards="rewardsList"
        button-text="USE NOW"
        @close="bigPopupVisible = false"
        @action="bigPopupVisible = false"
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

.title-img {
  width: 257px;
  height: 37px;
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: flex-start;

  // margin-top: 10px;
  // font-family: 'AaHouDiHei', 'Inter', sans-serif;
  // font-weight: 400;
  // font-size: 30px;
  // font-style: normal;
  // color: #ffffff;
  // z-index: 2;
  // -webkit-text-stroke: 2px #ffa6a0;

  // text-shadow: none;
}

.title-img img {
  width: 100%;
  height: 65%;
  display: block;
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
