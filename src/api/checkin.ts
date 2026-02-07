// 这是一个示例API模块，你需要根据你的后端接口进行修改
import request from '@/utils/request'

// 假设你的API返回这样的数据结构
interface CheckInStatusResponse {
  isCheckedIn: boolean
  checkInDays: number
}

// 假设签到成功后，API返回这样的数据
interface CheckInResponse {
  success: boolean
  checkInDays: number
}

// 封装获取签到状态的请求
export const fetchCheckInStatus = () => {
  // request 拦截器会处理响应，直接返回后端响应体中的 `data` 字段
  // 所以此函数的返回值类型是 Promise<CheckInStatusResponse>
  return request.get<CheckInStatusResponse>('/checkin/status')
}

// 封装执行签到的请求
export const performCheckIn = () => {
  // 返回值类型是 Promise<CheckInResponse>
  return request.post<CheckInResponse>('/checkin')
}
