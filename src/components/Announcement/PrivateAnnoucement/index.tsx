import InboxItemBridge from 'components/Announcement/PrivateAnnoucement/InboxItemBridge'
import InboxItemLO from 'components/Announcement/PrivateAnnoucement/InboxItemLO'
import InboxItemTrendingSoon from 'components/Announcement/PrivateAnnoucement/InboxItemTrendingSoon'
import { AnnouncementTemplateType, PrivateAnnouncement } from 'components/Announcement/type'

export default function InboxItem({ announcement, onRead }: { announcement: PrivateAnnouncement; onRead: () => void }) {
  const { templateType } = announcement
  const props = { announcement, onRead }
  switch (templateType) {
    case AnnouncementTemplateType.BRIDGE:
      return <InboxItemBridge {...props} />
    case AnnouncementTemplateType.LIMIT_ORDER:
      return <InboxItemLO {...props} />
    case AnnouncementTemplateType.TRENDING_SOON_TOKEN:
      return <InboxItemTrendingSoon {...props} />
    default:
      return null
  }
}
