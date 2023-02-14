import styled from 'styled-components'

import { AnnouncementCTA } from 'components/Announcement/type'
import { ButtonError, ButtonPrimary, ButtonWarning } from 'components/Button'

function CtaButton({ data, className = '' }: { data: AnnouncementCTA; className?: string }) {
  if (!data) return null
  const { title, color, id } = data
  const props = { className, id }
  switch (color) {
    case 'warning':
      return <ButtonWarning {...props}>{title}</ButtonWarning>
    case 'primary':
      return <ButtonPrimary {...props}>{title}</ButtonPrimary>
    case 'error':
      return <ButtonError {...props}>{title}</ButtonError>
    default:
      return null
  }
}
export default styled(CtaButton)``
