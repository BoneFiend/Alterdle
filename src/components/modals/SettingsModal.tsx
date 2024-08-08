import { CalendarIcon } from '@heroicons/react/outline'

import {
  ENABLE_ARCHIVED_GAMES,
  MAX_NUMBER_OF_LETTERS,
  MAX_NUMBER_OF_WORDS,
  MIN_NUMBER_OF_LETTERS,
  MIN_NUMBER_OF_WORDS,
} from '../../constants/settings'
import {
  ADVANCED_SETTINGS_BUTTON,
  ADVANCED_SETTINGS_DESC,
  ADVANCED_SETTINGS_TITLE,
  CHALLENGES_DESCRIPTION,
  DATEPICKER_BUTTON,
  DATEPICKER_DESCRIPTION,
  DATEPICKER_TITLE,
  HARD_MODE_DESCRIPTION,
  HARD_MODE_RESTRICTION_MESSAGE,
  LENGTH_DESCRIPTION,
} from '../../constants/strings'
import useClientSettings from '../../stores/useClientSettings'
import useGameSettingsStore from '../../stores/useGameSettingsStore'
import useModalStore from '../../stores/useModalStore'
import { SettingsButton } from '../inputs/SettingsButton'
import { SettingsSlider } from '../inputs/SettingsSlider'
import { SettingsToggle } from '../inputs/SettingsToggle'
import { BaseModal } from './BaseModal'

type Props = {
  isHardMode: boolean
  handleHardMode: Function
}

export const SettingsModal = ({ isHardMode, handleHardMode }: Props) => {
  const {
    modals: { isSettingsModalOpen },
    updateModals,
  } = useModalStore()

  const {
    clientSettings: { isLongShare, isDarkMode, isHighContrastMode, isPerfMode },
    updateClientSettings,
  } = useClientSettings()

  const {
    numberOfWords,
    numberOfLetters,
    setNumberOfWords,
    setNumberOfLetters,
  } = useGameSettingsStore()

  const handleChooseDateButton = () => {
    updateModals({
      isDatePickerModalOpen: true,
      isSettingsModalOpen: false,
    })
  }

  const handleAdvancedSettingsButton = () => {
    updateModals({
      isSettingsModalOpen: false,
      isAdvancedSettingsModalOpen: true,
    })
  }

  const handleClose = () => {
    updateModals({ isSettingsModalOpen: false })
  }

  return (
    <BaseModal
      title="Settings"
      isOpen={isSettingsModalOpen}
      handleClose={handleClose}
      isSettingsModal
    >
      <div className="-mb-3 mt-2 flex flex-col divide-y divide-secondary-2">
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
          <SettingsButton
            settingName={DATEPICKER_TITLE}
            description={DATEPICKER_DESCRIPTION}
            onClick={handleChooseDateButton}
            Icon={CalendarIcon}
            buttonText={DATEPICKER_BUTTON}
          />
        )}
        <SettingsToggle
          // TODO fix hard mode toggling gives incorrect message
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
          settingName="Dark Mode"
          flag={isDarkMode}
          handleFlag={(e: boolean) => updateClientSettings({ isDarkMode: e })}
        />
        <SettingsButton
          settingName={ADVANCED_SETTINGS_TITLE}
          description={ADVANCED_SETTINGS_DESC}
          onClick={handleAdvancedSettingsButton}
          buttonText={ADVANCED_SETTINGS_BUTTON}
        />
      </div>
    </BaseModal>
  )
}
