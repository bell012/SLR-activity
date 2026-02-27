<script setup lang="ts">
import { checkinApi, ticketApi } from '@/api'
import type { OnlineListItem } from '@/api/checkin'
import backIcon from '@/assets/png/checkin/back-icon.png'
import { useAppStore } from '@/store/modules/app'
import { showToast } from 'vant'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const router = useRouter()
const route = useRoute()
const appStore = useAppStore()
const activityId = computed(() => Number(route.query.activityId) || 0)
// 分页参数
const size = computed(() => Number(route.query.size || 10))
const current = computed(() => Number(route.query.current || 1))
const activityDetail = ref<any | null>(null)
const communityList = ref<OnlineListItem[]>([])

const buildOssUrl = (value?: string) => {
  if (!value) return ''
  if (value.startsWith('http') || value.startsWith('data:')) return value
  const base = appStore.ossDomain?.replace(/\/$/, '') || ''
  if (!base) return value
  const path = value.startsWith('/') ? value : `/${value}`
  return `${base}${path}`
}

const heroImage = computed(() => buildOssUrl(activityDetail.value?.preImage))
const ruleDesc = computed(() => activityDetail.value?.config?.PHP?.ruleDesc || '')

const extractActivityList = (response: any) => {
  if (Array.isArray(response?.result?.records)) return response.result.records
  if (Array.isArray(response?.result)) return response.result
  if (Array.isArray(response)) return response
  return []
}

const fetchActivityDetail = async () => {
  if (!activityId.value) return
  try {
    const response = await ticketApi.getMbTicketList({ size: size.value, current: current.value })
    const list = extractActivityList(response)
    const matched = list.find((item: { rowId?: number }) => Number(item.rowId) === activityId.value)
    if (matched) {
      activityDetail.value = matched
      return
    }
    showToast({ message: '未找到活动信息', position: 'top' })
  } catch (error) {
    showToast({ message: '活动详情获取失败', position: 'top' })
    console.error('活动详情失败:', error)
  }
}
const onlineList = async () => {
  if (!activityId.value) return
  try {
    const response = await checkinApi.onlineList({})
    const list = Array.isArray(response.result?.community) ? response.result.community : []
    communityList.value = list.slice().sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
  } catch (error) {
    // showToast({ message: '活动详情获取失败', position: 'top' })
    console.error('活动详情失败:', error)
  }
}

const handleSocialClick = (item: OnlineListItem) => {
  if (!item.url) return
  window.open(item.url, '_blank', 'noopener,noreferrer')
}

onMounted(async () => {
  fetchActivityDetail()
  onlineList()
})
</script>

<template>
  <div class="detail-page">
    <div class="detail-scale">
      <div class="detail-content">
        <header class="detail-header">
          <button class="detail-back" type="button" aria-label="Back" @click="router.back()">
            <span
              class="detail-back-icon"
              :style="{ backgroundImage: `url(${backIcon})` }"
              aria-hidden="true"
            />
          </button>

          <h1 class="detail-title">Event Rewards</h1>
        </header>

        <div class="detail-body">
          <section class="hero-card">
            <div class="hero-overlay" />
            <div class="hero-text">
              <div class="hero-title">CHECK-IN EVENT</div>
              <div class="hero-subtitle">Check in every day for cash rewards</div>
            </div>
            <div class="hero-pill">Prize money up to 8888</div>
            <div class="hero-visual">
              <div class="hero-glow" />
              <img v-if="heroImage" :src="heroImage" alt="event" class="hero-image" />
            </div>
          </section>

          <section class="social-row">
            <div
              v-for="item in communityList"
              :key="item.rowId"
              class="social-item"
              role="button"
              tabindex="0"
              @click="handleSocialClick(item)"
              @keydown.enter.prevent="handleSocialClick(item)"
              @keydown.space.prevent="handleSocialClick(item)"
            >
              <img
                class="social-icon"
                :src="buildOssUrl(item.imageUrl)"
                :alt="item.name"
                loading="lazy"
              />
              <div class="social-label">{{ item.name }}</div>
            </div>
          </section>

          <section class="section-block">
            <div class="section-desc" v-html="ruleDesc"></div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.detail-page {
  min-height: 100vh;
  background: #000000;
  display: flex;
  justify-content: center;
  padding: 20px 0;
  overflow: auto;
}

