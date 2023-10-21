import {
  MAX_NUMBER_OF_LETTERS,
  MAX_NUMBER_OF_WORDS,
} from '../../constants/settings'
import {
  CHALLENGES_DESCRIPTION,
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
}: Props) => {
  return (
    <BaseModal title="Settings" isOpen={isOpen} handleClose={handleClose}>
      <div className="mt-2 flex flex-col divide-y">
        <SettingsSlider
          settingName="Challenges"
          value={numberOfWords}
          handleValue={(value: number) => handleNumberOfWords(value)}
          description={CHALLENGES_DESCRIPTION}
          minValue={1}
          maxValue={MAX_NUMBER_OF_WORDS} // TODO dont allow more than 2 single letter words
        />
        <SettingsSlider
          settingName="Word Length"
          value={numberOfLetters}
          handleValue={(value: number) => handleNumberOfLetters(value)}
          description={LENGTH_DESCRIPTION}
          minValue={5}
          maxValue={MAX_NUMBER_OF_LETTERS}
        />
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
        <SettingsToggle
          settingName="High Contrast Mode"
          flag={isHighContrastMode}
          handleFlag={handleHighContrastMode}
          description={HIGH_CONTRAST_MODE_DESCRIPTION}
        />
      </div>
    </BaseModal>
  )
}
