import { CalendarIcon } from '@heroicons/react/outline'

import {
  ENABLE_ARCHIVED_GAMES,
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
  HIGH_CONTRAST_MODE_DESCRIPTION,
  LENGTH_DESCRIPTION,
} from '../../constants/strings'
import { BaseModal } from './BaseModal'
import { SettingsSlider } from './SettingsSlider'
import { SettingsToggle } from './SettingsToggle'

type Props = {
  isOpen: boolean
  handleClose: () => void
  isHardMode: boolean
  handleHardMode: Function
  isDarkMode: boolean
  handleDarkMode: Function
  isHighContrastMode: boolean
  handleHighContrastMode: Function
  numberOfWords: number
  handleNumberOfWords: Function
  numberOfLetters: number
  handleNumberOfLetters: Function
  handleChooseDateButton: () => void
}

export const SettingsModal = ({
  isOpen,
  handleClose,
  isHardMode,
  handleHardMode,
  isDarkMode,
  handleDarkMode,
  isHighContrastMode,
  handleHighContrastMode,
  numberOfWords,
  handleNumberOfWords,
  numberOfLetters,
  handleNumberOfLetters,
  handleChooseDateButton,
}: Props) => {
  return (
    <BaseModal title="Settings" isOpen={isOpen} handleClose={handleClose}>
      <div className="mt-2 flex flex-col divide-y divide-stone-300">
        <SettingsSlider
          settingName="Word Length"
          value={numberOfLetters}
          handleValue={(value: number) => handleNumberOfLetters(value)}
          description={LENGTH_DESCRIPTION}
          minValue={MIN_NUMBER_OF_LETTERS}
          maxValue={MAX_NUMBER_OF_LETTERS}
        />
        <SettingsSlider
          settingName="Challenges"
          value={numberOfWords}
          handleValue={(value: number) => handleNumberOfWords(value)}
          description={CHALLENGES_DESCRIPTION}
          minValue={MIN_NUMBER_OF_WORDS}
          maxValue={numberOfLetters === 1 ? 2 : MAX_NUMBER_OF_WORDS}
        />
        {ENABLE_ARCHIVED_GAMES && (
          <div className="mb-3 flex justify-between gap-4 pt-3">
            <div className="text-left text-stone-700 dark:text-gray-300">
              <p className="leading-none">{DATEPICKER_TITLE}</p>
              <p className="mt-1 text-xs text-stone-700 dark:text-gray-300">
                {DATEPICKER_DESCRIPTION}
              </p>
            </div>
            <div>
              <p className="text-left text-stone-700 dark:text-gray-300">
                <button
                  type="button"
                  className="accent-button-large "
                  onClick={handleChooseDateButton}
                >
                  <CalendarIcon className="mr-2 h-6 w-6 cursor-pointer dark:stroke-white" />
                  {DATEPICKER_BUTTON}
                </button>
              </p>
            </div>
          </div>
        )}

        <SettingsToggle
          settingName="Hard Mode"
          flag={isHardMode}
          handleFlag={handleHardMode}
          description={HARD_MODE_DESCRIPTION}
        />
        <SettingsToggle
          settingName="Dark Mode"
          flag={isDarkMode}
          handleFlag={handleDarkMode}
        />
        <div className="-mb-3">
          <SettingsToggle
            settingName="High Contrast Mode"
            flag={isHighContrastMode}
            handleFlag={handleHighContrastMode}
            description={HIGH_CONTRAST_MODE_DESCRIPTION}
          />
        </div>
      </div>
    </BaseModal>
  )
}
