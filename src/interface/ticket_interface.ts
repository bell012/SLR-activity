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
}

// 会员票券查询  响应数据
export interface TicketMbTicketListResponse {
  code: string
  message: string
  result: TicketMbTicketListRes[]
  success: boolean
}
