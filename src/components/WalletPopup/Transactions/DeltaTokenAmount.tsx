import styled from 'styled-components'

import Logo from 'components/Logo'
import { PrimaryText } from 'components/WalletPopup/Transactions/TransactionItem'
import { getTokenLogo } from 'components/WalletPopup/Transactions/helper'
import useTheme from 'hooks/useTheme'

export const TokenAmountWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
`
const TokenLogo = styled(Logo)`
  width: 12px;
  height: 12px;
  border-radius: 100%;
`

const DeltaTokenAmount = ({
  symbol,
  amount,
  tokenAddress,
  plus,
  whiteColor,
  logoURL,
}: {
  symbol?: string
  amount?: string
  tokenAddress?: string
  plus?: boolean
  whiteColor?: boolean
  logoURL?: string
}) => {
  const withSign = plus !== undefined
  const theme = useTheme()
  const sign = amount === undefined || !withSign ? null : plus ? '+' : '-'
  const color = whiteColor ? theme.text : plus ? theme.primary : theme.subText
  const logoUrl = logoURL ?? getTokenLogo(tokenAddress)
  if (!amount) return null
  return (
    <TokenAmountWrapper>
      {logoUrl && <TokenLogo srcs={[logoUrl]} />}
      <PrimaryText style={{ color }}>
        {sign} {amount} {symbol}
      </PrimaryText>
    </TokenAmountWrapper>
  )
}

export default DeltaTokenAmount
