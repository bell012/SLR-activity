import request from '@/utils/request'
import type { TicketMbTicketListResponse } from '@/interface/ticket_interface'

/**
 * 会员票券查询
 * @returns Promise<TicketMbTicketListResponse>
 */
export const ticketMbTicketList = (params = {}): Promise<TicketMbTicketListResponse> => {
  return request.post('/ticket/api/mbTicketList', params) as Promise<TicketMbTicketListResponse>
}

export default {
  ticketMbTicketList
}
