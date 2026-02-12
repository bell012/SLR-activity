import request from '@/utils/request'
import type { ApiResponse } from './checkin'

export interface SelectMemberResult {
  memberId?: string
  areaCode?: string
}

export const sendSmsCode = (params: { telephone: string; areaCode: string }) => {
  return request.post<ApiResponse<unknown>, ApiResponse<unknown>>('/sy/sms', params)
}
export const selectMember = (params: { memberId: string }) => {
  return request.post<ApiResponse<SelectMemberResult>, ApiResponse<SelectMemberResult>>(
    '/mc/selectMember ',
    params
  )
}

export default {
  sendSmsCode,
  selectMember
}
