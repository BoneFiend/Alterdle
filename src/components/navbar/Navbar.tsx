import { useMemo } from 'react'

import {
  ChartBarIcon,
  CogIcon,
  InformationCircleIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/outline'
import { CalendarIcon } from '@heroicons/react/outline'
import classNames from 'classnames'
import { format } from 'date-fns'

import { DATE_LOCALE } from '@constants/settings'
import { GAME_TITLE } from '@constants/strings'

import useClientSettings from '@stores/useClientSettings'
import useGameSettingsStore from '@stores/useGameSettingsStore'
import useModalStore from '@stores/useModalStore'

import { getIsLatestGame } from '@lib/words'

export const Navbar = () => {
  const { numberOfWords, numberOfLetters, gameDate } = useGameSettingsStore()

  const isLatestGame = useMemo(() => getIsLatestGame(gameDate), [gameDate])

  const {
    updateModals,
    modals: { isSettingsModalOpen },
  } = useModalStore()

  const {
    clientSettings: { isDarkMode },
  } = useClientSettings()

  return (
    <>
      <nav className="flex h-12 select-none items-center justify-between border-b-2 border-secondary-2 px-2 transition-all sm:h-16 short:h-auto">
        <div className="flex">
          <InformationCircleIcon
            className="h-7 w-7 cursor-pointer stroke-secondary transition-all duration-500 sm:h-8 sm:w-8 short:h-7 short:w-7"
            onClick={() => updateModals({ isInfoModalOpen: true })}
          />
          <QuestionMarkCircleIcon
            className="ml-3 h-7 w-7 cursor-pointer stroke-secondary transition-all duration-500 sm:h-8 sm:w-8 short:h-7 short:w-7"
            onClick={() => updateModals({ isHelpModalOpen: true })}
          />
        </div>
        <p className="text-2xl font-bold text-secondary transition-all duration-500 sm:text-4xl short:text-xl">
          {GAME_TITLE} {numberOfWords}x{numberOfLetters}
        </p>
        <div className="flex">
          <ChartBarIcon
            className="mr-3 h-7 w-7 cursor-pointer stroke-secondary transition-all duration-500 sm:h-8 sm:w-8 short:h-7 short:w-7"
            onClick={() => updateModals({ isStatsModalOpen: true })}
          />
          <CogIcon
            className="h-7 w-7 cursor-pointer stroke-secondary transition-all duration-500 sm:h-8 sm:w-8 short:h-7 short:w-7"
            onClick={() => updateModals({ isSettingsModalOpen: true })}
          />
        </div>
      </nav>
      <hr className="opacity-0" />
      {!isLatestGame && (
        <div className="my-1 flex items-center justify-center sm:mt-2">
          <CalendarIcon className="h-6 w-6 stroke-secondary" />
          <p className="ml-1 text-base text-secondary">
            {format(gameDate, 'd MMMM yyyy', { locale: DATE_LOCALE })}
          </p>
        </div>
      )}
      <div className="sm:-pb-5 short:-pb-5 relative z-10 -mb-3 h-3 sm:h-5 short:h-5">
        {(!isDarkMode || isSettingsModalOpen) && (
          <div
            className={classNames(
              'absolute h-full w-full bg-gradient-to-b from-primary-1-light-mode to-transparent opacity-100 transition-opacity duration-500 dark:opacity-0',
              isSettingsModalOpen && 'will-change-[opacity]'
            )}
          />
        )}
        {(isDarkMode || isSettingsModalOpen) && (
          <div
            className={classNames(
              'absolute h-full w-full bg-gradient-to-b from-primary-1-dark-mode to-transparent opacity-0 transition-opacity duration-500 dark:opacity-100',
              isSettingsModalOpen && 'will-change-[opacity]'
            )}
          />
        )}
      </div>
    </>
  )
}
