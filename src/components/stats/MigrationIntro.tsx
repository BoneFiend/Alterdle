import { LogoutIcon } from '@heroicons/react/outline'

import {
  MIGRATE_BUTTON_TEXT,
  MIGRATE_DESCRIPTION_TEXT,
} from '../../constants/strings'

type Props = {
  handleMigrateStatsButton: () => void
}

export const MigrationIntro = ({ handleMigrateStatsButton }: Props) => {
  return (
    <div className="columns-2 items-stretch justify-center pt-3 text-left text-stone-700 dark:text-gray-300">
      <p className="leading-none">New Device</p>
      <div className="mt-1 text-xs">{MIGRATE_DESCRIPTION_TEXT}</div>
      <button
        type="button"
        className="accent-button-large "
        onClick={handleMigrateStatsButton}
      >
        <LogoutIcon className="mr-2 h-6 w-6 cursor-pointer dark:stroke-white" />
        {MIGRATE_BUTTON_TEXT}
      </button>
    </div>
  )
}
