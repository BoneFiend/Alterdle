import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline'
import { addDays, format, startOfDay } from 'date-fns'
import { useState } from 'react'
import DatePicker, { registerLocale } from 'react-datepicker'

import { DATE_LOCALE, GAME_EPOCH } from '../../constants/settings'
import {
  DATEPICKER_CHOOSE_TEXT,
  DATEPICKER_TITLE,
  DATEPICKER_TODAY_TEXT,
} from '../../constants/strings'
import { getToday, getYesterday } from '../../lib/dateutils'
import { getLastGameDate, isValidGameDate, periodInDays } from '../../lib/words'
import { BaseModal } from './BaseModal'

type Props = {
  isOpen: boolean
  initialDate?: Date
  handleSelectDate: (date: Date) => void
  handleClose: () => void
}

export const DatePickerModal = ({
  isOpen,
  initialDate,
  handleSelectDate,
  handleClose,
}: Props) => {
  const lastGameDate = getLastGameDate(getYesterday())
  const [selectedDate, setSelectedDate] = useState(() => {
    if (initialDate == null || initialDate > lastGameDate) {
      return lastGameDate
    }
    return initialDate
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

  return (
    <BaseModal
      title={DATEPICKER_TITLE}
      isOpen={isOpen}
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
              <span className="text-lg text-gray-700 dark:text-gray-100">
                {format(date, headingDateFormat, formatOptions)}
              </span>

              <div className="space-x-2">
                <button
                  onClick={decreaseMonth}
                  disabled={prevMonthButtonDisabled}
                  type="button"
                  className={`
                            ${
                              prevMonthButtonDisabled &&
                              'cursor-not-allowed opacity-50'
                            }
                            accent-button inline-flex rounded p-1 text-sm font-medium text-gray-700 shadow-sm
                        `}
                >
                  <ChevronLeftIcon className="h-5 w-5 text-white dark:text-gray-300" />
                </button>

                <button
                  onClick={increaseMonth}
                  disabled={nextMonthButtonDisabled}
                  type="button"
                  className={`
                            ${
                              nextMonthButtonDisabled &&
                              'cursor-not-allowed opacity-50'
                            }
                            accent-button inline-flex rounded p-1 text-sm font-medium text-gray-700 shadow-sm
                        `}
                >
                  <ChevronRightIcon className="h-5 w-5 text-white dark:text-gray-300" />
                </button>
              </div>
            </div>
          )}
        />
      </div>
      <p className="mt-1 text-sm text-stone-700 dark:text-gray-300">
        Only your guesses from today's Alterdle will be saved.
      </p>
      <div className="flex columns-2 items-stretch justify-center gap-2 text-center dark:text-white">
        <button
          type="button"
          disabled={!isValidGameDate(getToday())}
          className="accent-button-large disabled:border-none disabled:bg-pink-50 disabled:text-stone-900
          disabled:focus:outline-none disabled:dark:border-gray-600 disabled:dark:bg-stone-700 disabled:dark:text-gray-400"
          onClick={() => handleSelectDate(getToday())}
        >
          {DATEPICKER_CHOOSE_TEXT} {DATEPICKER_TODAY_TEXT}
        </button>
        <button
          type="button"
          className="accent-button-large"
          disabled={selectedDate >= getToday()}
          onClick={() => handleSelectDate(selectedDate)}
        >
          {DATEPICKER_CHOOSE_TEXT}
          <br />
          {format(selectedDate, buttonDateFormat, formatOptions)}
        </button>
      </div>
    </BaseModal>
  )
}
