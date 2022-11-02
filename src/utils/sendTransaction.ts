import { BigNumber } from '@ethersproject/bignumber'
import { TransactionResponse } from '@ethersproject/providers'
import { ChainId, Token, WETH } from '@namgold/ks-sdk-core'
import { captureException } from '@sentry/react'
import { SignerWalletAdapter } from '@solana/wallet-adapter-base'
import { PublicKey, Transaction, sendAndConfirmRawTransaction } from '@solana/web3.js'
import { ethers } from 'ethers'

import connection from 'state/connection/connection'
// import connection from 'state/connection/connection'
import { calculateGasMargin } from 'utils'

import { Aggregator } from './aggregator'
import { createAtaInstruction, createUnwrapSOLInstruction, createWrapSOLInstruction } from './solanaInstructions'

export async function sendEVMTransaction(
  account: string,
  library: ethers.providers.Web3Provider | undefined,
  contractAddress: string,
  encodedData: string,
  value: BigNumber,
  handler?: (response: TransactionResponse) => void,
): Promise<string | undefined> {
  if (!account || !library) return

  const estimateGasOption = {
    from: account,
    to: contractAddress,
    data: encodedData,
    value,
  }

  let gasEstimate: ethers.BigNumber | undefined
  try {
    gasEstimate = await library.getSigner().estimateGas(estimateGasOption)
    if (!gasEstimate) throw new Error('gasEstimate is nullish value')
  } catch (error) {
    const e = new Error('Swap failed', { cause: error })
    e.name = 'SwapError'

    const tmp = JSON.stringify(error)
    const tag = tmp.includes('minTotalAmountOut')
      ? 'minTotalAmountOut'
      : tmp.includes('ERR_LIMIT_OUT')
      ? 'ERR_LIMIT_OUT'
      : tmp.toLowerCase().includes('1inch')
      ? 'call1InchFailed'
      : 'other'

    captureException(e, {
      level: 'fatal',
      extra: estimateGasOption,
      tags: {
        type: tag,
      },
    })

    throw new Error('gasEstimate not found: Unexpected error. Please contact support: none of the calls threw an error')
  }

  const sendTransactionOption = {
    from: account,
    to: contractAddress,
    data: encodedData,
    gasLimit: calculateGasMargin(gasEstimate),
    ...(value.eq('0') ? {} : { value }),
  }

  try {
    const response = await library.getSigner().sendTransaction(sendTransactionOption)
    handler?.(response)
    return response.hash
  } catch (error) {
    // if the user rejected the tx, pass this along
    if (error?.code === 4001 || error?.code === 'ACTION_REJECTED') {
      throw new Error('Transaction rejected.')
    } else {
      const e = new Error('Swap failed', { cause: error })
      e.name = 'SwapError'

      const tmp = JSON.stringify(error)
      const tag = tmp.includes('minTotalAmountOut')
        ? 'minTotalAmountOut'
        : tmp.includes('ERR_LIMIT_OUT')
        ? 'ERR_LIMIT_OUT'
        : tmp.toLowerCase().includes('1inch')
        ? 'call1InchFailed'
        : 'other'

      captureException(e, {
        level: 'error',
        extra: sendTransactionOption,
        tags: {
          type: tag,
        },
      })

      // Otherwise, the error was unexpected, and we need to convey that.
      throw new Error(error)
    }
  }
}

