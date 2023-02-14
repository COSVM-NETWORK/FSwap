import { LimitOrder } from 'components/swapv2/LimitOrder/type'
import { MultichainTransfer } from 'hooks/bridge/useGetBridgeTransfers'
import { PopupType } from 'state/application/actions'

export enum AnnouncementTemplateType {
  LIMIT_ORDER = 'LimitOrderFilled',
  BRIDGE = 'Bridge',
  TRENDING_SOON_TOKEN = 'TrendingSoonTokens',
}

type Color = 'primary' | 'warning' | 'error'

export type Announcement = {
  isRead: boolean
  id: string
  title: string
  content: string
  startAt: number
  actionURL: string
}

export type PrivateAnnouncement = {
  id: number
  templateType: AnnouncementTemplateType
  templateId: number
  templateBody: Template
}

export type AnnouncementCTA = { id: string; title: string; url: string; color: Color }

export type TrueSightToken = {
  tokenSymbol: string
  price: string
  priceChange: string
  tokenLogoURL: string
  tokenAddress: string
}

export type AnnouncementTemplatePopup = {
  title: string
  content: string
  actions: AnnouncementCTA[]
  thumbnailImageURL: string
  backgroundColor: Color
  startAt: number
  endAt: number
}
// todo rename all

export type TemplateLimitOrder = { order: LimitOrder }
export type TemplateBridge = { transaction: MultichainTransfer }
export type TemplateTrendingSoon = { tokens: TrueSightToken[] }

type Template = (TemplateLimitOrder | TemplateBridge | TemplateTrendingSoon | AnnouncementTemplatePopup) & {
  popupType: PopupType
}

export type AnnouncementPayload = {
  metaMessageId: number
  templateType: AnnouncementTemplateType
  templateBody: Template
  expiredAt: number
  createdAt: number
  startTime: number
}
