import request from '@/utils/request'

// 活动列表类型
export interface TicketListResponse {
  code: number
  message: string
  data: any
}

/**
 * 活动列表
 * @returns Promise<TicketListResponse>
 */
export const getMbTicketList = (params = {}) => {
  return request.post<TicketListResponse>('/activity/api/list', params)
}

export default {
  getMbTicketList
}
