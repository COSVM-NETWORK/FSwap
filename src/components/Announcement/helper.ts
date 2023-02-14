import { useCallback } from 'react'
import { useLocalStorage } from 'react-use'

import { AnnouncementPayload } from 'components/Announcement/type'

export const getListAnnouncement = () => {
  return Promise.resolve() //axios.get('')
}

export const getListInbox = () => {
  return Promise.resolve() //axios.get('')
}

export const useAckAnnouncement = () => {
  const [announcementsMap, setAnnouncementsMap] = useLocalStorage<{ [id: string]: string }>('announcements', {})
  const ackAnnouncement = useCallback(
    (id: string | number) =>
      setAnnouncementsMap({
        ...announcementsMap,
        [id]: '1',
      }),
    [announcementsMap, setAnnouncementsMap],
  )
  return { announcementsAckMap: announcementsMap ?? {}, ackAnnouncement }
}

export const formatNumberOfUnread = (num: number) => (num > 10 ? '10+' : num)

export const isPopupExpired = (popupInfo: AnnouncementPayload, announcementsAckMap: { [id: string]: string }) => {
  const { expiredAt, startTime, metaMessageId } = popupInfo
  return announcementsAckMap[metaMessageId] || Date.now() < startTime || Date.now() > expiredAt
}
