import { useMemo } from 'react'

import cn from '@/lib/cn'
import {
  ChartBarIcon,
  CogIcon,
  InformationCircleIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/outline'
import { CalendarIcon } from '@heroicons/react/outline'
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
      <nav
        className={cn(
          'flex h-12 select-none items-center justify-between border-b-2 border-secondary-2 px-2 transition-[height,border-color] duration-500 sm:h-16 short:h-auto',
          '[&_svg]:h-7 [&_svg]:w-7 [&_svg]:cursor-pointer [&_svg]:stroke-secondary [&_svg]:transition-[height,stroke] [&_svg]:sm:h-8 [&_svg]:sm:w-8 [&_svg]:short:h-7 [&_svg]:short:w-7',
          '[&_*]:duration-500'
        )}
      >
        <div className="flex gap-3">
          <InformationCircleIcon
            onClick={() => updateModals({ isInfoModalOpen: true })}
          />
          <QuestionMarkCircleIcon
            onClick={() => updateModals({ isHelpModalOpen: true })}
          />
        </div>
        <p className="text-2xl font-bold text-secondary transition-[color,font-size] sm:text-4xl short:text-xl">
          {GAME_TITLE} {numberOfWords}x{numberOfLetters}
        </p>
        <div className="flex gap-3">
          <ChartBarIcon
            onClick={() => updateModals({ isStatsModalOpen: true })}
          />
          <CogIcon
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
      <div
        className={cn(
          'sm:-pb-5 short:-pb-5 relative z-10 -mb-3 h-3 *:absolute *:h-full *:w-full *:transition-opacity *:duration-500 sm:h-5 short:h-5',
          isSettingsModalOpen && '*:will-change-[opacity]'
        )}
      >
        {(!isDarkMode || isSettingsModalOpen) && (
          <div className="bg-gradient-to-b from-primary-1-light-mode to-transparent opacity-100 dark:opacity-0" />
        )}
        {(isDarkMode || isSettingsModalOpen) && (
          <div className="bg-gradient-to-b from-primary-1-dark-mode to-transparent opacity-0 dark:opacity-100" />
        )}
      </div>
    </>
  )
}
