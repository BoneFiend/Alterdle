import { LogoutIcon } from '@heroicons/react/outline'

import {
  MIGRATE_BUTTON_TEXT,
  MIGRATE_DESCRIPTION_TEXT,
} from '../../constants/strings'
import { Button } from '../inputs/Button'

type Props = {
  handleMigrateStatsButton: () => void
}

export const MigrationIntro = ({ handleMigrateStatsButton }: Props) => {
  return (
    <div className="columns-2 items-stretch justify-center pt-3 text-left text-stone-700 dark:text-gray-300">
      <p className="leading-none">New Device</p>
      <div className="mt-1 text-xs">{MIGRATE_DESCRIPTION_TEXT}</div>
      <Button onClick={handleMigrateStatsButton}>
        <LogoutIcon className="mr-2 h-6 w-6 cursor-pointer dark:stroke-white" />
        {MIGRATE_BUTTON_TEXT}
      </Button>
    </div>
  )
}
