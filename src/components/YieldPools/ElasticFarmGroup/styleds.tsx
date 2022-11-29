import styled from 'styled-components'

export const RewardAndDepositInfo = styled.div`
  display: flex;
  padding: 0 1.5rem;
  gap: 24px;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: column;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
      padding: 0 1rem;
  `}
`
export const RewardContainer = styled.div`
  border-radius: 20px;
  flex: 1;
  padding: 1.25rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${({ theme }) => theme.radialGradient};

  ${({ theme }) => theme.mediaWidth.upToLarge`
    flex: 2
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
      flex-direction: column;
      gap: 16px;
  `}
`

export const DepositedContainer = styled.div`
  flex: 2;
  border-radius: 1.25rem;
  padding: 1.25rem 1rem;
  background: ${({ theme }) => theme.buttonBlack};
  display: flex;
  align-items: center;
  justify-content: space-between;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    flex: 3
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    flex-direction: column;
    gap: 16px;
  `};
`

export const RewardDetailContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    width: 100%;
  `};
`

export const RewardDetail = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      width: 100%;
  `};
`

export const FarmList = styled.div`
  margin: 1.5rem;
  border-radius: 20px;
  overflow: hidden;
  background: ${({ theme }) => theme.buttonBlack};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin: 1.5rem 1rem;
  `}
`

export const FeeTag = styled.div`
  border-radius: 999px;
  background: ${({ theme }) => theme.darkBlue + '33'};
  color: ${({ theme }) => theme.darkBlue};
  font-size: 10px;
  padding: 2px 4px;
  margin-left: 6px;
  min-width: 36px;
  text-align: center;
`

export const NFTWrapper = styled.div`
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  padding: 12px;
  background: ${({ theme }) => theme.background};
  width: 100%;
  font-size: 14px;
  line-height: 20px;
`

export const RowWrapper = styled.div<{ isOpen: boolean }>`
  background-color: ${({ theme, isOpen }) => (isOpen ? theme.buttonGray : theme.buttonBlack)};
  :not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.border + '80'};
  }
`

export const NFTListWrapper = styled.div`
  display: grid;
  flex: 1;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 12px;
  padding: 0 12px 12px;
`