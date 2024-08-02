import { CalendarIcon } from '@heroicons/react/outline'

import {
  ENABLE_ARCHIVED_GAMES,
  ENABLE_MIGRATE_STATS,
  MAX_NUMBER_OF_LETTERS,
  MAX_NUMBER_OF_WORDS,
  MIN_NUMBER_OF_LETTERS,
  MIN_NUMBER_OF_WORDS,
} from '../../constants/settings'
import {
  CHALLENGES_DESCRIPTION,
  DATEPICKER_BUTTON,
  DATEPICKER_DESCRIPTION,
  DATEPICKER_TITLE,
  HARD_MODE_DESCRIPTION,
  HARD_MODE_RESTRICTION_MESSAGE,
  HIGH_CONTRAST_MODE_DESCRIPTION,
  LENGTH_DESCRIPTION,
  LONG_SHARE_DESCRIPTION,
  PERFORMANCE_MODE_DESCRIPTION,
} from '../../constants/strings'
import useClientSettings from '../../stores/useClientSettings'
import useGameSettingsStore from '../../stores/useGameSettingsStore'
import useModalStore from '../../stores/useModalStore'
import { Button } from '../inputs/Button'
import { MigrationIntro } from '../stats/MigrationIntro'
import { BaseModal } from './BaseModal'
import { SettingsSlider } from './SettingsSlider'
import { SettingsToggle } from './SettingsToggle'

type Props = {
  isHardMode: boolean
  handleHardMode: Function
}

export const SettingsModal = ({ isHardMode, handleHardMode }: Props) => {
  const {
    isSettingsModalOpen,
    setIsDatePickerModalOpen,
    setIsSettingsModalOpen,
    setIsMigrateStatsModalOpen,
  } = useModalStore()

  const {
    isDarkMode,
    setIsDarkMode,
    isHighContrastMode,
    setIsHighContrastMode,
    isLongShare,
    setIsLongShare,
    isPerfMode,
    setIsPerfMode,
  } = useClientSettings()

  const {
    numberOfWords,
    numberOfLetters,
    setNumberOfWords,
    setNumberOfLetters,
  } = useGameSettingsStore()

  const handleChooseDateButton = () => {
    setIsDatePickerModalOpen(true)
    setIsSettingsModalOpen(false)
  }

  const handleMigrateStatsButton = () => {
    setIsSettingsModalOpen(false)
    setIsMigrateStatsModalOpen(true)
  }

  const handleClose = () => {
    setIsSettingsModalOpen(false)
  }

  return (
    <BaseModal
      title="Settings"
      isOpen={isSettingsModalOpen}
      handleClose={handleClose}
      isSettingsModal
    >
      <div className="mt-2 flex flex-col divide-y divide-secondary-2">
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
        {ENABLE_ARCHIVED_GAMES && (
          <div className="mb-3 flex justify-between gap-4 pt-3">
            <div className="text-left text-secondary transition-colors duration-500">
              <p className="leading-none">{DATEPICKER_TITLE}</p>
              <p className="mt-1 text-xs text-secondary transition-colors duration-500">
                {DATEPICKER_DESCRIPTION}
              </p>
            </div>
            <div>
              <p className="text-left text-secondary transition-colors duration-500">
                <Button onClick={handleChooseDateButton}>
                  <CalendarIcon className="mr-2 h-6 w-6 cursor-pointer" />
                  {DATEPICKER_BUTTON}
                </Button>
              </p>
            </div>
          </div>
        )}
        <SettingsToggle
          settingName="Hard Mode"
          flag={isHardMode}
          handleFlag={handleHardMode}
          description={
            numberOfWords === 1
              ? HARD_MODE_DESCRIPTION
              : HARD_MODE_RESTRICTION_MESSAGE
          }
          disabled={numberOfWords > 1}
        />
        <SettingsToggle
          settingName="Long Format Share Text"
          flag={isLongShare}
          handleFlag={setIsLongShare}
          description={LONG_SHARE_DESCRIPTION}
        />
        <SettingsToggle
          settingName="Dark Mode"
          flag={isDarkMode}
          handleFlag={setIsDarkMode}
        />
        <SettingsToggle
          settingName="High Contrast Mode"
          flag={isHighContrastMode}
          handleFlag={setIsHighContrastMode}
          description={HIGH_CONTRAST_MODE_DESCRIPTION}
        />
        <SettingsToggle
          settingName="Performance Mode"
          flag={isPerfMode}
          handleFlag={setIsPerfMode}
          description={PERFORMANCE_MODE_DESCRIPTION}
        />
        {ENABLE_MIGRATE_STATS && (
          <div>
            <MigrationIntro
              handleMigrateStatsButton={handleMigrateStatsButton}
            />
          </div>
        )}
      </div>
    </BaseModal>
  )
}
