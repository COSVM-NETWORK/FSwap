import { NotificationPayload } from 'components/Popups'

export const isPopupExpired = (popupInfo: NotificationPayload) => {
  const { expiredAt, startTime } = popupInfo
  return Date.now() < startTime || Date.now() > expiredAt
}
