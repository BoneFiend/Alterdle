import {
  ChartBarIcon,
  CogIcon,
  InformationCircleIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/outline'

import { GAME_TITLE } from '../../constants/strings'
import useGameSettings from '../../stores/gameSettings'

type Props = {
  setIsInfoModalOpen: (value: boolean) => void
  setIsHelpModalOpen: (value: boolean) => void
  setIsStatsModalOpen: (value: boolean) => void
  setIsSettingsModalOpen: (value: boolean) => void
}

export const Navbar = ({
  setIsInfoModalOpen,
  setIsHelpModalOpen,
  setIsStatsModalOpen,
  setIsSettingsModalOpen,
}: Props) => {
  const { numberOfWords, numberOfLetters } = useGameSettings()

  return (
    <div className="select-none pb-5 transition-all sm:pb-2 short:pb-2">
      <div className="flex h-12 items-center justify-between border-b-2 border-secondary-2 px-2 transition-all sm:h-16 short:h-auto">
        <div className="flex">
          <InformationCircleIcon
            className="h-7 w-7 cursor-pointer stroke-secondary transition-all duration-500 sm:h-8 sm:w-8 short:h-7 short:w-7"
            onClick={() => setIsInfoModalOpen(true)}
          />
          <QuestionMarkCircleIcon
            className="ml-3 h-7 w-7 cursor-pointer stroke-secondary transition-all duration-500 sm:h-8 sm:w-8 short:h-7 short:w-7"
            onClick={() => setIsHelpModalOpen(true)}
          />
        </div>
        <p className="text-2xl font-bold text-secondary transition-all duration-500 sm:text-4xl short:text-xl">
          {GAME_TITLE} {numberOfWords}x{numberOfLetters}
        </p>
        <div className="flex">
          <ChartBarIcon
            className="mr-3 h-7 w-7 cursor-pointer stroke-secondary transition-all duration-500 sm:h-8 sm:w-8 short:h-7 short:w-7"
            onClick={() => setIsStatsModalOpen(true)}
          />

          <CogIcon
            className="h-7 w-7 cursor-pointer stroke-secondary transition-all duration-500 sm:h-8 sm:w-8 short:h-7 short:w-7"
            onClick={() => setIsSettingsModalOpen(true)}
          />
        </div>
      </div>
      <hr className="opacity-0" />
    </div>
  )
}
