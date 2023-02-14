import { useCallback, useEffect, useRef, useState } from 'react'
import { useMedia } from 'react-use'
import AnnouncementApi from 'services/annoucement'
import styled, { css } from 'styled-components'

import AnnouncementView from 'components/Announcement/AnnoucementView'
import { formatNumberOfUnread, getListAnnouncement, getListInbox } from 'components/Announcement/helper'
import { Announcement, AnnouncementTemplateType, PrivateAnnouncement } from 'components/Announcement/type'
import NotificationIcon from 'components/Icons/NotificationIcon'
import MenuFlyout from 'components/MenuFlyout'
import Modal from 'components/Modal'
import { useActiveWeb3React } from 'hooks'
import useTheme from 'hooks/useTheme'
import { ApplicationModal } from 'state/application/actions'
import { useModalOpen, useToggleNotificationCenter } from 'state/application/hooks'
import { MEDIA_WIDTHS } from 'theme'

const StyledMenuButton = styled.button<{ active?: boolean }>`
  border: none;
  margin: 0;
  padding: 0;
  height: 40px;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.text};
  border-radius: 999px;
  position: relative;
  outline: none;
  background-color: transparent;
  :hover {
    cursor: pointer;
  }

  ${({ active }) =>
    active
      ? css`
          background-color: ${({ theme }) => theme.buttonBlack};
        `
      : ''}
`

const StyledMenu = styled.div`
  margin-left: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
  text-align: left;
`

const Badge = styled.div`
  border-radius: 16px;
  position: absolute;
  top: -6px;
  right: -16px;
  background-color: ${({ theme }) => theme.primary};
  padding: 2px 4px 1px 4px;
  font-weight: 500;
  min-width: 20px;
  text-align: center;
`

const browserCustomStyle = css`
  padding: 0;
`

export default function AnnouncementComponent() {
  const { account } = useActiveWeb3React()
  const node = useRef<HTMLDivElement>(null)

  const open = useModalOpen(ApplicationModal.NOTIFICATION_CENTER)
  const toggle = useToggleNotificationCenter()
  const isMobile = useMedia(`(max-width: ${MEDIA_WIDTHS.upToSmall}px)`)

  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [inboxes, setInbox] = useState<PrivateAnnouncement[]>([])
  const [numberOfUnreadInbox, setNumberOfUnreadInbox] = useState(0)
  const [numberOfUnreadGeneral, setNumberOfUnreadGeneral] = useState(0)
  const { useGetAnnouncementsQuery, useGetPrivateAnnouncementsQuery } = AnnouncementApi
  // const { data, refetch: refetchAnnouncement } = useGetAnnouncementsQuery()
  // const { data: x, refetch: refetchPrivateAnnouncement } = useGetAnnouncementsQuery()

  // const refreshAnnouncement = () => {
  //   refetchAnnouncement()
  //   refetchPrivateAnnouncement()
  // }

  const fetchData = useCallback(async () => {
    try {
      await Promise.allSettled([getListAnnouncement(), account ? getListInbox() : Promise.resolve([])])
      setNumberOfUnreadGeneral(0)

      setAnnouncements(
        Array.from(
          { length: 10 },
          (x, y) =>
            ({
              isRead: Math.random() < 0.5,
              id: y,
              title: Math.random() + '',
              startAt: Date.now(),
              actionURL: '',
            } as any),
        ),
      )
      setNumberOfUnreadInbox(0)
      setInbox(
        Array.from({ length: 10 }, (x, y) => ({
          id: y,
          templateType: y % 2 ? AnnouncementTemplateType.BRIDGE : AnnouncementTemplateType.TRENDING_SOON_TOKEN,
          templateId: y,
          templateBody: {
            order: {
              id: 1663,
              chainId: '5',
              nonce: 7,
              makerAsset: '0x48f6d7dae56623dde5a0d56b283165cae1753d70',
              takerAsset: '0x63435cf71274ed12d9bfbc18440a4975764f74fd',
              makerAssetSymbol: 'ETH',
              takerAssetSymbol: 'DAI',
              makerAssetLogoURL:
                'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
              takerAssetLogoURL:
                'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
              makerAssetDecimals: 18,
              takerAssetDecimals: 18,
              makingAmount: '1000000000000000',
              takingAmount: '1000000000000000',
              filledMakingAmount: '0',
              filledTakingAmount: '0',
              status: 'open',
              createdAt: 1676342280,
              expiredAt: 1676947073,
            },
            transaction: {
              id: 22,
              userAddress: '0x3f499def42cd6De917A2A8da02F71fC9517E650C',
              srcChainId: '1',
              dstChainId: '56',
              srcTxHash: '0xe2c5ee46016ad9b40d9aa5565cefed53fdb41ddd8b9086ee91fa9692e1b6ed4e',
              dstTxHash: '0x0b6da2d86c44912e66d9564801bd35fb05181078bfc56a4a47a26abfd3159556',
              srcTokenSymbol: 'KNC',
              dstTokenSymbol: 'KNC',
              srcAmount: '12.3456',
              dstAmount: '11.2326',
              status: 1,
              createdAt: 1672890601,
            },
            tokens: [
              {
                tokenSymbol: 'knc',
                price: '1.2',
                priceChange: '20',
                tokenLogoURL:
                  'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
                tokenAddress: '0x3f499def42cd6De917A2A8da02F71fC9517E650C',
              },
              {
                tokenSymbol: 'knc',
                price: '1.2',
                priceChange: '20',
                tokenLogoURL:
                  'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
                tokenAddress: '0x3f499def42cd6De917A2A8da02F71fC9517E650C',
              },
              {
                tokenSymbol: 'knc',
                price: '1.2',
                priceChange: '20',
                tokenLogoURL:
                  'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
                tokenAddress: '0x3f499def42cd6De917A2A8da02F71fC9517E650C',
              },
            ],
          } as any,
        })),
      )
    } catch (e) {
      console.error('get Announcement Error', e)
    }
  }, [account])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const props = {
    numberOfUnreadInbox,
    numberOfUnreadGeneral,
    announcements,
    inboxes,
    refreshAnnouncement: fetchData,
  }

  const numberOfUnread = numberOfUnreadInbox + numberOfUnreadGeneral

  return (
    <StyledMenu ref={node}>
      <StyledMenuButton active={open || numberOfUnread > 0} onClick={toggle} aria-label="Notifications">
        <NotificationIcon />
        {numberOfUnread > 0 && <Badge>{formatNumberOfUnread(numberOfUnread)}</Badge>}
      </StyledMenuButton>

      {isMobile ? (
        <Modal isOpen={open} onDismiss={toggle} minHeight={80}>
          <AnnouncementView {...props} />
        </Modal>
      ) : (
        <MenuFlyout browserCustomStyle={browserCustomStyle} node={node} isOpen={open} toggle={toggle}>
          <AnnouncementView {...props} />
        </MenuFlyout>
      )}
    </StyledMenu>
  )
}
