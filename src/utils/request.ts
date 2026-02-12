import { useUserStore } from '@/store/modules/user'
import type { AxiosInstance, AxiosResponse } from 'axios'
import axios from 'axios'
import { showToast } from 'vant'
import { noEncryptPaths, SITE } from './crypto-config'
import { AESUtils } from './encrypt'
import { StringExtension } from './string-extension'

// 创建 axios 实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    site: SITE,
    TraceId: 'f4c7be16c52a26a5d84312ac3866c974',
    channelId: '1',
    languageCode: 'eng',
    bundleId: '1.0.0',
    Authorization: 'ea9025b925e01580da2eb0f0b0cf7d03',
    'X-Auth-Token': '2dbb5871-3bf8-4d27-8ef5-27ac92f9c475'
  }
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    // const uuid = uuidv4()  //测试根据账号更换
    const uuid = 'cd66edc0-0a5d-49aa-a8a9-50ec14f9107a'

    config.headers.uuid = uuid
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`
    }
    if (!noEncryptPaths.includes(config.url || '')) {
      try {
        const encryptKey = StringExtension.tail16(uuid)
        if (config.method?.toUpperCase() === 'GET') {
          if (config.params) {
            config.params = {
              data: AESUtils.encryptAES(JSON.stringify(config.params), encryptKey)
            }
          }
        } else if (config.method?.toUpperCase() === 'POST') {
          // eslint-disable-next-line no-undef
          if (!(config.data instanceof FormData)) {
            if (config.data) {
              config.data = {
                data: AESUtils.encryptAES(JSON.stringify(config.data), encryptKey)
              }
            }
          }
        }
      } catch (e) {
        console.error('请求加密失败:', e)
      }
    }

    console.log('请求头:', config.headers, '路径:', config.url)
    return config
  },
  (error) => {
    console.error('请求错误：', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    if (!noEncryptPaths.includes(response.config.url || '')) {
      const uuid = response.config.headers.uuid as string
      console.log('UUID:', uuid)

      try {
        if (typeof response.data === 'string') {
          const encryptKey = StringExtension.tail16(uuid)
          response.data = AESUtils.decryptAES(response.data, encryptKey)
        }
      } catch (e) {
        console.error('错误详情:', e)
      }
    }
    const res = response.data
    const isSuccess =
      res.code === 200 || res.code === 0 || res.code === 'C2' || res.success === true

    if (!isSuccess) {
      showToast({
        message: res.message || '请求失败',
        position: 'top',
        teleport: '#app'
      })
      return Promise.reject(new Error(res.message || '请求失败'))
    }

    return res
  },
  (error) => {
    console.error('响应错误：', error)

    let message = '网络错误'
    if (error.response) {
      switch (error.response.status) {
        case 401:
          message = '未授权，请重新登录'
          // 可以在这里处理登出逻辑
          break
        case 403:
          message = '拒绝访问'
          break
        case 404:
          message = '请求错误，未找到该资源'
          break
        case 500:
          message = '服务器错误'
          break
        default:
          message = error.response.data?.message || '请求失败'
      }
    }

    showToast({
      message,
      position: 'top',
      teleport: '#app'
    })

    return Promise.reject(error)
  }
)

export default service
