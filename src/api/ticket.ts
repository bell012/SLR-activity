import request from '@/utils/request'
import type {
  TicketMbTicketListResponse,
  TicketProgressParams,
  TicketProgressResponse,
  TicketMarqueeParams,
  TicketMarqueeResponse
} from '@/interface/ticket_interface'

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

/**
 * 会员票券查询
 * @returns Promise<TicketMbTicketListResponse>
 */
export const ticketMbTicketList = (params = {}): Promise<TicketMbTicketListResponse> => {
  return request.post('/ticket/api/mbTicketList', params) as Promise<TicketMbTicketListResponse>
}

/**
 * 会员票券完成进度查询
 * @param params 请求参数，包含 rowId
 * @returns Promise<TicketProgressResponse>
 */
export const ticketProgress = (params: TicketProgressParams): Promise<TicketProgressResponse> => {
  return request.post('/ticket/api/progress', params) as Promise<TicketProgressResponse>
}

/**
 * 中奖数据
 * @param params 请求参数
 * @returns Promise<TicketMarqueeResponse>
 */
export const ticketMarquee = (params: TicketMarqueeParams): Promise<TicketMarqueeResponse> => {
  return request.post('/ticket/api/marquee', params) as Promise<TicketMarqueeResponse>
}

export default {
  getMbTicketList,
  ticketMbTicketList,
  ticketProgress,
  ticketMarquee
}