.detail-scale {
  transform: scale(0.3333);
  transform-origin: top center;
}

.detail-content {
  position: relative;
  width: 1125px;
  min-height: 2304px;
  background: #171717;
  border-radius: 102px 102px 0 0;
  padding-top: 132px;
  color: #ffffff;
  box-sizing: border-box;
}

.detail-header {
  position: absolute;
  top: 54px;
  left: 54px;
  right: 54px;
  height: 114px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.detail-title {
  width: 367px;
  height: 62px;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 51px;
  line-height: 62px;
  text-align: center;
  margin: 0 auto;
}

.detail-back {
  position: absolute;
  left: 0;
  top: 0;
  width: 114px;
  height: 114px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.detail-back-icon {
  width: 60px;
  height: 60px;
  position: relative;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.detail-body {
  position: relative;
  width: 1017px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 45px;
  padding-bottom: 120px;
  padding-top: 120px;
}

.hero-card {
  position: relative;
  width: 1017px;
  height: 389px;
  // background: #ffffff;
  border: 2px solid #252c0e;
  border-radius: 69px;
  overflow: hidden;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(270deg, rgba(0, 0, 0, 0) 0%, #081812 62.02%);
}

.hero-text {
  position: absolute;
  left: 45px;
  top: 45px;
  width: 480px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  z-index: 2;
}

.hero-title {
  font-family: 'Impact', sans-serif;
  font-size: 63px;
  line-height: 77px;
}

.hero-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 39px;
  font-weight: 600;
  line-height: 47px;
}

.hero-pill {
  position: absolute;
  left: 45px;
  bottom: 38px;
  width: 444px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 30px;
  background: rgba(0, 255, 191, 0.1);
  border: 2px solid rgba(0, 255, 191, 0.38);
  border-radius: 39px;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 33px;
  color: #00ff91;
  z-index: 2;
}

.hero-visual {
  position: absolute;
  right: 40px;
  top: 20px;
  width: 491px;
  height: 350px;
}

// .hero-glow {
//   position: absolute;
//   width: 366px;
//   height: 366px;
//   left: 60px;
//   top: 0;
//   background: #ffc800;
//   filter: blur(150px);
//   opacity: 0.6;
// }

.hero-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 32px;
}

.social-row {
  width: 1017px;
  height: 212px;
  display: flex;
  gap: 60px;
  align-items: center;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 0 24px;
  scroll-snap-type: x proximity;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.social-row::-webkit-scrollbar {
  display: none;
}

.social-item {
  width: 165px;
  height: 212px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  flex: 0 0 auto;
  scroll-snap-align: start;
  cursor: pointer;
}

.social-icon {
  width: 150px;
  height: 150px;
  border-radius: 45px;
  background: #1d1d1d;
  object-fit: contain;
  display: block;
}

.social-label {
  font-family: 'Inter', sans-serif;
  font-size: 39px;
  color: #ffffff;
}

.section-block {
  width: 1017px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.section-title {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 48px;
  line-height: 58px;
}

.section-desc {
  font-family: 'Inter', sans-serif;
  font-size: 39px;
  line-height: 47px;
  color: rgba(255, 255, 255, 0.6);
}

.rule-desc :deep(p) {
  margin: 0 0 12px;
}

.rule-desc :deep(p:last-child) {
  margin-bottom: 0;
}

.detail-table {
  width: 1017px;
  border-radius: 36px;
  overflow: hidden;
  border: 2px solid #454545;
}

.table-head {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  background: linear-gradient(180deg, #292929 0%, #222222 100%);
  border-bottom: 1px solid #454545;
  padding: 30px 0;
  text-align: center;
  font-family: 'PingFang SC', sans-serif;
  font-size: 33px;
  color: #dcc277;
}

.table-body {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  background: linear-gradient(180deg, #292929 0%, #222222 100%);
  padding: 36px 0;
  text-align: center;
  font-family: 'Inter', sans-serif;
  font-size: 36px;
  color: #ffffff;
  border-top: 1px solid #454545;
}

.table-body > div {
  padding: 0 16px;
  border-right: 1px solid #454545;
}

.table-body > div:last-child {
  border-right: none;
}
</style>
