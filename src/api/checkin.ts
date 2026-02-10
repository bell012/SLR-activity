import request from '@/utils/request'

export interface ApiResponse<T> {
  code: string | number
  message?: string
  success: boolean
  result: T
}

export interface MbSignResult {
  todayIsSign: boolean
  signDays: number
  betAmount: number
  rechargeAmount: number
  todaySignAmount?: number
  historySign: any[]
  startDate?: number
  endDate?: number
}

export type MbHistorySignResult = Array<{
  todayIsSign: boolean
  signDays: number
  betAmount: number
  rechargeAmount: number
  todaySignAmount: number
}>

export interface TicketLanguageInfo {
  languageCode: string
  name: string
  description: string
  imageUrl: string
}

export interface TicketTriggerConfig {
  ticketType: number
  ticketId: number
  ticketName: string
  quantity: number
}

export interface TicketBindData {
  bindWithdrawalAccount: number
  bindWithdrawalName: number
}

export interface TicketCompleteInfo {
  completeWhatsapp: number
  completeFacebook: number
  completeTelegram: number
}

export interface TicketCompleteVerification {
  verifyPhone: number
}

export interface TicketRechargeCondition {
  rechargeMethods: any[]
  depositAmount: {
    enabled: number
    accumulateType: number
    operator: string
    amount: number
    startDate: number
  }
  depositCount: {
    enabled: number
    accumulateType: number
    operator: string
    count: number
    startDate: number
  }
}

export interface TicketWageringCondition {
  validPlatforms: any[]
  validBet: {
    enabled: number
    accumulateType: number
    operator: string
    amount: number
    startDate: number
  }
}

export interface TicketLossCondition {
  gameLossAmount: {
    enabled: number
    accumulateType: number
    operator: string
    amount: number
    startDate: number
  }
}

export interface TicketInviteCondition {
  inviteFriendCount: number
}

export interface TicketWheelConfig {
  rewardType: number
  amount: number
  imageUrl: string
  limitType: number
  limitQuantity: number
  probability: number
}

export interface TicketLuckyRedEnvelopeConfig {
  minAmount: number
  maxAmount: number
  probability: number
}

export interface TicketGoldenEggConfig {
  type: number
  amount: number
  probability: number
}

export interface Ticket {
  rowId: number
  ticketId: number
  type: number
  languageCodes: string[]
  languageInfo: TicketLanguageInfo[]
  receiveTime: number
  expireTime: number
  rewardType: number
  amount: number
  minAmount: number
  maxAmount: number
  enableTrigger: number
  triggerConfig: TicketTriggerConfig[]
  currency: string
  platformGameCodes: any[]
  remark: string
  unusedTicketPopWay: number
  homeDisplay: number
  homeLogoType: number
  homeLogo: string
  status: number
  bindData: TicketBindData
  completeInfo: TicketCompleteInfo
  completeVerification: TicketCompleteVerification
  conditionType: any[]
  rechargeCondition: TicketRechargeCondition
  wageringCondition: TicketWageringCondition
  lossCondition: TicketLossCondition
  inviteCondition: TicketInviteCondition
  wheelConfig: TicketWheelConfig[]
  luckyRedEnvelopeConfig: TicketLuckyRedEnvelopeConfig[]
  goldenEggConfig: TicketGoldenEggConfig[]
  site: string
  createTime: number
}

export interface ReceiveRewardResult {
  resultCode?: string
  activityId: number
  memberRowId: number
  ticketId: number
  ticket: Ticket
  amount: number
  ext: Record<string, any>
}

export const receiveReward = (params: { activityId: number; verifyCode: string }) => {
  return request.post<ApiResponse<ReceiveRewardResult>, ApiResponse<ReceiveRewardResult>>(
    '/activity/checkin/receiveReward',
    params
  )
}

export const mbSign = (params: { activityId: number; verifyCode: string }) => {
  return request.post<ApiResponse<MbSignResult>, ApiResponse<MbSignResult>>(
    '/activity/checkin/mbSign',
    params
  )
}

export const mbHistorySign = (params: { activityId: number; verifyCode: string }) => {
  return request.post<ApiResponse<MbHistorySignResult>, ApiResponse<MbHistorySignResult>>(
    '/activity/checkin/mbHistorySign',
    params
  )
}

export default {
  receiveReward,
  mbSign,
  mbHistorySign
}
