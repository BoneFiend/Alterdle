import { useMemo } from 'react'

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

import useGameSettingsStore from '@stores/useGameSettingsStore'
import { updateModals } from '@stores/useModalStore'

import cn from '@lib/cn'
import { getIsLatestGame } from '@lib/words'

export const Navbar = () => {
  const { numberOfWords, numberOfLetters, gameDate } = useGameSettingsStore(
    (s) => ({
      numberOfWords: s.numberOfWords,
      numberOfLetters: s.numberOfLetters,
      gameDate: s.gameDate,
    }),
  )

  const isLatestGame = useMemo(() => getIsLatestGame(gameDate), [gameDate])

  return (
    <>
      <nav
        className={cn(
          'flex h-12 select-none items-center justify-between border-b-2 border-ui-main/50 bg-ui-foundation px-2 transition-[height,border-color,background-color] duration-500 sm:h-16 short:h-auto',
          '[&_svg]:h-7 [&_svg]:w-7 [&_svg]:cursor-pointer [&_svg]:stroke-ui-main [&_svg]:transition-[height,stroke] [&_svg]:sm:h-8 [&_svg]:sm:w-8 [&_svg]:short:h-7 [&_svg]:short:w-7',
          '[&_*]:duration-500',
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
        <h2 className="text-2xl font-bold text-ui-main transition-[color,font-size] sm:text-4xl short:text-xl">
          {GAME_TITLE} {numberOfWords}x{numberOfLetters}
        </h2>
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
          <CalendarIcon className="h-6 w-6 stroke-ui-main" />
          <p className="ml-1 text-base text-ui-main">
            {format(gameDate, 'd MMMM yyyy', { locale: DATE_LOCALE })}
          </p>
        </div>
      )}
      <div
        className={cn(
          'sm:-pb-5 short:-pb-5 relative z-10 -mb-3 h-3 duration-500 ease-in-out sm:h-5 short:h-5',
          'bg-gradient-to-b from-[--foundation-property] to-transparent [transition-property:_--foundation-property]',
        )}
      />
    </>
  )
}
