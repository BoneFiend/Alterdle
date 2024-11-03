import { useMemo } from 'react'

import { ShareIcon } from '@heroicons/react/outline'
import { format } from 'date-fns'
import Countdown from 'react-countdown'

import { SettingsButton } from '@ui/inputs/SettingsButton'
import { SettingsSlider } from '@ui/inputs/SettingsSlider'
import { Histogram } from '@ui/stats/Histogram'
import { StatBar } from '@ui/stats/StatBar'

import {
  DATE_LOCALE,
  ENABLE_ARCHIVED_GAMES,
  MAX_NUMBER_OF_LETTERS,
  MAX_NUMBER_OF_WORDS,
  MIN_NUMBER_OF_LETTERS,
  MIN_NUMBER_OF_WORDS,
} from '@constants/settings'
import {
  ARCHIVE_GAMEDATE_TEXT,
  CHALLENGES_DESCRIPTION,
  GUESS_DISTRIBUTION_TEXT,
  LENGTH_DESCRIPTION,
  NEW_WORD_TEXT,
  SHARE_TEXT,
  STATISTICS_TITLE,
} from '@constants/strings'
import { GameStats, Obj2d } from '@constants/types'

import useClientSettings from '@stores/useClientSettings'
import useGameSettingsStore, {
  setNumberOfLetters,
  setNumberOfWords,
} from '@stores/useGameSettingsStore'
import useModalStore, { updateModals } from '@stores/useModalStore'

import { getToday } from '@lib/dateutils'
import { shareStatus } from '@lib/share'
import {
  calculateMaxChallenges,
  checkIsGameWon,
  getNextGameDate,
} from '@lib/words'

import { BaseModal } from './BaseModal'

type Props = {
  solution: string[]
  guesses: string[]
  gameStats: Obj2d<GameStats>
  isLatestGame: boolean
  isGameLost: boolean
  isGameWon: boolean
  handleShareToClipboard: () => void
  handleShareFailure: () => void
  isHardMode: boolean
  numberOfGuessesMade: number
}

export const StatsModal = ({
  solution,
  guesses,
  gameStats,
  isLatestGame,
  isGameLost,
  isGameWon,
  handleShareToClipboard,
  handleShareFailure,
  isHardMode,
  numberOfGuessesMade,
}: Props) => {
  const isStatsModalOpen = useModalStore((s) => s.modals.isStatsModalOpen)

  const { isHighContrastMode, isLongShare } = useClientSettings((s) => ({
    isHighContrastMode: s.isHighContrastMode,
    isLongShare: s.isLongShare,
  }))

  const { numberOfWords, numberOfLetters, gameDate } = useGameSettingsStore(
    (s) => ({
      numberOfWords: s.numberOfWords,
      numberOfLetters: s.numberOfLetters,
      gameDate: s.gameDate,
    }),
  )

  const maxChallenges = useMemo(() => {
    return calculateMaxChallenges(numberOfWords)
  }, [numberOfWords])

  const handleClose = () => updateModals({ isStatsModalOpen: false })

  return (
    <BaseModal
      title={STATISTICS_TITLE}
      isOpen={isStatsModalOpen}
      handleClose={handleClose}
    >
      <StatBar
        gameStats={gameStats}
        numberOfWords={numberOfWords}
        numberOfLetters={numberOfLetters}
      />
      <h4 className="text-lg font-medium leading-6 text-ui-main">
        {GUESS_DISTRIBUTION_TEXT}
      </h4>
      <Histogram
        // TODO add a second histogram to display how many grids were won, toggle between the two
        // Allow user to view every single histogram all at the same time in a big dumb view
        isLatestGame={isLatestGame}
        gameStats={gameStats}
        isGameWon={checkIsGameWon(guesses, solution)}
        numberOfGuessesMade={numberOfGuessesMade}
        numberOfWords={numberOfWords}
        numberOfLetters={numberOfLetters}
        maxChallenges={maxChallenges}
      />
      <div className="-mb-3 flex flex-col divide-y divide-ui-main/50">
        <SettingsSlider
          settingName="Word Length"
          value={numberOfLetters}
          handleValue={setNumberOfLetters}
          description={LENGTH_DESCRIPTION}
          minValue={MIN_NUMBER_OF_LETTERS}
          maxValue={MAX_NUMBER_OF_LETTERS}
        />
        <SettingsSlider
          settingName="Challenges"
          value={numberOfWords}
          handleValue={setNumberOfWords}
          description={CHALLENGES_DESCRIPTION}
          minValue={MIN_NUMBER_OF_WORDS}
          maxValue={numberOfLetters === 1 ? 2 : MAX_NUMBER_OF_WORDS}
        />
        {(gameStats[numberOfWords]?.[numberOfLetters]?.latestDate.getTime() ===
          getToday().getTime() ||
          isGameWon ||
          isGameLost) && (
          <SettingsButton
            settingName={
              <>
                {(!ENABLE_ARCHIVED_GAMES || isLatestGame) && (
                  <div className="grid gap-1">
                    <div>{NEW_WORD_TEXT(solution)}</div>
                    <Countdown
                      className="text-lg font-medium text-ui-main"
                      date={getNextGameDate(getToday())}
                      daysInHours={true}
                    />
                  </div>
                )}
                {ENABLE_ARCHIVED_GAMES && !isLatestGame && (
                  <div className="ml-1 mt-0 text-center text-sm sm:text-base">
                    <strong>{ARCHIVE_GAMEDATE_TEXT}:</strong>
                    <br />
                    {format(gameDate, 'd MMMM yyyy', {
                      locale: DATE_LOCALE,
                    })}
                  </div>
                )}
              </>
            }
            onClick={() => {
              shareStatus(
                solution,
                guesses,
                isGameLost,
                isHardMode,
                isHighContrastMode,
                handleShareToClipboard,
                handleShareFailure,
                maxChallenges,
                numberOfWords,
                numberOfLetters,
                gameDate,
                isLongShare,
              )
            }}
            Icon={ShareIcon}
            buttonText={SHARE_TEXT}
          />
        )}
      </div>
    </BaseModal>
  )
}
