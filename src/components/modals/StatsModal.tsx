import { ClockIcon, ShareIcon } from '@heroicons/react/outline'
import { format } from 'date-fns'
import Countdown from 'react-countdown'

import {
  DATE_LOCALE,
  ENABLE_ARCHIVED_GAMES,
  MAX_NUMBER_OF_LETTERS,
  MAX_NUMBER_OF_WORDS,
  MIN_NUMBER_OF_LETTERS,
  MIN_NUMBER_OF_WORDS,
} from '../../constants/settings'
import {
  ARCHIVE_GAMEDATE_TEXT,
  CHALLENGES_DESCRIPTION,
  GUESS_DISTRIBUTION_TEXT,
  LENGTH_DESCRIPTION,
  NEW_WORD_TEXT,
  SHARE_TEXT,
  STATISTICS_TITLE,
} from '../../constants/strings'
import { getToday } from '../../lib/dateutils'
import { shareStatus } from '../../lib/share'
import { Obj2d, checkIsGameWon, getNextGameDate } from '../../lib/words'
import useClientSettings from '../../stores/useClientSettings'
import useGameSettings from '../../stores/useGameSettings'
import useModalStore from '../../stores/useModalStore'
import { Button } from '../inputs/Button'
import { Histogram } from '../stats/Histogram'
import { StatBar } from '../stats/StatBar'
import { BaseModal } from './BaseModal'
import { SettingsSlider } from './SettingsSlider'

type Props = {
  solution: string[]
  guesses: string[]
  gameStats: Obj2d
  isLatestGame: boolean
  isGameLost: boolean
  isGameWon: boolean
  handleShareToClipboard: () => void
  handleShareFailure: () => void
  isHardMode: boolean
  numberOfGuessesMade: number
  maxChallenges: number
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
  maxChallenges,
}: Props) => {
  const { isStatsModalOpen, setIsStatsModalOpen } = useModalStore()

  const { isDarkMode, isHighContrastMode, isLongShare } = useClientSettings()
  const {
    numberOfWords,
    numberOfLetters,
    setNumberOfWords,
    setNumberOfLetters,
    gameDate,
  } = useGameSettings()

  const handleClose = () => {
    setIsStatsModalOpen(false)
  }

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
      <h4 className="text-lg font-medium leading-6 text-stone-900 dark:text-gray-100">
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
      <div className="flex flex-col divide-y divide-secondary-2">
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
          <div className="columns-2 items-center justify-center pt-2 text-center text-secondary">
            <div className="inline-block w-full text-left">
              {(!ENABLE_ARCHIVED_GAMES || isLatestGame) && (
                <div>
                  <h5>{NEW_WORD_TEXT(solution)}</h5>
                  <Countdown
                    className="text-lg font-medium text-secondary"
                    date={getNextGameDate(getToday())}
                    daysInHours={true}
                  />
                </div>
              )}
              {ENABLE_ARCHIVED_GAMES && !isLatestGame && (
                <div className="mt-2 inline-flex">
                  <ClockIcon className="mr-1 mt-1 h-5 w-5 stroke-blank" />
                  <div className="ml-1 mt-0 text-center text-sm sm:text-base">
                    <strong>{ARCHIVE_GAMEDATE_TEXT}:</strong>
                    <br />
                    {format(gameDate, 'd MMMM yyyy', {
                      locale: DATE_LOCALE,
                    })}
                  </div>
                </div>
              )}
            </div>
            <div>
              <Button
                onClick={() => {
                  shareStatus(
                    solution,
                    guesses,
                    isGameLost,
                    isHardMode,
                    isDarkMode,
                    isHighContrastMode,
                    handleShareToClipboard,
                    handleShareFailure,
                    maxChallenges,
                    numberOfWords,
                    numberOfLetters,
                    gameDate,
                    isLongShare
                  )
                }}
              >
                <ShareIcon className="mr-2 h-6 w-6 cursor-pointer" />
                {SHARE_TEXT}
              </Button>
            </div>
          </div>
        )}
      </div>
    </BaseModal>
  )
}
