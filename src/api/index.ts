import request from '@/utils/request'
import ticketApi from './ticket'
import checkinApi from './checkin'
import smsApi from './sms'

/**
 * 用户相关接口
 */
export const userApi = {
  getUserInfo: (userId: string) => {
    return request({
      url: `/user/${userId}`,
      method: 'get'
    })
  },

  getUserList: (params: { page: number; pageSize: number }) => {
    return request({
      url: '/user/list',
      method: 'get',
      params
    })
  },
  login: (data: { username: string; password: string }) => {
    return request({
      url: '/user/login',
      method: 'post',
      data
    })
  },

  register: (data: { username: string; password: string; email: string }) => {
    return request({
      url: '/user/register',
      method: 'post',
      data
    })
  }
}

/**
 * 示例接口
 */
export const testApi = {
  getTest: () => {
    return request({
      url: '/test/get',
      method: 'get'
    })
  },

  postTest: (data: any) => {
    return request({
      url: '/test/post',
      method: 'post',
      data
    })
  }
}

// 活动列表
export { ticketApi, checkinApi, smsApi }
