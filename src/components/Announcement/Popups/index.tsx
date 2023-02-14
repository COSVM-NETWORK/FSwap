import { Trans } from '@lingui/macro'
import { useEffect } from 'react'
import styled from 'styled-components'

import CenterPopup from 'components/Announcement/Popups/CenterPopup'
import SnippetPopup from 'components/Announcement/Popups/SnippetPopup'
import { AnnouncementPayload, AnnouncementTemplateType } from 'components/Announcement/type'
import { ButtonEmpty } from 'components/Button'
import { Z_INDEXS } from 'constants/styles'
import { useActiveWeb3React } from 'hooks'
import { PopupType } from 'state/application/actions'
import {
  useActivePopups,
  useAddPopup,
  useNotify,
  useRemoveAllPopupByType,
  useToggleNotificationCenter,
} from 'state/application/hooks'
import { subscribeAnnouncement, subscribePrivateAnnouncement } from 'utils/firebase'

import PopupItem from './TopRightPopup'

const FixedPopupColumn = styled.div`
  position: fixed;
  top: 108px;
  right: 1rem;
  z-index: ${Z_INDEXS.POPUP_NOTIFICATION};
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    left: 0;
    right: 0;
    top: 80px;
    align-items: center;
  `};
`

const ActionWrapper = styled.div`
  gap: 10px;
  justify-content: flex-end;
  display: flex;
  width: 100%;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding-right: 16px;
  `};
`

const ActionButton = styled(ButtonEmpty)`
  background-color: ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.text};
  border-radius: 30px;
  padding: 4px 10px;
  width: fit-content;
  border-radius: 30px;
  font-size: 10px;
`

const Overlay = styled.div`
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: red;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 40.1%, rgba(0, 0, 0, 0.8) 100%);
`

const MAX_NOTIFICATION = 4

export default function Popups() {
  const { topRightPopups, centerPopups, snippetPopups } = useActivePopups()
  const centerPopup = centerPopups[centerPopups.length - 1]

  const { account } = useActiveWeb3React()

  const toggleNotificationCenter = useToggleNotificationCenter()
  const notify = useNotify()
  const addPopup = useAddPopup()

  const removeAllPopupByType = useRemoveAllPopupByType()

  const clearAllTopRightPopup = () => removeAllPopupByType(PopupType.TOP_RIGHT)
  const clearAllSnippetPopup = () => removeAllPopupByType(PopupType.SNIPPET)
  const clearAllCenterPopup = () => removeAllPopupByType(PopupType.CENTER)

  const test = (): AnnouncementPayload =>
    ({
      metaMessageId: Math.random(),
      templateType: AnnouncementTemplateType.BRIDGE,
      templateBody: {
        title: 'string',
        content: 'string',
        actions: [
          { id: 'test', title: 'string', url: 'string', color: 'primary' },
          // { id: 'test2', title: 'string', url: 'string', color: 'primary' },
        ],
        thumbnailImageURL: 'string',
        popupType: PopupType.CENTER,
      },
      expiredAt: Date.now() + 50000000,
      createdAt: Date.now() - 50000000,
      startTime: Date.now() - 50000000,
    } as any)
  useEffect(() => {
    const unsubscribe = subscribeAnnouncement(data => {
      console.log(123, data)
      // addPopup(test(), PopupType.TOP_BAR, (test().templateBody as any).title + Math.random(), null) // todo filter expired
      // addPopup(test(), PopupType.CENTER, (test().templateBody as any).title + Math.random(), null) // todo filter expired
      // addPopup(test(), PopupType.SNIPPET, (test().templateBody as any).title + Math.random(), null) // todo filter expired
      // addPopup(test(), PopupType.SNIPPET, (test().templateBody as any).title + Math.random(), null) // todo filter expired
    })

    const unsubscribePrivate = subscribePrivateAnnouncement(account, data => {
      console.log(123, data)
      // notify({ title: 'test', type: NotificationType.WARNING }, null) // todo filter expired
      // addPopup(test(), PopupType.TOP_RIGHT, (test().templateBody as any).title + Math.random(), null) // todo filter expired
    })
    return () => {
      unsubscribe?.()
      unsubscribePrivate?.()
    }
  }, [account])

  // todo check mobile, dark mode, check noti thuong hay noti kia

  const totalTopRightPopup = topRightPopups.length
  // todo xem may thong baso chung chung slice roi sao nua ???
  return (
    <>
      {topRightPopups.length > 0 && (
        <FixedPopupColumn>
          <ActionWrapper>
            {totalTopRightPopup >= MAX_NOTIFICATION && (
              <ActionButton onClick={toggleNotificationCenter}>
                <Trans>See All</Trans>
              </ActionButton>
            )}
            {totalTopRightPopup > 1 && (
              <ActionButton onClick={clearAllTopRightPopup}>
                <Trans>Clear All</Trans>
              </ActionButton>
            )}
          </ActionWrapper>

          {topRightPopups.slice(0, MAX_NOTIFICATION).map(item => (
            <PopupItem key={item.key} popup={item} />
          ))}

          {totalTopRightPopup >= MAX_NOTIFICATION && <Overlay />}
        </FixedPopupColumn>
      )}
      {snippetPopups.length > 0 && <SnippetPopup data={snippetPopups} clearAll={clearAllSnippetPopup} />}
      {centerPopup && <CenterPopup data={centerPopup} clearAll={clearAllCenterPopup} />}
    </>
  )
}
