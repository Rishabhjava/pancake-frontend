import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, Flex, FlexGap, Tag, Text, useModal } from '@pancakeswap/uikit'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { GAMIFICATION_PUBLIC_API } from 'config/constants/endpoints'
import { useProfile } from 'hooks/useProfile'
import { useMemo } from 'react'
import { styled } from 'styled-components'
import { OptionIcon } from 'views/DashboardQuestEdit/components/Tasks/OptionIcon'
import { SingleQuestData } from 'views/DashboardQuestEdit/hooks/useGetSingleQuestData'
import { CompletionStatus } from 'views/DashboardQuestEdit/type'
import { useUserSocialHub } from 'views/Profile/hooks/settingsModal/useUserSocialHub'
import { MakeProfileModal } from 'views/Quest/components/MakeProfileModal'
import { Task } from 'views/Quest/components/Tasks/Task'
import { useVerifyTaskStatus } from 'views/Quest/hooks/useVerifyTaskStatus'
import { useAccount } from 'wagmi'

const OverlapContainer = styled(Box)`
  position: absolute;
  width: 100%;
  height: 100%;
  bottom: 0;
  left 0;
  background: ${({ theme }) => `${theme.isDark ? 'rgba(32, 28, 41, 0.7)' : 'rgba(255, 255, 255, 0.7)'}`};

  > div {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 0 12px;
  }
`

interface TasksProps {
  quest: SingleQuestData
}

export const Tasks: React.FC<TasksProps> = ({ quest }) => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { id: questId, completionStatus, endDateTime, tasks } = quest
  const { userInfo, isFetched, refresh } = useUserSocialHub()

  const { isInitialized, profile } = useProfile()
  const hasProfile = isInitialized && !!profile
  const [onPressMakeProfileModal] = useModal(<MakeProfileModal type={t('quest')} />)

  const isQuestFinished = useMemo(
    () => new Date().getTime() >= endDateTime || completionStatus === CompletionStatus.FINISHED,
    [completionStatus, endDateTime],
  )

  const hasIdRegister = useMemo(() => {
    const registered = userInfo.questIds?.map((i) => i.toLowerCase())?.includes(questId.toLowerCase())
    return Boolean(registered)
  }, [questId, userInfo.questIds])

  const { taskStatus, refresh: refreshVerifyTaskStatus } = useVerifyTaskStatus({
    questId,
    isQuestFinished,
    hasIdRegister,
  })

  const hasOptionsInTasks = useMemo(() => tasks?.find((i) => i.isOptional === true), [tasks])

  const handleLinkUserToQuest = async () => {
    if (account) {
      try {
        const response = await fetch(`${GAMIFICATION_PUBLIC_API}/userInfo/v1/linkUserToQuest/${account}/${questId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        if (response.ok) {
          refresh()
        }
      } catch (error) {
        console.error(`Submit link user to quest error: ${error}`)
      }
    }
  }

  const handleStartQuest = () => {
    if (!hasProfile) {
      onPressMakeProfileModal()
    } else {
      handleLinkUserToQuest()
    }
  }

  const totalTaskCompleted = useMemo(() => {
    const { verificationStatusBySocialMedia } = taskStatus

    return quest.tasks.reduce((acc, { taskType }) => acc + (verificationStatusBySocialMedia?.[taskType] ? 1 : 0), 0)
  }, [quest.tasks, taskStatus])

  const isCompleted = useMemo(() => {
    const allRequestTaskTotal = quest.tasks.filter((i) => !i.isOptional)

    if (hasOptionsInTasks) {
      const { verificationStatusBySocialMedia } = taskStatus
      const totalRequestComplete = allRequestTaskTotal.reduce(
        (acc, { taskType }) => acc + (verificationStatusBySocialMedia?.[taskType] ? 1 : 0),
        0,
      )
      return allRequestTaskTotal.length === totalRequestComplete
    }

    return totalTaskCompleted === tasks?.length
  }, [hasOptionsInTasks, quest, taskStatus, tasks, totalTaskCompleted])

  return (
    <Box mb="32px">
      <Flex mb="16px">
        <Text fontSize={['24px']} bold mr="8px">
          {t('Tasks')}
        </Text>
        {tasks?.length > 0 && (
          <Box style={{ alignSelf: 'center' }}>
            {account ? (
              <>
                {isCompleted ? (
                  <Tag variant="success" outline>
                    {t('Completed')}
                  </Tag>
                ) : (
                  <Tag variant="secondary" outline>
                    {t('%completed%/%totalTask% completed', {
                      completed: totalTaskCompleted,
                      totalTask: tasks?.length,
                    })}
                  </Tag>
                )}
              </>
            ) : (
              <Tag variant="textDisabled" outline>
                {tasks?.length}
              </Tag>
            )}
          </Box>
        )}
      </Flex>
      {tasks?.length > 0 && (
        <Box position="relative">
          <FlexGap flexDirection="column" gap="12px">
            {tasks?.map((task) => (
              <Task
                key={task?.id}
                questId={questId}
                hasIdRegister={hasIdRegister}
                task={task}
                taskStatus={taskStatus}
                isQuestFinished={isQuestFinished}
                refresh={refreshVerifyTaskStatus}
              />
            ))}
          </FlexGap>
          {hasOptionsInTasks && (
            <Box>
              <Text bold as="span" color="textSubtle">
                {t('Tasks marked with the')}
              </Text>
              <OptionIcon m="0 4px -5px 4px" color="textSubtle" width={28} />
              <Text bold as="span" color="textSubtle">
                {t('badge are optional.')}
              </Text>
              <Text bold as="span" color="textSubtle">
                {t('But your chances of winning will be increased if you complete all the tasks!')}
              </Text>
            </Box>
          )}
          {(!account || (isFetched && !hasIdRegister)) && !isQuestFinished && (
            <OverlapContainer>
              {account ? (
                <>
                  {!hasIdRegister && (
                    <Flex flexDirection="column">
                      <Text bold fontSize="12px" textAlign="center" color="textSubtle">
                        {t('Start the quest to get access to the tasks')}
                      </Text>
                      <Button onClick={handleStartQuest}>{t('Start the Quest')}</Button>
                    </Flex>
                  )}
                </>
              ) : (
                <Box>
                  <ConnectWalletButton />
                </Box>
              )}
            </OverlapContainer>
          )}
        </Box>
      )}
    </Box>
  )
}
