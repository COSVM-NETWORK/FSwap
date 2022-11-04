import { Trans, t } from '@lingui/macro'
import { lighten } from 'polished'
import { useMemo, useState } from 'react'
import { Text } from 'rebass'
import styled, { css } from 'styled-components'

import { ButtonLight, ButtonPrimary } from 'components/Button'
import { AutoColumn, ColumnCenter } from 'components/Column'
import ExpandableBox from 'components/ExpandableBox'
import HistoryIcon from 'components/Icons/History'
import Wallet from 'components/Icons/Wallet'
import WarningIcon from 'components/Icons/WarningIcon'
import InfoHelper from 'components/InfoHelper'
import { AutoRow, RowBetween } from 'components/Row'
import { KNC_ADDRESS } from 'constants/index'
import { useActiveWeb3React } from 'hooks'
import { useStakingInfo } from 'hooks/kyberdao'
import useTheme from 'hooks/useTheme'
import { ApplicationModal } from 'state/application/actions'
import { NotificationType, useKNCPrice, useNotify, useToggleModal, useWalletModalToggle } from 'state/application/hooks'
import { getFullDisplayBalance } from 'utils/formatBalance'

import KNCLogo from '../kncLogo'
import DelegateConfirmModal from './DelegateConfirmModal'
import GasPriceExpandableBox from './GasPriceExpandableBox'
import SwitchToEthereumModal from './SwitchToEthereumModal'
import YourTransactionsModal from './YourTransactionsModal'

const STAKE_TAB: { [key: string]: string } = {
  Stake: 'Stake',
  Unstake: 'Unstake',
  Delegate: 'Delegate',
}
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 404px;
  order: 4;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    order: 2;
  `}
  ${({ theme }) => theme.mediaWidth.upToXXSmall`
    width: 100vw;
    padding: 0 16px;
  `}
`
const TabSelect = styled.div`
  display: flex;
  align-items: center;
  gap: 28px;
  margin-bottom: 18px;

  ${({ theme }) => theme.mediaWidth.upToXXSmall`
    gap: inherit;
    justify-content: space-between;
  `}
`
const FormWrapper = styled.div`
  background-color: ${({ theme }) => theme.background};
  box-shadow: inset -1px -1px 1px rgba(0, 0, 0, 0.04), inset 0px 2px 2px rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(2px);
  border-radius: 20px;
  padding: 14px;
  width: 100%;
`
export const InnerCard = styled.div`
  border-radius: 16px;
  background-color: ${({ theme }) => theme.buttonBlack};
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.16));
`

export const SmallButton = styled.button`
  padding: 3px 8px;
  font-size: 12px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  transition: all ease-in-out 0.1s;
  ${({ theme }) => css`
    background-color: ${theme.tableHeader};
    color: ${theme.subText};
    :hover {
      background-color: ${lighten(0.05, theme.tableHeader)};
    }
    :active {
      background-color: ${lighten(0.1, theme.tableHeader)};
    }
  `}
`

const TabOption = styled.div<{ $active?: boolean }>`
  font-size: 20px;
  line-height: 24px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  &:hover {
    color: ${({ theme }) => lighten(0.1, theme.primary)};
  }
  color: ${({ theme, $active }) => ($active ? theme.primary : theme.subText)};

  &:last-child {
    margin-left: auto;
  }

  ${({ theme }) => theme.mediaWidth.upToXXSmall`
    font-size: 16px;
    line-height: 20px;
    &:last-child {
      margin-left: 0;
    }
  `}
`
const StakeFormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 16px;
  margin-bottom: 16px;
`
const YourStakedKNC = styled(FormWrapper)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`
const StakeForm = styled(FormWrapper)`
  display: flex;
  gap: 16px;
  flex-direction: column;
`

export const CurrencyInput = styled.input`
  background: none;
  border: none;
  outline: none;
  color: ${({ theme }) => theme.text};
  font-size: 24px;
  width: 0;
  flex: 1;
`

const AddressInput = styled.input`
  background: none;
  border: none;
  outline: none;
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  min-width: 0;
`

export const KNCLogoWrapper = styled.div`
  border-radius: 20px;
  background: ${({ theme }) => theme.background};
  padding: 8px 12px 8px 8px;
  display: flex;
  color: ${({ theme }) => theme.subText};
  gap: 4px;
  font-size: 20px;
`

