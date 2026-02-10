import request from '@/utils/request'
import type { ApiResponse } from './checkin'

export const sendSmsCode = (params: { phone: string }) => {
  return request.post<ApiResponse<unknown>, ApiResponse<unknown>>('/sy/sms', params)
}

export default {
  sendSmsCode
}
