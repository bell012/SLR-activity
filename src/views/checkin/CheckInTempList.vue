<template>
  <div class="checkin-temp-page">
    <van-nav-bar title="临时活动列表" left-arrow @click-left="router.back()" />

    <div class="content">
      <van-field v-model="memberId" label="memberId" placeholder="请输入 memberId" clearable />

      <van-button type="primary" block :loading="listLoading" @click="fetchActivityList">
        刷新活动列表
      </van-button>

      <van-empty v-if="!listLoading && activityList.length === 0" description="暂无活动数据" />

      <div v-else class="list">
        <van-cell
          v-for="(item, index) in activityList"
          :key="`${item.rowId ?? index}`"
          clickable
          :title="`type: ${item.type ?? '--'}`"
          :label="`rowId: ${item.rowId ?? '--'}`"
          @click="handleSelect(item)"
        >
          <template #value>
            <span class="go-text">进入</span>
          </template>
        </van-cell>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ticketApi } from '@/api'
import { showToast } from 'vant'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

type ActivityItem = {
  rowId?: number | string
  type?: number | string
  [key: string]: unknown
}

const router = useRouter()
const memberId = ref('1000011590')
const listLoading = ref(false)
const activityList = ref<ActivityItem[]>([])

const extractActivityList = (response: any): ActivityItem[] => {
  if (Array.isArray(response?.result?.records)) return response.result.records
  if (Array.isArray(response?.result)) return response.result
  if (Array.isArray(response?.data?.records)) return response.data.records
  if (Array.isArray(response?.data)) return response.data
  return []
}

const fetchActivityList = async () => {
  listLoading.value = true
  try {
    const response = await ticketApi.getMbTicketList({ size: 100, current: 1 })
    activityList.value = extractActivityList(response)
    if (activityList.value.length === 0) {
      showToast({
        message: '活动列表为空',
        position: 'top'
      })
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : '活动列表获取失败'
    showToast({
      message,
      position: 'top'
    })
    console.error('getMbTicketList 失败:', error)
  } finally {
    listLoading.value = false
  }
}

const resolveRowId = (item: ActivityItem) => {
  const raw = item?.rowId ?? item?.activityId ?? item?.id
  const numeric = Number(raw)
  return Number.isFinite(numeric) && numeric > 0 ? numeric : 0
}

const handleSelect = (item: ActivityItem) => {
  const rowId = resolveRowId(item)
  if (!rowId) {
    showToast({
      message: '当前活动缺少 rowId',
      position: 'top'
    })
    return
  }

  const member = memberId.value.trim() || '1000011590'
  router.push({
    name: 'CheckIn',
    query: {
      rowId: String(rowId),
      size: 100, // 每页数量
      current: 1, // 当前页码
      languageCode: 'eng',
      // activityId: String(rowId),
      memberId: member
    }
  })
}

onMounted(() => {
  void fetchActivityList()
})
</script>

<style scoped lang="scss">
.checkin-temp-page {
  min-height: 100vh;
  background: #f7f8fa;
}

.content {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.list {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.go-text {
  color: #ff976a;
  font-weight: 600;
}
</style>
