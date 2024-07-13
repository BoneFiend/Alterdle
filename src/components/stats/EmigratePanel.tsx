import { DuplicateIcon } from '@heroicons/react/outline'
import { useState } from 'react'

import { copyTextToClipboard } from '../../lib/clipboard'
import { encrypt } from '../../lib/encryption'
import { loadGameStateFromLocalStorage } from '../../lib/localStorage'
import { loadStats } from '../../lib/stats'
import { Button } from '../inputs/Button'
import { MigrationStats } from '../modals/MigrateStatsModal'

export const EmigratePanel = () => {
  const [isCopyButtonEnabled, setIsCopyButtonEnabled] = useState(true)
  const [copyButtonText, setCopyButtonText] = useState('Copy')
  const stats = loadStats()
  const gameState = loadGameStateFromLocalStorage(true)

  const migrationStats: MigrationStats = {
    statistics: stats,
    gameState: gameState,
  }

  const emigrationCode = encrypt(JSON.stringify(migrationStats))

  const copyEmigrationCodeToClipboard = () => {
    copyTextToClipboard(emigrationCode)
    setCopyButtonText('Copied!')
    setIsCopyButtonEnabled(false)
  }

  return (
    <div className="text-sm text-secondary">
      <label
        htmlFor="message"
        className="mb-2 block text-left text-sm font-medium text-stone-900 dark:text-gray-400"
      >
        Copy your migration code:
      </label>
      <textarea
        id="emigration-code"
        readOnly={true}
        rows={8}
        className="block w-full rounded-lg border border-stone-400 bg-pink-50 p-2.5 text-sm text-stone-900  focus:border-stone-400 focus:ring-stone-400 dark:bg-stone-500 dark:text-white"
        value={emigrationCode}
      />
      <Button
        disabled={!isCopyButtonEnabled}
        onClick={copyEmigrationCodeToClipboard}
        className="w-min"
      >
        <DuplicateIcon className="mr-2 h-6 w-6 cursor-pointer dark:stroke-white" />
        {copyButtonText}
      </Button>
    </div>
  )
}