export async function sendSolanaTransactionWithBEEncode(
  account: string,
  trade: Aggregator,
  solanaWallet: SignerWalletAdapter,
  handler: (hash: string, firstTxHash: string) => void,
  handleCustomTypeResponse: (type: string, hash: string, firstTxHash: string) => void,
): Promise<string[] | undefined> {
  if (!trade.encodedSwapTx) return
  const accountPK = new PublicKey(account)
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash()

  const txs: Transaction[] = []

  let setupTx: Transaction | null = null
  const prepareSetupTx =
    trade.encodedCreateOrderTx ||
    new Transaction({
      blockhash,
      lastValidBlockHeight,
      feePayer: accountPK,
    })
  prepareSetupTx.recentBlockhash = blockhash
  prepareSetupTx.lastValidBlockHeight = lastValidBlockHeight
  prepareSetupTx.feePayer = accountPK

  if (trade.inputAmount.currency.isNative) {
    const wrapIxs = await createWrapSOLInstruction(accountPK, trade.inputAmount)
    if (wrapIxs) prepareSetupTx.add(...wrapIxs)
  }

  await Promise.all(
    Object.entries(trade.tokens).map(async ([tokenAddress, token]) => {
      if (!token) return
      if (tokenAddress === WETH[ChainId.SOLANA].address) return
      const createAtaIxs = await createAtaInstruction(
        accountPK,
        new Token(ChainId.SOLANA, tokenAddress, token?.decimals || 0),
      )
      prepareSetupTx.add(createAtaIxs)
    }),
  )

  if (prepareSetupTx.instructions.length) {
    setupTx = prepareSetupTx
    txs.push(setupTx)
  }

  const swapTx = trade.encodedSwapTx
  swapTx.recentBlockhash = blockhash
  swapTx.lastValidBlockHeight = lastValidBlockHeight
  swapTx.feePayer = accountPK
  await swapTx.partialSign(trade.programState)
  txs.push(swapTx)

  let cleanUpTx: Transaction | null = null

  if (trade.outputAmount.currency.isNative) {
    cleanUpTx = new Transaction({
      blockhash,
      lastValidBlockHeight,
      feePayer: accountPK,
    })
    const closeWSOLIxs = await createUnwrapSOLInstruction(accountPK, trade.outputAmount)
    if (closeWSOLIxs) cleanUpTx.add(closeWSOLIxs)
    txs.push(cleanUpTx)
  }
  const populateTx = (txs: Transaction[]) => {
    const result: {
      signedSetupTx: Transaction | undefined
      signedSwapTx: Transaction | undefined
      signedCleanUpTx: Transaction | undefined
    } = { signedSetupTx: undefined, signedSwapTx: undefined, signedCleanUpTx: undefined }
    let count = 0
    if (setupTx) result.signedSetupTx = txs[count++]
    result.signedSwapTx = txs[count++]
    result.signedCleanUpTx = txs[count++]
    return result
  }
  try {
    const signedTxs: Transaction[] = await (solanaWallet as SignerWalletAdapter).signAllTransactions(txs)
    const { signedSetupTx, signedSwapTx, signedCleanUpTx } = populateTx(signedTxs)
    const txHashs: string[] = []
    if (signedSetupTx) {
      try {
        const setupHash = await sendAndConfirmRawTransaction(connection, signedSetupTx.serialize())
        txHashs.push(setupHash)
        handleCustomTypeResponse('SetUp', setupHash, txHashs[0])
      } catch (e) {
        console.error(e)
        throw new Error('Swap error', { cause: e })
      }
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const swapHash = await sendAndConfirmRawTransaction(connection, signedSwapTx!.serialize())
      txHashs.push(swapHash)
      handler(swapHash, txHashs[0])
    } catch (e) {
      console.error(e)
      throw new Error('Swap error', { cause: e })
    }

    if (signedCleanUpTx) {
      try {
        const cleanUpHash = await sendAndConfirmRawTransaction(connection, signedCleanUpTx.serialize())
        txHashs.push(cleanUpHash)
        handleCustomTypeResponse('CleanUp', cleanUpHash, txHashs[0])
      } catch (e) {
        console.error(e)
        throw new Error('Swap error', { cause: e })
      }
    }

    return txHashs
  } catch (e) {
    console.error(e)
    throw new Error('Swap error', { cause: e })
  }
}
// export async function sendSolanaTransactionWithFEEncode(
//   account: string,
//   program: Program<SolanaAggregatorPrograms>,
//   programAccount: string,
//   provider: AnchorProvider,
//   trade: Aggregator,
//   value: BigNumber,
//   handler?: (response: TransactionResponse) => void,
// ): Promise<string | undefined> {
//   if (!account) return

//   let tx: Transaction | undefined
//   try {
//     tx = await createSolanaSwapTransaction(new PublicKey(account), program, programAccount, trade, value)
//   } catch (e) {
//     console.error(e)
//     throw new Error('Create transaction failed', { cause: e })
//   }
//   try {
//     const response = await sendAndConfirmTransaction(provider, tx)
//     return response
//   } catch (e) {
//     console.error(e)
//     throw new Error('Swap error', { cause: e })
//   }
// }
