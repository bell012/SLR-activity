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
  status: number // 状态：0-草稿，1-发行中，2-已停发，3-过期
  bindData: {
    bindWithdrawalAccount: number //是否绑定出款账号 0否 1是
    bindWithdrawalName: number //是否绑定出款姓名 0否 1是
  }
  completeInfo: {
    completeWhatsapp: number //是否完善Whatsapp 0否 1是
    completeFacebook: number //是否完善Facebook 0否 1是
    completeTelegram: number //是否完善Telegram 0否 1是
  }
  completeVerification: {
    verifyPhone: number //是否验证手机号码 0否 1是
  }
  conditionType: number[] //条件类型列表：1-充值，2-打码，3-亏损，4-邀请注册 可以多选，例如：[1, 2] 表示同时设置充值和打码条件
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

// 中奖数据  请求参数
export interface TicketMarqueeParams {
  ticketType: number // 类型
}

// 中奖数据  响应数据
export interface TicketMarqueeResponse {
  code: string
  message: string
  result: {
    enabled: boolean //是否启用跑马灯
    records: Array<{
      memberAccount: string //会员账号
      amountDisplay: string //金额展示
      winTime: number //中奖时间
    }>
  }
  success: boolean
}
