export const TicketType = {
  CashVoucher: 1,
  LuckyRedEnvelope: 2,
  GoldenEgg: 3,
  LuckyWheel: 4,
  Pinduoduo: 5
} as const

export type TicketTypeValue = (typeof TicketType)[keyof typeof TicketType]

export type PopupRewardItem = {
  icon: string
  description: string
  quantity: number
  bgColor: string
}

export type TicketRewardMeta = {
  icon: string
  bgColor: string
  fallbackDescription: string
}

export const TICKET_REWARD_META: Record<TicketTypeValue, TicketRewardMeta> = {
  [TicketType.CashVoucher]: {
    icon: '/src/static/ticket/card_xianjin.png',
    bgColor: '#9affb1',
    fallbackDescription: 'Cash Voucher'
  },
  [TicketType.LuckyRedEnvelope]: {
    icon: '/src/static/ticket/card_hongbao.png',
    bgColor: '#fba1a4',
    fallbackDescription: 'Lucky Red Envelope Voucher'
  },
  [TicketType.GoldenEgg]: {
    icon: '/src/static/ticket/card_jindan.png',
    bgColor: '#FEE554',
    fallbackDescription: 'Golden Egg Ticket'
  },
  [TicketType.LuckyWheel]: {
    icon: '/src/static/ticket/card_zhuanpan.png',
    bgColor: '#FA9CFF',
    fallbackDescription: 'Lucky Wheel Ticket'
  },
  [TicketType.Pinduoduo]: {
    icon: '/src/static/ticket/card_xianjin.png',
    bgColor: '#9affb1',
    fallbackDescription: 'Pinduoduo Ticket'
  }
}

export const getTicketRewardMeta = (type: unknown): TicketRewardMeta | null => {
  const ticketType = Number(type)
  if (!Number.isFinite(ticketType)) return null
  return TICKET_REWARD_META[ticketType as TicketTypeValue] ?? null
}
