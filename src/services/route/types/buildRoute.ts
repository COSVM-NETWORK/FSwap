import { RouteSummary as RawRouteSummary } from 'services/route/types/getRoute'

export type BuildRoutePayload = {
  routeSummary: RawRouteSummary
  deadline: number
  slippageTolerant: number
  sender: string
  recipient?: string
  referral?: string
  source: 'kyberswap'
  useMeta: true
}

export type BuildRouteData = {
  data: string
  amountIn: string
  amountInUsd: string
  amountOut: string
  amountOutUsd: string
  outputChange?: {
    amount: string
    percent: number
    level: number
  }
  gas: string
  gasUsd: string
  routerAddress: string
}

export type BuildRouteResponse = {
  code: number
  message: string
  data?: BuildRouteData
}
