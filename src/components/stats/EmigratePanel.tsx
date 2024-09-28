import { useState } from 'react'

import { DuplicateIcon } from '@heroicons/react/outline'

import { Button } from '@ui/inputs/Button'

import { MigrationStats } from '@constants/types'

import { copyTextToClipboard } from '@lib/clipboard'
import { encrypt } from '@lib/encryption'
import { loadGameStateFromLocalStorage } from '@lib/localStorage'
import { loadStats } from '@lib/stats'

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
        className="block w-full rounded-lg border border-accent-disabled bg-primary-light p-2.5 text-sm text-blank focus:border-accent-disabled focus:ring-accent-disabled"
        value={emigrationCode}
      />
      <Button
        disabled={!isCopyButtonEnabled}
        onClick={copyEmigrationCodeToClipboard}
        className="mt-2 w-min"
      >
        <DuplicateIcon className="mr-2 h-6 w-6 cursor-pointer" />
        {copyButtonText}
      </Button>
    </div>
  )
}
