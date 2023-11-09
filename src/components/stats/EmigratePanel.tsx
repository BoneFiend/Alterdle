import { DuplicateIcon } from '@heroicons/react/outline'
import { useState } from 'react'

import { copyTextToClipboard } from '../../lib/clipboard'
import { encrypt } from '../../lib/encryption'
import { loadGameStateFromLocalStorage } from '../../lib/localStorage'
import { loadStats } from '../../lib/stats'
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
    <div className="text-sm text-gray-500 dark:text-gray-300">
      <label
        htmlFor="message"
        className="mb-2 block text-left text-sm font-medium text-gray-900 dark:text-gray-400"
      >
        Copy your migration code:
      </label>
      <textarea
        id="emigration-code"
        readOnly={true}
        rows={8}
        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        value={emigrationCode}
      />
      <button
        disabled={!isCopyButtonEnabled}
        onClick={copyEmigrationCodeToClipboard}
        type="button"
        className="accent-button migrate-button"
      >
        {isCopyButtonEnabled && (
          <DuplicateIcon className="mr-2 h-6 w-6 cursor-pointer dark:stroke-white" />
        )}
        {copyButtonText}
      </button>
    </div>
  )
}
