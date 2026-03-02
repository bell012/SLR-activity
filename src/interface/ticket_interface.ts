// 会员票券查询  请求参数
export interface TicketMbTicketList {
  current: number // 当前页
  size: number //  每页大小
}

// 会员票券查询  单个票券数据
export interface TicketMbTicketListRes {
  expireTime: number // 过期时间
  effectTime: number //  生效时间
  // effectTime > 本地时间，票券延迟生效， 倒计时= effectTime生效 - 本地时间
  // effectTime <= 本地时间, 票券已生效， 倒计时 = expireTime过期时间 - 本地时间
  type: number // 票券类型 1-现金兑换卷, 2-幸运红包卷, 3-砸金蛋票券, 4-大转盘票券, 5-拼多多票券
  languageInfo: Array<{
    description: string
    imageUrl: string
    languageCode: string
    name: string
  }>
  rowId: number // 票券id
}

// 会员票券查询  响应数据
export interface TicketMbTicketListResponse {
  code: string
  message: string
  result: TicketMbTicketListRes[]
  success: boolean
}

// 票券进度查询  请求参数
export interface TicketProgressParams {
  rowId: number // 票券id
}

// 票券进度查询  响应数据
export interface TicketProgressResponse {
  code: string
  message: string
  result: {
    available: boolean //是否可用
    bindData: {
      bindWithdrawalAccount: boolean //是否绑定出款账号
      bindWithdrawalName: boolean //是否绑定出款姓名
    }
    completeInfo: {
      completeWhatsapp: boolean //是否完善Whatsapp
      completeFacebook: boolean //是否完善Facebook
      completeTelegram: boolean //是否完善Telegram
    }
    completeVerification: {
      verifyPhone: boolean //是否验证手机号码
    }
  }
  success: boolean
}
