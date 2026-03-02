import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ticketApi } from '@/api'
import type { TicketMbTicketListRes } from '@/interface/ticket_interface'

export const useTicketStore = defineStore('ticket', () => {
  // 票券列表数据
  const ticketList = ref<TicketMbTicketListRes[]>([])
  // 当前选中的票券索引
  const activeTicketIndex = ref(0)
  // 加载状态
  const loading = ref(false)

  /**
   * 获取会员票券列表
   */
  const fetchTicketList = async (params = { current: 1, size: 10 }) => {
    loading.value = true
    try {
      console.log('会员票券查询参数:', params)
      const response = await ticketApi.ticketMbTicketList(params)
      console.log('会员票券完整响应:', response)
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

  return {
    ticketList,
    activeTicketIndex,
    loading,
    fetchTicketList,
    setActiveTicket,
    getCurrentTicket,
    getIconByType,
    getComponentNameByType
  }
})
