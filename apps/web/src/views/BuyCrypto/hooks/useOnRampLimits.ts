import type { UseQueryResult } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import { ONRAMP_API_BASE_URL } from 'config/constants/endpoints'
import qs from 'qs'
import { formatOnrampCurrencyChainId } from '../constants'
import { createQueryKey, Evaluate, OnRampLimitsPayload, UseQueryParameters } from '../types'

type CurrencyLimits = {
  code: string
  maxBuyAmount: number
  minBuyAmount: number
}

type LimitQuote = {
  baseCurrency: CurrencyLimits
  quoteCurrency: CurrencyLimits
}

export const getOnRampLimitQueryKey = createQueryKey<'onramp-limits', [GetOnRampLimitParameters]>('onramp-limits')

type GetOnRampLimitQueryKey = ReturnType<typeof getOnRampLimitQueryKey>

export type GetOnRampLimitReturnType = LimitQuote

export type GetOnRampLimitParameters = {
  fiatCurrency: string | undefined
  cryptoCurrency: string | undefined
  network: number | undefined | 'bitcoin'
}

export type UseOnRampLimitParameters<selectData = GetOnRampLimitReturnType> = Evaluate<
  GetOnRampLimitParameters &
    UseQueryParameters<Evaluate<GetOnRampLimitReturnType>, Error, selectData, GetOnRampLimitQueryKey>
>

export type UseOnRampLimitReturnType<selectData = GetOnRampLimitReturnType> = UseQueryResult<selectData, Error>

export const useOnRampLimit = <selectData = GetOnRampLimitReturnType>(
  parameters: UseOnRampLimitParameters<selectData>,
): UseOnRampLimitReturnType<selectData> => {
  const { fiatCurrency, cryptoCurrency, network, ...query } = parameters

  const enabled = Boolean(fiatCurrency && cryptoCurrency && network)
  return useQuery({
    ...query,
    queryKey: getOnRampLimitQueryKey([
      {
        fiatCurrency,
        cryptoCurrency,
        network,
      },
    ]),
    queryFn: async ({ queryKey }) => {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const { fiatCurrency, cryptoCurrency, network } = queryKey[1]

      if (!fiatCurrency || !cryptoCurrency || !network) {
        throw new Error('Invalid parameters')
      }
      const providerLimits = await fetchProviderLimits({
        cryptoCurrency,
        fiatCurrency,
        network: formatOnrampCurrencyChainId(network),
      })
      return providerLimits
    },
    ...query,
    enabled,
  })
}

async function fetchProviderLimits(payload: OnRampLimitsPayload): Promise<LimitQuote> {
  const response = await fetch(
    `${ONRAMP_API_BASE_URL}/fetch-provider-limits?${qs.stringify({
      ...payload,
    })}`,
  )
  const result = await response.json()
  return result.result
}