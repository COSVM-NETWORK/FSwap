import { Trans } from '@lingui/macro'
import { useLocation } from 'react-router-dom'
import { Flex } from 'rebass'
import styled from 'styled-components'

import LightBulb from 'components/Icons/LightBulb'
import StakeIcon from 'components/Icons/Stake'
import VoteIcon from 'components/Icons/Vote'
import { APP_PATHS } from 'constants/index'

import { DropdownTextAnchor, StyledNavExternalLink, StyledNavLink } from '../styleds'
import NavGroup from './NavGroup'

const KyberDaoWrapper = styled.span`
  display: inline-flex;
  @media (max-width: 1440px) {
    display: none;
  }
`

const KyberDAONavGroup = () => {
  const { pathname } = useLocation()
  const isActive = pathname.includes(APP_PATHS.KYBERDAO_STAKE)

  return (
    <KyberDaoWrapper>
      <NavGroup
        isActive={isActive}
        anchor={
          <DropdownTextAnchor active={isActive}>
            <Trans>KyberDAO</Trans>
          </DropdownTextAnchor>
        }
        dropdownContent={
          <Flex
            sx={{
              flexDirection: 'column',
            }}
          >
            <StyledNavLink id={`kyberdao-stake-knc`} to={'/kyberdao/stake-knc'}>
              <StakeIcon />
              <Trans>Stake KNC</Trans>
            </StyledNavLink>
            <StyledNavLink id={`kyberdao-vote`} to={'/kyberdao/vote'}>
              <VoteIcon />
              <Trans>Vote</Trans>
            </StyledNavLink>
            <StyledNavExternalLink
              id={`kyberdao-feature-request`}
              href={'https://kyberswap.canny.io/feature-request'}
              target="_blank"
            >
              <LightBulb />
              <Trans>Feature Request</Trans>
            </StyledNavExternalLink>
          </Flex>
        }
      />
    </KyberDaoWrapper>
  )
}

export default KyberDAONavGroup
