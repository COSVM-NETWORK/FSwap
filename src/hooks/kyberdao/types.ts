export const ProposalStatus = {
  Active: 'Active',
  Pending: 'Pending',
  Canceled: 'Canceled',
  Executed: 'Executed',
  Finalized: 'Finalized',
  Succeeded: 'Approved',
  Queued: 'Queued',
  Failed: 'Failed',
  Expired: 'Expired',
  Ended: 'Ended',
}

export enum ProposalType {
  BinaryProposal = 'BinaryProposal',
  GenericProposal = 'GenericProposal',
}

export enum ActionType {
  VoteEmitted = 'VoteEmitted',
  ClaimReward = 'ClaimReward',
  Deposit = 'Deposit',
  Withdraw = 'Withdraw',
  Delegate = 'Delegate',
}
export interface VoteOption {
  option: number
  vote_count: number
}

export interface VoteDetail {
  staker: string
  epoch: number
  proposal_id: number
  option: number
  power: string
  staker_name: string
}
export interface VoteStat {
  options: VoteOption[]
  total_address_count: number
  total_vote_count: number
  votes: VoteDetail[] | null
}
export interface ProposalDetail {
  cancelled: boolean
  desc: string
  end_timestamp: number
  execution_timestamp: number
  executor: string
  executor_grace_period: number
  executor_minimum_quorum: string
  executor_vote_differential: string
  link: string
  max_voting_power: string
  options: string[]
  opts_desc: string[]
  proposal_id: number
  proposal_type: ProposalType
  start_timestamp: number
  status: typeof ProposalStatus[keyof typeof ProposalStatus]
  title: string
  vote_stats: VoteStat
}

export interface StakerInfo {
  delegate: string
  delegated_stake_amount: number
  pending_stake_amount: number
  stake_amount: number
}

export interface StakerAction {
  timestamp: number
  epoch: number
  meta: {
    amount?: number
    d_addr?: string
    proposal_id?: number
    proposal_type?: ProposalType
    options?: number[]
  }
  tx_hash: string
  type: string
}

export interface VoteInfo {
  proposal_id: number
  options?: number[]
  epoch: number
  staker: string
  power: string
}