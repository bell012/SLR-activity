<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ticketApi } from '@/api'
import { showToast } from 'vant'

const router = useRouter()
const route = useRoute()
const activityId = computed(() => Number(route.query.activityId) || 0)

const pickLocalizedText = (
  list?: Array<{ languageCode?: string; name?: string }>,
  fallback = ''
) => {
  if (!Array.isArray(list) || list.length === 0) return fallback
  const target =
    list.find((item) => item.languageCode === 'eng' || item.languageCode === 'en') || list[0]
  return target?.name || fallback
}

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

const formatAmount = (amount: number | string | undefined, currency?: string) => {
  if (amount == null || amount === '') return '-'
  const symbol = getCurrencySymbol(currency)
  return symbol ? `${symbol}${amount}` : `${amount}`
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
    'Daily Check-In Event'
)
const activitySubtitle = computed(
  () =>
    pickLocalizedText(activityDetail.value?.activityDesc) ||
    'Check in daily and meet the requirements to claim rewards.'
)
const startDateText = computed(() => formatDate(activityDetail.value?.startDate))
const endDateText = computed(() => formatDate(activityDetail.value?.endDate))
const currency = computed(
  () => activityDetail.value?.config?.PHP?.currency || activityDetail.value?.currencyList?.[0]
)
const ruleDesc = computed(() => activityDetail.value?.config?.PHP?.ruleDesc || '')
const bannerImage = computed(() => {
  const config = activityDetail.value?.config?.PHP
  return resolveImage(config?.bgImage || config?.bgLogo || activityDetail.value?.homeLogo)
})
const signList = computed(() => {
  const sign = activityDetail.value?.config?.PHP?.sign
  if (!Array.isArray(sign)) return []
  return sign.map((item: { day?: number; rewardAmount?: number }) => ({
    day: item.day ?? 0,
    amount: formatAmount(item.rewardAmount, currency.value)
  }))
})

const extractActivityList = (response: any) => {
  if (Array.isArray(response)) return response
  if (Array.isArray(response?.data)) return response.data
  if (Array.isArray(response?.result)) return response.result
  return []
}

const fetchActivityDetail = async () => {
  if (!activityId.value) {
    showToast({ message: '缺少活动 ID', position: 'top' })
    return
  }
  try {
    const response = await ticketApi.getMbTicketList({})
    const list = extractActivityList(response)
    const matched = list.find((item: { rowId?: number }) => Number(item.rowId) === activityId.value)
    if (matched) {
      activityDetail.value = matched
      return
    }
    showToast({ message: '未找到活动信息', position: 'top' })
  } catch (error) {
    console.error('活动详情失败:', error)
    showToast({ message: '活动详情获取失败', position: 'top' })
  }
}

onMounted(fetchActivityDetail)
</script>

<template>
  <div class="detail-page">
    <header class="detail-header">
      <button class="back-btn" type="button" aria-label="Back" @click="router.back()">
        <span class="back-icon" />
      </button>
      <div class="header-text">
        <p class="header-label">Check-In Details</p>
        <h1 class="header-title">{{ activityTitle }}</h1>
      </div>
    </header>

    <section class="hero-card">
      <div class="hero-media">
        <img v-if="bannerImage" :src="bannerImage" alt="" class="hero-image" />
        <div v-else class="hero-placeholder">CHECK-IN</div>
      </div>
      <div class="hero-body">
        <h2 class="hero-title">{{ activityTitle }}</h2>
        <p class="hero-desc">{{ activitySubtitle }}</p>
        <div class="hero-meta">
          <div class="meta-item">
            <span class="meta-label">Start</span>
            <span class="meta-value">{{ startDateText || '--' }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">End</span>
            <span class="meta-value">{{ endDateText || '--' }}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="detail-card">
      <div class="card-title">Check-In Rules</div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="card-content" v-html="ruleDesc" />
    </section>

    <section class="detail-card">
      <div class="card-title">Check-In Rewards</div>
      <div class="reward-grid">
        <div v-for="item in signList" :key="item.day" class="reward-item">
          <span class="reward-day">Day {{ item.day }}</span>
          <span class="reward-amount">{{ item.amount }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.detail-page {
  min-height: 100vh;
  background: #121212;
  color: #ffffff;
  padding: 28px 18px 40px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.back-btn {
  width: 38px;
  height: 38px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  width: 16px;
  height: 16px;
  position: relative;
}

.back-icon::before,
.back-icon::after {
  content: '';
  position: absolute;
  width: 2px;
  border-radius: 90px;
  background: #ffffff;
  left: 50%;
  top: 50%;
}

.back-icon::before {
  height: 10px;
  transform: translate(-180%, -10%) rotate(-50deg);
}

.back-icon::after {
  height: 18px;
  transform: translate(-20%, -50%) rotate(30deg);
}

.header-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.header-label {
  margin: 0;
  font-size: 11px;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
}

.header-title {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
}

.hero-card {
  background: #ffffff;
  color: #202020;
  border-radius: 26px;
  padding: 16px;
  display: grid;
  gap: 14px;
}

.hero-media {
  width: 100%;
  height: 170px;
  border-radius: 18px;
  overflow: hidden;
  background: linear-gradient(135deg, #ffb9b7 0%, #ffd5d1 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-placeholder {
  font-family: 'AaHouDiHei', 'Inter', sans-serif;
  font-size: 22px;
  color: #b24747;
  letter-spacing: 1px;
}

.hero-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.hero-title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
}

.hero-desc {
  margin: 0;
  font-size: 12px;
  line-height: 1.6;
  color: #666666;
}

.hero-meta {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 6px;
}

.meta-item {
  background: #f8f1f1;
  border-radius: 12px;
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.meta-label {
  font-size: 10px;
  color: #b26a6a;
}

.meta-value {
  font-size: 12px;
  font-weight: 600;
  color: #3a1f1f;
}

.detail-card {
  background: rgba(255, 255, 255, 0.95);
  color: #222222;
  border-radius: 22px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.card-title {
  font-size: 14px;
  font-weight: 700;
  color: #b24747;
}

.card-content {
  font-size: 12px;
  line-height: 1.7;
  color: #444444;
}

.card-content :deep(p) {
  margin: 0 0 8px;
}

.card-content :deep(ul),
.card-content :deep(ol) {
  margin: 0 0 8px;
  padding-left: 16px;
}

.reward-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.reward-item {
  background: #ffecec;
  border-radius: 14px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.reward-day {
  font-size: 12px;
  color: #c14b55;
  font-weight: 600;
}

.reward-amount {
  font-size: 14px;
  font-weight: 700;
  color: #c14b55;
}
</style>
