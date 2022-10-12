import { ChainId } from '@kyberswap/ks-sdk-core'
import { useCallback, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { AppPaths } from 'pages/App'
import {
  BridgeLocalStorageKeys,
  fetchTokenVersion,
  getBridgeLocalstorage,
  getChainlist,
  getTokenlist,
  setBridgeLocalstorage,
} from 'pages/Bridge/helpers'
import { MultiChainTokenInfo } from 'pages/Bridge/type'
import { WrappedTokenInfo } from 'state/lists/wrappedTokenInfo'

import { useActiveWeb3React } from '../../hooks'
import { useBridgeState } from './hooks'

export default function Updater(): null {
  const { chainId } = useActiveWeb3React()
  const [{ tokenIn, chainIdOut }, setBridgeState] = useBridgeState()
  const { pathname } = useLocation()
  const formatAndSaveToken = useCallback(
    (tokens: any, chainIdRequest: ChainId) => {
      if (chainId !== chainIdRequest || !chainIdRequest) return // prevent api 1 call first but finished later
      const result: WrappedTokenInfo[] = []
      Object.keys(tokens).forEach(key => {
        const { address, logoUrl, destChains, name, decimals, symbol } = tokens[key] as MultiChainTokenInfo
        if (!destChains || Object.keys(destChains).length === 0) {
          delete tokens[key]
          return
        }
        tokens[key].key = key
        tokens[key].chainId = chainIdRequest
        result.push(
          new WrappedTokenInfo({
            chainId: chainIdRequest,
            decimals,
            symbol,
            name,
            address,
            logoURI: logoUrl,
            multichainInfo: tokens[key],
          }),
        )
      })
      setBridgeState({ listTokenIn: result, tokenIn: result[0] })
    },
    [setBridgeState, chainId],
  )

  useEffect(() => {
    const fetchData = async () => {
      try {
        const oldVersion = getBridgeLocalstorage(BridgeLocalStorageKeys.TOKEN_VERSION)
        let version
        try {
          version = await fetchTokenVersion()
        } catch (error) {}

        const isStaleData = oldVersion !== version || !version
        if (isStaleData) {
          setBridgeLocalstorage(BridgeLocalStorageKeys.TOKEN_VERSION, version)
        }

        const data = await Promise.allSettled([
          getChainlist(isStaleData),
          chainId ? getTokenlist(chainId, isStaleData) : Promise.reject(),
        ])
        if (data[0].status === 'fulfilled') {
          const listChainIn = data[0].value
          setBridgeState({ listChainIn })
        }
        if (data[1].status === 'fulfilled' && chainId) {
          const tokens = data[1].value
          formatAndSaveToken(tokens, chainId)
        }
      } catch (error) {
        console.error(error)
      }
    }

    if (pathname.startsWith(AppPaths.BRIDGE) && chainId) {
      fetchData()
    }
  }, [chainId, setBridgeState, formatAndSaveToken, pathname])

  useEffect(() => {
    const destChainInfo = tokenIn?.destChains || {}
    if (!chainIdOut || !tokenIn || !chainId) {
      setBridgeState({ listTokenOut: [] })
      return
    }
    const map = chainIdOut ? destChainInfo[chainIdOut] ?? {} : {}
    const listTokenOut: WrappedTokenInfo[] = []
    Object.keys(map).forEach(hash => {
      const token = { ...map[hash] }
      token.key = hash
      const { decimals, name, address, symbol } = token as MultiChainTokenInfo
      listTokenOut.push(
        new WrappedTokenInfo({
          chainId,
          decimals,
          symbol,
          name,
          address,
          logoURI: tokenIn.logoUrl,
          multichainInfo: token,
        }),
      )
    })
    setBridgeState({ listTokenOut })
  }, [chainIdOut, tokenIn, chainId, setBridgeState])

  return null
}