import { useState } from 'react'

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline'
import { addDays, format, startOfDay } from 'date-fns'
import DatePicker, { registerLocale } from 'react-datepicker'

import { Button } from '@ui/inputs/Button'

import { DATE_LOCALE, GAME_EPOCH } from '@constants/settings'
import {
  DATEPICKER_CHOOSE_TEXT,
  DATEPICKER_TITLE,
  DATEPICKER_TODAY_TEXT,
} from '@constants/strings'

import useGameSettingsStore, { setGameDate } from '@stores/useGameSettingsStore'
import useModalStore, { updateModals } from '@stores/useModalStore'

import { getToday, getYesterday } from '@lib/dateutils'
import { setUrl } from '@lib/urlutils'
import { getLastGameDate, isValidGameDate, periodInDays } from '@lib/words'

import { BaseModal } from './BaseModal'

export const DatePickerModal = () => {
  const isDatePickerModalOpen = useModalStore(
    (s) => s.modals.isDatePickerModalOpen,
  )

  const { numberOfWords, numberOfLetters, gameDate } = useGameSettingsStore(
    (s) => ({
      numberOfWords: s.numberOfWords,
      numberOfLetters: s.numberOfLetters,
      gameDate: s.gameDate,
    }),
  )

  const lastGameDate = getLastGameDate(getYesterday())
  const [selectedDate, setSelectedDate] = useState(() => {
    if (gameDate == null || gameDate > lastGameDate) {
      return lastGameDate
    }
    return gameDate
  })

  const headingDateFormat = 'MMMM yyyy'
  const buttonDateFormat = 'd MMM yyyy'
  const formatOptions = { locale: DATE_LOCALE }

  registerLocale('locale', DATE_LOCALE)

  const excludedDates: Date[] = []
  if (periodInDays > 1) {
    let date = GAME_EPOCH
    for (date = GAME_EPOCH; date < getToday(); date = addDays(date, 1)) {
      if (!isValidGameDate(date)) {
        excludedDates.push(date)
      }
    }
  }

  const handleSelectDate = (d: Date) => {
    updateModals({
      isDatePickerModalOpen: false,
      isSettingsModalOpen: false,
    })
    setGameDate(d)
    setUrl(numberOfWords, numberOfLetters, d)
  }

  const handleClose = () => {
    updateModals({
      isSettingsModalOpen: true,
      isDatePickerModalOpen: false,
    })
  }

  return (
    <BaseModal
      title={DATEPICKER_TITLE}
      isOpen={isDatePickerModalOpen}
      handleClose={handleClose}
    >
      <div className="mx-auto flex max-w-2xl items-center justify-center space-x-4 pt-2 text-left sm:w-48">
        <DatePicker
          locale="locale"
          minDate={GAME_EPOCH}
          maxDate={getYesterday()}
          selected={selectedDate}
          excludeDates={excludedDates}
          onChange={(date: Date) => setSelectedDate(startOfDay(date))}
          inline
          popperClassName="react-datepicker-left"
          renderCustomHeader={({
            date,
            decreaseMonth,
            increaseMonth,
            prevMonthButtonDisabled,
            nextMonthButtonDisabled,
          }) => (
            <div className="flex items-center justify-between px-2 py-2">
              <span className="text-lg text-ui-main">
                {format(date, headingDateFormat, formatOptions)}
              </span>
              <div className="space-x-2">
                <Button
                  variant="basic"
                  onClick={decreaseMonth}
                  disabled={prevMonthButtonDisabled}
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </Button>
                <Button
                  variant="basic"
                  onClick={increaseMonth}
                  disabled={nextMonthButtonDisabled}
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </Button>
              </div>
            </div>
          )}
        />
      </div>
      <p className="mt-1 text-sm text-ui-main">
        Only your guesses from today's Alterdle will be saved.
      </p>
      <div className="mt-2 flex columns-2 items-stretch justify-center gap-2">
        <Button
          disabled={!isValidGameDate(getToday())}
          onClick={() => handleSelectDate(getToday())}
          priority="secondary"
        >
          {DATEPICKER_CHOOSE_TEXT} {DATEPICKER_TODAY_TEXT}
        </Button>
        <Button
          disabled={selectedDate >= getToday()}
          onClick={() => handleSelectDate(selectedDate)}
        >
          {DATEPICKER_CHOOSE_TEXT}
          <br />
          {format(selectedDate, buttonDateFormat, formatOptions)}
        </Button>
      </div>
    </BaseModal>
  )
}
