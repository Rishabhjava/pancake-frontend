import { useTranslation } from '@pancakeswap/localization'
import { Currency } from '@pancakeswap/sdk'
import { Box, Card, Text } from '@pancakeswap/uikit'
import { styled } from 'styled-components'
import { AddReward } from 'views/DashboardQuestEdit/components/Reward/AddReward'
import { RewardAmount } from 'views/DashboardQuestEdit/components/Reward/RewardAmount'
import { QuestRewardType } from 'views/DashboardQuestEdit/context/types'
import { CompletionStatus, RewardType } from 'views/DashboardQuestEdit/type'

const RewardContainer = styled(Box)`
  width: 100%;
  padding-bottom: 0px;

  ${({ theme }) => theme.mediaQueries.lg} {
    max-width: 448px;
    min-height: 100vh;
    padding: 40px 40px 168px 40px;
    border-left: 1px solid ${({ theme }) => theme.colors.input};
  }
`

interface RewardProps {
  reward: undefined | QuestRewardType
  completionStatus: CompletionStatus
  actionComponent?: JSX.Element
  updateValue: (key: string, value: string | QuestRewardType) => void
}

export const Reward: React.FC<RewardProps> = ({ reward, completionStatus, actionComponent, updateValue }) => {
  const { t } = useTranslation()

  const handlePickedRewardToken = (currency: Currency, totalRewardAmount: number, amountOfWinners: number) => {
    const tokenAddress = currency?.isNative ? currency?.wrapped?.address : currency?.address
    const tokenChainId = currency?.chainId

    let rewardData: QuestRewardType = {
      title: '',
      description: '',
      rewardType: RewardType.TOKEN,
      currency: {
        address: tokenAddress,
        network: tokenChainId,
      },
      amountOfWinners,
      totalRewardAmount,
    }

    if (reward) {
      rewardData = {
        ...reward,
        totalRewardAmount,
        amountOfWinners,
        currency: {
          address: tokenAddress,
          network: tokenChainId,
        },
      }
    }

    updateValue('reward', rewardData)
  }

  return (
    <RewardContainer>
      <Card>
        <Box padding="24px">
          <Text fontSize={['24px']} bold mb={['24px']}>
            {t('Reward')}
          </Text>
          {reward?.currency?.address ? (
            <RewardAmount
              reward={reward}
              completionStatus={completionStatus}
              amountOfWinners={reward?.amountOfWinners}
              handlePickedRewardToken={handlePickedRewardToken}
            />
          ) : (
            <AddReward reward={reward} amountOfWinners={0} handlePickedRewardToken={handlePickedRewardToken} />
          )}
          {actionComponent}
        </Box>
      </Card>
    </RewardContainer>
  )
}
