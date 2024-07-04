import { useTranslation } from '@pancakeswap/localization'
import { ChainId, Currency } from '@pancakeswap/sdk'
import { CAKE } from '@pancakeswap/tokens'
import { Box, BoxProps, CalenderIcon, Card, Flex, InfoIcon, Tag, Text, useTooltip } from '@pancakeswap/uikit'
import { TokenWithChain } from 'components/TokenWithChain'
import { CHAIN_QUERY_NAME } from 'config/chains'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useTokensByChainWithNativeToken } from 'hooks/useTokensByChainWithNativeToken'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { styled } from 'styled-components'
import { SingleQuestData } from 'views/DashboardQuestEdit/hooks/useGetSingleQuestData'
import { CompletionStatus } from 'views/DashboardQuestEdit/type'
import { convertTimestampToDate } from 'views/DashboardQuestEdit/utils/combineDateAndTime'

const Detail = styled(Flex)`
  padding: 0 5px;
  border-right: solid 1px ${({ theme }) => theme.colors.cardBorder};
`

const DetailContainer = styled(Flex)`
  margin-top: 16px;

  ${Detail} {
    &:first-child {
      padding-left: 0;
    }

    &:last-child {
      border: 0;
    }
  }
`

interface QuestProps extends BoxProps {
  showStatus?: boolean
  hideClick?: boolean
  quest: SingleQuestData
}

export const Quest: React.FC<QuestProps> = ({ quest, showStatus, hideClick, ...props }) => {
  const { t } = useTranslation()
  const router = useRouter()
  const { chainId } = useActiveChainId()
  const tokensByChainWithNativeToken = useTokensByChainWithNativeToken(quest?.reward?.currency?.network as ChainId)

  const handleClick = () => {
    router.push(`/quests/${quest.id}?chain=${CHAIN_QUERY_NAME[chainId]}`)
  }

  const {
    targetRef: rewardTargetRef,
    tooltip: rewardTooltip,
    tooltipVisible: rewardTooltipVisible,
  } = useTooltip(
    t('When the Quest time expires, the users who are eligible to get the reward will be randomly drawn'),
    {
      placement: 'top',
    },
  )

  const {
    targetRef: rewardTypeTargetRef,
    tooltip: rewardTypeTooltip,
    tooltipVisible: rewardTypeTooltipVisible,
  } = useTooltip(
    t(
      'The total rewards to be distributed will depend on the eligible questers selected at random. Eligible questers are those who have completed all the tasks.',
    ),
    {
      placement: 'top',
    },
  )

  const currency = useMemo((): Currency => {
    const reward = quest?.reward
    const findToken = tokensByChainWithNativeToken.find((i) =>
      i.isNative
        ? i.wrapped.address.toLowerCase() === reward?.currency?.address?.toLowerCase()
        : i.address.toLowerCase() === reward?.currency?.address?.toLowerCase(),
    )
    return findToken || (CAKE as any)?.[ChainId.BSC]
  }, [quest, tokensByChainWithNativeToken])

  return (
    <Box {...props} style={{ cursor: hideClick ? 'initial' : 'pointer' }} onClick={hideClick ? undefined : handleClick}>
      <Card>
        <Flex flexDirection="column" padding="16px">
          <Flex mb="16px">
            {showStatus && (
              <Box mr="auto">
                {quest?.completionStatus === CompletionStatus.DRAFTED && (
                  <Tag outline variant="textDisabled">
                    {t('Drafted')}
                  </Tag>
                )}
                {quest?.completionStatus === CompletionStatus.ONGOING && (
                  <Text bold color="secondary">
                    {t('Ongoing')}
                  </Text>
                )}
                {quest?.completionStatus === CompletionStatus.FINISHED && (
                  <Text bold color="textDisabled">
                    {t('Finished')}
                  </Text>
                )}
              </Box>
            )}
            <Flex>
              <CalenderIcon color="textSubtle" mr="8px" />
              {quest?.startDateTime > 0 && quest?.endDateTime > 0 ? (
                <Text style={{ alignSelf: 'center' }} color="textSubtle" fontSize={['14px']}>
                  {`${convertTimestampToDate(quest.startDateTime, 'YYYY/MM/DD')} - ${convertTimestampToDate(
                    quest.endDateTime,
                    'YYYY/MM/DD',
                  )}`}
                </Text>
              ) : (
                <Text>-</Text>
              )}
            </Flex>
          </Flex>
          <Text ellipsis bold fontSize={['20px']} lineHeight={['24px']}>
            {quest?.title}
          </Text>
          <Card isActive style={{ width: 'fit-content', padding: '2px', marginTop: '16px' }}>
            <Flex padding="8px">
              {quest?.reward ? (
                <>
                  <TokenWithChain currency={currency} width={20} height={20} />
                  <Flex ml="8px">
                    <Text bold fontSize="20px" lineHeight="24px">
                      {Number(quest?.reward?.totalRewardAmount).toLocaleString('en-US', {
                        maximumFractionDigits: 2,
                      })}
                    </Text>
                    <Text bold fontSize="14px" style={{ alignSelf: 'flex-end' }} ml="2px">
                      {currency.symbol}
                    </Text>
                  </Flex>
                </>
              ) : (
                <Text>-</Text>
              )}
            </Flex>
          </Card>
          <DetailContainer>
            <Detail>
              <Text fontSize="12px" color="textSubtle">
                {t('%total% Tasks', { total: quest?.tasks?.length ?? 0 })}
              </Text>
            </Detail>
            <Detail>
              <Text fontSize="12px" color="textSubtle">
                {t('%total% rewards', { total: quest?.reward?.totalRewardAmount?.toFixed(0) ?? 0 })}
              </Text>
              <Box mt="2px" ref={rewardTargetRef}>
                <InfoIcon ml="2px" width="14px" height="14px" color="textSubtle" style={{ alignSelf: 'center' }} />
              </Box>
              {rewardTooltipVisible && rewardTooltip}
            </Detail>
            <Detail>
              <Text fontSize="12px" color="textSubtle">
                {t('Lucky Draw')}
              </Text>
              <Box mt="2px" ref={rewardTypeTargetRef}>
                <InfoIcon ml="2px" width="14px" height="14px" color="textSubtle" style={{ alignSelf: 'center' }} />
              </Box>
              {rewardTypeTooltipVisible && rewardTypeTooltip}
            </Detail>
          </DetailContainer>
        </Flex>
      </Card>
    </Box>
  )
}