export default function StakeKNCComponent() {
  const theme = useTheme()
  const { account } = useActiveWeb3React()
  const { stakedBalance, KNCBalance } = useStakingInfo()
  const [activeTab, setActiveTab] = useState(STAKE_TAB.Stake)
  const [inputValue, setInputValue] = useState('1')
  const toggleWalletModal = useWalletModalToggle()
  const toggleSwitchEthereumModal = useToggleModal(ApplicationModal.SWITCH_TO_ETHEREUM)
  const toggleDelegateConfirm = useToggleModal(ApplicationModal.DELEGATE_CONFIRM)
  const toggleYourTransactions = useToggleModal(ApplicationModal.YOUR_TRANSACTIONS_STAKE_KNC)
  const notify = useNotify()
  const handleStakedSuccess = () => {
    notify({
      title: t`Staked Successfully`,
      type: NotificationType.SUCCESS,
      summary: t`You have successfully staked 300 KNC to KyberDAO. You now have a voting power of 0.0001%`,
    })
  }
  const kncPrice = useKNCPrice()
  const kncValueInUsd = useMemo(() => {
    if (!kncPrice || !inputValue) return 0
    return (parseFloat(kncPrice) * parseFloat(inputValue)).toFixed(2)
  }, [kncPrice, inputValue])
  return (
    <Wrapper>
      <TabSelect>
        {Object.keys(STAKE_TAB).map((tab: string) => (
          <TabOption key={tab} onClick={() => setActiveTab(STAKE_TAB[tab])} $active={activeTab === STAKE_TAB[tab]}>
            {tab}
          </TabOption>
        ))}
        <TabOption onClick={toggleYourTransactions}>
          <HistoryIcon /> <Text fontSize={12}>History</Text>
        </TabOption>
      </TabSelect>
      <YourStakedKNC>
        <Text fontSize={12} lineHeight="16px" color={theme.subText}>
          <Trans>Your Staked KNC</Trans>
        </Text>
        <Text
          fontSize={16}
          lineHeight="20px"
          color={theme.text}
          display="flex"
          alignItems="center"
          style={{ gap: '8px' }}
        >
          <KNCLogo size={20} /> {getFullDisplayBalance(stakedBalance, 18)} KNC
        </Text>
      </YourStakedKNC>
      {(activeTab === STAKE_TAB.Stake || activeTab === STAKE_TAB.Unstake) && (
        <StakeFormWrapper>
          <StakeForm>
            <InnerCard>
              <RowBetween width={'100%'}>
                <AutoRow gap="2px">
                  <SmallButton
                    onClick={() => setInputValue(getFullDisplayBalance(KNCBalance.value, KNCBalance.decimals))}
                  >
                    Max
                  </SmallButton>
                  <SmallButton
                    onClick={() => setInputValue(getFullDisplayBalance(KNCBalance.value.div(2), KNCBalance.decimals))}
                  >
                    Half
                  </SmallButton>
                </AutoRow>
                <AutoRow gap="3px" justify="flex-end" color={theme.subText}>
                  <Wallet />{' '}
                  <Text fontSize={12}>
                    {KNCBalance ? getFullDisplayBalance(KNCBalance.value, KNCBalance.decimals) : 0}
                  </Text>
                </AutoRow>
              </RowBetween>
              <RowBetween>
                <CurrencyInput type="number" value={inputValue} onChange={e => setInputValue(e.target.value)} />
                <span style={{ color: theme.border, fontSize: '14px', marginRight: '6px' }}>~${kncValueInUsd}</span>
                <KNCLogoWrapper>
                  <KNCLogo />
                  KNC
                </KNCLogoWrapper>
              </RowBetween>
            </InnerCard>
            <GasPriceExpandableBox />
            {account ? (
              <ButtonPrimary margin="8px 0px">{activeTab === STAKE_TAB.Stake ? 'Stake' : 'Unstake'}</ButtonPrimary>
            ) : (
              <ButtonLight onClick={toggleWalletModal}>
                <InfoHelper
                  size={20}
                  fontSize={12}
                  color={theme.primary}
                  text={t`Staking KNC is only available on Ethereum chain`}
                  style={{ marginRight: '5px' }}
                  placement="top"
                />
                <Trans>Connect Wallet</Trans>
              </ButtonLight>
            )}
          </StakeForm>
        </StakeFormWrapper>
      )}
      {activeTab === STAKE_TAB.Delegate && (
        <StakeFormWrapper>
          <StakeForm>
            <Text color={theme.subText} fontSize={12} lineHeight="16px">
              <Trans>Delegate Address</Trans>
            </Text>
            <InnerCard>
              <AddressInput placeholder="Ethereum Address" />
            </InnerCard>
            <Text color={theme.subText} fontSize={12} lineHeight="14px" fontStyle="italic">
              <Trans>*Only delegate to Ethereum address</Trans>
            </Text>
            <ExpandableBox
              borderRadius="16px"
              backgroundColor={theme.buttonBlack}
              padding="16px"
              color={theme.subText}
              style={{ filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.16))' }}
              headerContent={
                <AutoRow>
                  <ColumnCenter style={{ width: '30px' }}>
                    <WarningIcon />
                  </ColumnCenter>
                  <Text fontSize={12} color={theme.subText}>
                    <Trans>Important Notice: Kyber Network does not hold your funds or manage this process.</Trans>
                  </Text>
                </AutoRow>
              }
              expandContent={
                <Text margin={'0 30px'} fontSize={12}>
                  <Trans>
                    In this default delegation method, your delegate is responsible for voting on your behalf and
                    distributing your KNC rewards to you, though only you can withdraw/unstake your own KNC
                  </Trans>
                </Text>
              }
            />
            <ButtonPrimary margin="8px 0px" onClick={toggleDelegateConfirm}>
              Delegate
            </ButtonPrimary>
          </StakeForm>
        </StakeFormWrapper>
      )}
      <ExpandableBox
        border={`1px solid ${theme.border}`}
        backgroundColor={theme.buttonBlack}
        borderRadius="16px"
        color={theme.subText}
        padding={'12px 16px'}
        headerContent={
          <Text fontSize={12} color={theme.text} style={{ textTransform: 'uppercase' }}>
            <Trans>Stake Information</Trans>
          </Text>
        }
        expandContent={
          <AutoColumn gap="10px" style={{ fontSize: '12px' }}>
            <RowBetween>
              <Text>
                <Trans>Stake Amount</Trans>
              </Text>
              <Text>
                0 KNC &rarr; <span style={{ color: theme.text }}>100 KNC</span>
              </Text>
            </RowBetween>
            <RowBetween>
              <Text>
                <Trans>Voting power</Trans>
              </Text>
              <Text>
                0% &rarr; <span style={{ color: theme.text }}>0.000001%</span>
              </Text>
            </RowBetween>
            <RowBetween>
              <Text>
                <Trans>Gas Fee</Trans>
              </Text>
              <Text color={theme.text}>$25.80</Text>
            </RowBetween>
          </AutoColumn>
        }
      />
      <SwitchToEthereumModal />
      <DelegateConfirmModal />
      <YourTransactionsModal />
    </Wrapper>
  )
}