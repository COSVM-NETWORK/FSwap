import { Trans } from '@lingui/macro'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { ButtonEmpty } from 'components/Button'
import CenterPopup from 'components/Popups/CenterPopup'
import SnippetPopup from 'components/Popups/SnippetPopup'
import { isPopupExpired } from 'components/Popups/helper'
import { Z_INDEXS } from 'constants/styles'
import { PopupContentSimple, PopupContentTxn, PopupType } from 'state/application/actions'
import {
  NotificationType,
  useActivePopups,
  useAddPopup,
  useNotify,
  useRemoveAllPopup,
  useToggleNotificationCenter,
} from 'state/application/hooks'

import PopupItem from './PopupItem'

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

export type NotificationCTA = { id: string; title: string; url: string; color: 'warning' | 'success' | 'error' }
export type NotificationPayload = {
  templateBody: {
    title: string
    content: string
    actions: NotificationCTA[]
    imageURL: string
    popupType: 'central' | 'top_bar'
  }
  expiredAt: number
  createdAt: number
  startTime: number
}

export default function Popups() {
  const popups = useActivePopups()
  const topRightPopups = popups.filter(e => e.popupType === PopupType.SIMPLE || e.popupType === PopupType.TRANSACTION) // todo con cai top right LO,...

  const toggleNotificationCenter = useToggleNotificationCenter()
  const notify = useNotify()
  const addPopup = useAddPopup()

  const [bottomLeftPopups, setBottomLeftPopups] = useState<NotificationPayload[]>([])
  const [centerPopup, setCenterPopup] = useState<NotificationPayload>()

  const clearAllTopRightPopup = useRemoveAllPopup()
  const clearAllSnippetPopup = () => setBottomLeftPopups([])
  const clearAllCenterPopup = () => setCenterPopup(undefined)

  useEffect(() => {
    notify({ title: 'test', type: NotificationType.WARNING }, null) // todo filter expired

    const test = (): NotificationPayload => ({
      templateBody: {
        title: 'string',
        content: 'string',
        actions: [
          { id: 'test', title: 'string', url: 'string', color: 'success' },
          // { id: 'test2', title: 'string', url: 'string', color: 'success' },
        ],
        imageURL: 'string',
        popupType: 'central',
      },
      expiredAt: Date.now() + 50000000,
      createdAt: Date.now() - 50000000,
      startTime: Date.now() - 50000000,
    })

    setBottomLeftPopups([test(), test()].filter(e => !isPopupExpired(e)))
    setCenterPopup(test()) // todo filter expired

    addPopup(test(), PopupType.TOP_BAR, test().templateBody.title + Math.random(), null) // todo filter expired
  }, [])

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
            <PopupItem
              key={item.key}
              popupType={item.popupType}
              content={item.content as PopupContentTxn | PopupContentSimple}
              popKey={item.key}
              removeAfterMs={item.removeAfterMs}
            />
          ))}

          {totalTopRightPopup >= MAX_NOTIFICATION && <Overlay />}
        </FixedPopupColumn>
      )}
      {bottomLeftPopups.length > 0 && <SnippetPopup data={bottomLeftPopups} clearAll={clearAllSnippetPopup} />}
      {centerPopup && <CenterPopup data={centerPopup} clearAll={clearAllCenterPopup} />}
    </>
  )
}
