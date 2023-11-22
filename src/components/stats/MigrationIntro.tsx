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
    <div className="columns-2 items-center items-stretch justify-center pt-3 text-center dark:text-white">
      <div className="mt-3 text-xs">{MIGRATE_DESCRIPTION_TEXT}</div>
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
