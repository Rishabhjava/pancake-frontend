import { useState, useEffect, useMemo } from 'react'
import { Text, Flex, Skeleton, Image, Balance } from '@pancakeswap/uikit'
import { useIntersectionObserver } from '@pancakeswap/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { useCakePrice } from 'hooks/useCakePrice'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { bigIntToBigNumber } from '@pancakeswap/utils/bigNumber'
import { styled } from 'styled-components'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { getFarmAuctionContract } from 'utils/contractHelpers'

const BurnedText = styled(Text)`
  font-size: 52px;

  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 64px;
  }
`

const AuctionCakeBurn: React.FC<React.PropsWithChildren> = () => {
  const [burnedCakeAmount, setBurnedCakeAmount] = useState(0)
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()
  const farmAuctionContract = useMemo(() => getFarmAuctionContract(undefined, chainId), [chainId])
  const { observerRef, isIntersecting } = useIntersectionObserver()
  const cakePriceBusd = useCakePrice()

  const burnedAmountAsUSD = cakePriceBusd.times(burnedCakeAmount)

  useEffect(() => {
    const fetchBurnedCakeAmount = async () => {
      try {
        const amount = await farmAuctionContract.read.totalCollected()
        const amountAsBN = bigIntToBigNumber(amount)
        setBurnedCakeAmount(getBalanceNumber(amountAsBN))
      } catch (error) {
        console.error('Failed to fetch burned auction cake', error)
      }
    }
    if (isIntersecting && burnedCakeAmount === 0) {
      fetchBurnedCakeAmount()
    }
  }, [isIntersecting, burnedCakeAmount, farmAuctionContract])
  return (
    <Flex flexDirection={['column-reverse', null, 'row']}>
      <Flex flexDirection="column" flex="2" ref={observerRef}>
        {burnedCakeAmount !== 0 ? (
          <Balance fontSize="64px" bold value={burnedCakeAmount} decimals={0} unit=" CAKE" />
        ) : (
          <Skeleton width="256px" height="64px" />
        )}
        <BurnedText textTransform="uppercase" bold color="secondary">
          {t('Burned')}
        </BurnedText>
        <Text fontSize="24px" bold>
          {t('through community auctions so far!')}
        </Text>
        {!burnedAmountAsUSD.isNaN() && !burnedAmountAsUSD.isZero() ? (
          <Text color="textSubtle">
            ~${burnedAmountAsUSD.toNumber().toLocaleString('en', { maximumFractionDigits: 0 })}
          </Text>
        ) : (
          <Skeleton width="128px" />
        )}
      </Flex>
      <Image width={350} height={320} src="/images/burnt-cake.png" alt={t('Burnt CAKE')} />
    </Flex>
  )
}

export default AuctionCakeBurn
