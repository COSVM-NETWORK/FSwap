import { ChainId } from '@namgold/ks-sdk-core'

import MULTICALL_ABI from './abi.json'

const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
  [ChainId.ROPSTEN]: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
  [ChainId.KOVAN]: '0x5ba1e12693dc8f9c48aad8770482f4739beed696',
  [ChainId.RINKEBY]: '0x5ba1e12693dc8f9c48aad8770482f4739beed696',
  [ChainId.GÖRLI]: '0x5ba1e12693dc8f9c48aad8770482f4739beed696',
  [ChainId.MATIC]: '0xed386Fe855C1EFf2f843B910923Dd8846E45C5A4',
  [ChainId.MUMBAI]: '0xc535D6463D5Bf9843aFa73bBF49bF4644a3988bA',
  [ChainId.BSCTESTNET]: '0x8F3273Fb89B075b1645095ABaC6ed17B2d4Bc576',
  // [ChainId.BSCTESTNET]: '0x6e5BB1a5Ad6F68A8D7D6A5e47750eC15773d6042',
  [ChainId.BSCMAINNET]: '0xed386Fe855C1EFf2f843B910923Dd8846E45C5A4',
  [ChainId.AVAXTESTNET]: '0x5D605e78bc699fB565E6E6a1fa2d940C40F8ce25',
  [ChainId.AVAXMAINNET]: '0xF2FD8219609E28C61A998cc534681f95D2740f61',
  [ChainId.FANTOM]: '0x878dFE971d44e9122048308301F540910Bbd934c',
  [ChainId.CRONOSTESTNET]: '0x5AC76EDddf2590Af31dEE348A0d9e45e12511EB0',
  [ChainId.CRONOS]: '0x63Abb9973506189dC3741f61d25d4ed508151E6d',
  [ChainId.AURORA]: '0xBF69a56D35B8d6f5A8e0e96B245a72F735751e54',
  [ChainId.ARBITRUM_TESTNET]: '0xefEb0223C51600d8059A4fD44094a1E2A2C54Bf7',
  // must use this for arbitrum to get exactly block number instead of L1 block number
  [ChainId.ARBITRUM]: '0x80C7DD17B01855a6D2347444a0FCC36136a314de',
  [ChainId.BTTC]: '0xBF69a56D35B8d6f5A8e0e96B245a72F735751e54',
  [ChainId.VELAS]: '0x1877Ec0770901cc6886FDA7E7525a78c2Ed4e975',
  [ChainId.OASIS]: '0xBF69a56D35B8d6f5A8e0e96B245a72F735751e54',
  [ChainId.OPTIMISM]: '0xD9bfE9979e9CA4b2fe84bA5d4Cf963bBcB376974',
  [ChainId.SOLANA]: '123456', //todo namgold: check this
}

export { MULTICALL_ABI, MULTICALL_NETWORKS }
