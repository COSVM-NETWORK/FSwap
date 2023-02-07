import styled from 'styled-components'

import { ButtonError, ButtonPrimary, ButtonWarning } from 'components/Button'
import { NotificationCTA } from 'components/Popups'

function CtaButton({ data, className = '' }: { data: NotificationCTA; className?: string }) {
  if (!data) return null
  const { title, color, id } = data
  const props = { className, id }
  switch (color) {
    case 'warning':
      return <ButtonWarning {...props}>{title}</ButtonWarning>
    case 'success':
      return <ButtonPrimary {...props}>{title}</ButtonPrimary>
    case 'error':
      return <ButtonError {...props}>{title}</ButtonError>
    default:
      return null
  }
}
export default styled(CtaButton)``
