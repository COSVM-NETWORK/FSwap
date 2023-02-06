// import { rgba } from 'polished'
import { ChainId } from '@kyberswap/ks-sdk-core'
import { Fragment, ReactNode, useEffect, useState } from 'react'
import { X } from 'react-feather'
import { useLocalStorage, useMedia } from 'react-use'
import { Text } from 'rebass'
import styled, { css, keyframes } from 'styled-components'

import { ButtonOutlined, ButtonPrimary } from 'components/Button'
import Announcement from 'components/Icons/Announcement'
import { useActiveWeb3React } from 'hooks'
import useMarquee from 'hooks/useMarquee'
import { ExternalLink, MEDIA_WIDTHS } from 'theme'

const BannerWrapper = styled.div`
  width: 100%;
  padding: 10px 12px 10px 20px;
  background: ${({ theme }) => theme.apr};
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
const CtaButton = styled(ButtonOutlined)`
  width: 140px;
  height: 36px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
  `}
`

type Banner = {
  key: string
  start: string
  end: string
  onlyChains: ChainId[]
  text: ReactNode
}

const banners: Banner[] = [
  {
    key: 'bsc-maintenance',
    start: 'Thu, 7 Oct 2022 00:00:00 GMT',
    end: 'Thu, 7 Oct 2022 00:00:00 GMT',
    onlyChains: [ChainId.BSCMAINNET],
    text: 'BNB Chain is currently under maintenance and has been paused temporarily. For further info please refer to ',
  },
]

function TopBanner() {
  // todo check this show or not => change posiion banner top right
  const below768 = useMedia(`(max-width: ${MEDIA_WIDTHS.upToSmall}px)`)

  const [showBanner, setShowBanner] = useLocalStorage('banners', {})
  const { chainId } = useActiveWeb3React()

  const [show, setShow] = useState<{ [key: string]: boolean | undefined }>({})

  useEffect(() => {
    setTimeout(() => setShow(showBanner || {}), 200)
  }, [showBanner])

  const renderBanner = (banner: Banner) => {
    // const now = new Date()
    // if (now < new Date(banner.start) || now > new Date(banner.end)) {
    //   return null
    // }
    const closeBtn = <StyledClose size={24} onClick={() => setShowBanner({ ...showBanner, [banner.key]: false })} />
    return (
      <BannerWrapper key={banner.key}>
        {!below768 && <div />}
        <Content>
          {!below768 && <Announcement />}
          <TextWrapper>
            <TextContent>{banner.text}</TextContent>
          </TextWrapper>
          {below768 && closeBtn}
        </Content>
        <CtaButton>CTA</CtaButton>
        {!below768 && closeBtn}
      </BannerWrapper>
    )
  }
  return <>{banners.map(renderBanner)}</>
}

export default TopBanner
