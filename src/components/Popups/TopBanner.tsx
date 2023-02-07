import { useCallback } from 'react'
import { X } from 'react-feather'
import { useMedia } from 'react-use'
import styled, { css, keyframes } from 'styled-components'

import Announcement from 'components/Icons/Announcement'
import { NotificationPayload } from 'components/Popups'
import CtaButton from 'components/Popups/CtaButton'
import useTheme from 'hooks/useTheme'
import { PopupType } from 'state/application/actions'
import { useActivePopups, useRemovePopup } from 'state/application/hooks'
import { ExternalLink, MEDIA_WIDTHS } from 'theme'

const BannerWrapper = styled.div<{ color?: string }>`
  width: 100%;
  padding: 10px 12px 10px 20px;
  background: ${({ theme, color }) => color ?? theme.warning};
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    align-items: flex-start;
    flex-direction: column;
    padding: 12px;
    gap: 12px;
  `}
`

const StyledClose = styled(X)`
  color: white;
  :hover {
    cursor: pointer;
  }
`

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  gap: 8px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 14px;
    flex: 1;
    width:100%;
  `}
`

const marquee = () => keyframes`
  0% { left: 0; }
  100% { left: -100%; }
`
const TextWrapper = styled.div`
  margin-left: 4px;
  margin-right: 1rem;
  color: ${({ theme }) => theme.text};
  overflow: hidden;
  ${({ theme }) => theme.mediaWidth.upToSmall`${css`
    max-width: 100%;
    flex: 1;
    height: 20px;
    position: relative;
    margin: 0;
  `}
  `}
`
const TextContent = styled.div`
  line-height: 20px;
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    white-space: nowrap;
    animation: ${marquee} 5s linear infinite;
    position: absolute;
  `}
`
const StyledCtaButton = styled(CtaButton)`
  width: 140px;
  height: 36px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
  `}
`
const StyledLink = styled(ExternalLink)`
  &:hover {
    text-decoration: none;
  }
`
function TopBanner() {
  // todo check this show or not => change posiion banner top right
  const theme = useTheme()
  const below768 = useMedia(`(max-width: ${MEDIA_WIDTHS.upToSmall}px)`)
  const popups = useActivePopups()
  const popupInfo = popups.find(e => e.popupType === PopupType.TOP_BAR)

  const removePopup = useRemovePopup()
  const popKey = popupInfo?.key
  const hideBanner = useCallback(() => popKey && removePopup(popKey), [popKey, removePopup])

  if (!popupInfo) return null
  const {
    templateBody: { content, actions = [] },
  } = popupInfo.content as NotificationPayload
  const closeBtn = <StyledClose size={24} onClick={hideBanner} />
  const color = theme.warning // todo
  return (
    <BannerWrapper color={color}>
      {!below768 && <div />}
      <Content>
        {!below768 && <Announcement />}
        <TextWrapper>
          <TextContent>{content}</TextContent>
        </TextWrapper>
        {below768 && closeBtn}
      </Content>
      <StyledLink href={actions[0]?.url}>
        <StyledCtaButton data={actions[0]} />
      </StyledLink>
      {!below768 && closeBtn}
    </BannerWrapper>
  )
}

export default TopBanner
