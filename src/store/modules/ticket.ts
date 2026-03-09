import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ticketApi } from '@/api'
import type {
  TicketMbTicketListRes,
  TicketProgressResponse,
  TicketMarqueeResponse
} from '@/interface/ticket_interface'

export const useTicketStore = defineStore('ticket', () => {
  // 票券列表数据
  const ticketList = ref<TicketMbTicketListRes[]>([])
  // 当前选中的票券索引
  const activeTicketIndex = ref(0)
  // 加载状态
  const loading = ref(false)
  // 进度数据 Map，key 为 rowId，value 为进度数据
  const progressDataMap = ref<Record<number, TicketProgressResponse['result']>>({})
  // 中奖数据 Map，key 为 ticketType
  const marqueeDataMap = ref<Record<number, TicketMarqueeResponse['result']>>({})

  /**
   * 获取会员票券列表
   */
  const fetchTicketList = async (params = { current: 1, size: 10 }) => {
    loading.value = true
    try {
      console.log('会员票券查询参数:', params)
      const response = await ticketApi.ticketMbTicketList(params)
      console.log('会员票券数据', response)
      if (response && response.result && Array.isArray(response.result)) {
        ticketList.value = response.result
        // 默认选中第一个
        if (ticketList.value.length > 0) {
          activeTicketIndex.value = 0
        }
      }
      return response
    } catch (error) {
      console.error(error)
      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * 设置当前选中的票券
   */
  const setActiveTicket = (index: number) => {
    if (index >= 0 && index < ticketList.value.length) {
      activeTicketIndex.value = index
    }
  }

  /**
   * 获取当前选中的票券数据
   */
  const getCurrentTicket = () => {
    return ticketList.value[activeTicketIndex.value] || null
  }

  /**
   * 根据 type 获取图标路径
   * @param type 票券类型 1-现金兑换卷, 2-幸运红包卷, 3-砸金蛋票券, 4-大转盘票券
   * @param isActive 是否选中状态
   */
  const getIconByType = (type: number, isActive: boolean = false) => {
    const iconMap: Record<number, string> = {
      1: isActive ? 'j-xianjin-active' : 'j-xianjin',
      2: isActive ? 'j-hongbao-active' : 'j-hongbao',
      3: isActive ? 'j-jindan-active' : 'j-jindan',
      4: isActive ? 'j-zhuanpan-active' : 'j-zhuanpan'
    }
    const iconName = iconMap[type] || 'j-jindan'
    return `/src/static/ticket/${iconName}.png`
  }

  /**
   * 根据 type 获取组件名称
   * @param type 票券类型
   */
  const getComponentNameByType = (type: number) => {
    const componentMap: Record<number, string> = {
      1: 'Xianjin',
      2: 'Hongbao',
      3: 'Jindan',
      4: 'Zhuanpan'
    }
    return componentMap[type] || 'Jindan'
  }

  /**
   * 获取票券完成进度
   * @param rowId 票券id
   */
  const fetchTicketProgress = async (rowId: number) => {
    try {
      console.log('票券进度查询参数:', { rowId })
      const response = await ticketApi.ticketProgress({ rowId })
      console.log('票券进度数据:', response)
      if (response && response.success) {
        progressDataMap.value = {
          ...progressDataMap.value,
          [rowId]: response.result
        }
      }
      return response
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  /**
   * 根据 rowId 获取进度数据
   * @param rowId 票券id
   */
  const getProgressByRowId = (rowId: number) => {
    return progressDataMap.value[rowId] || null
  }

  /**
   * 计算进度百分比
   * @param rowId 票券id
   * @returns 进度百分比 0-100
   */
  const calculateProgressPercentage = (rowId: number): number => {
    const progressData = getProgressByRowId(rowId)

    // 如果没有进度数据，返回 0
    if (!progressData) {
      return 0
    }

    // 统计完成的项目数量
    let completedCount = 0
    const totalCount = 6 // 总共 6 个项目

    // bindData 中的 2 个项目
    if (progressData.bindData.bindWithdrawalAccount) completedCount++
    if (progressData.bindData.bindWithdrawalName) completedCount++

    // completeInfo 中的 3 个项目
    if (progressData.completeInfo.completeWhatsapp) completedCount++
    if (progressData.completeInfo.completeFacebook) completedCount++
    if (progressData.completeInfo.completeTelegram) completedCount++

    // completeVerification 中的 1 个项目
    if (progressData.completeVerification.verifyPhone) completedCount++

    // 计算百分比
    const percentage = Math.round((completedCount / totalCount) * 100)
    return percentage
  }

  /**
   * 获取中奖数据
   * @param ticketType 票券类型
   */
  const fetchMarqueeData = async (ticketType: number) => {
    try {
      console.log('中奖数据查询参数:', ticketType)
      const response = await ticketApi.ticketMarquee({ ticketType })
      console.log('中奖数据', response)
      if (response && response.result) {
        marqueeDataMap.value = {
          ...marqueeDataMap.value,
          [ticketType]: response.result
        }
      }
      return response
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  /**
   * 根据 ticketType 获取中奖数据
   * @param ticketType 票券类型
   */
  const getMarqueeByType = (ticketType: number) => {
    return marqueeDataMap.value[ticketType] || null
  }

  return {
    ticketList,
    activeTicketIndex,
    loading,
    progressDataMap,
    marqueeDataMap,
    fetchTicketList,
    setActiveTicket,
    getCurrentTicket,
    getIconByType,
    getComponentNameByType,
    fetchTicketProgress,
    getProgressByRowId,
    calculateProgressPercentage,
    fetchMarqueeData,
    getMarqueeByType
  }
})
