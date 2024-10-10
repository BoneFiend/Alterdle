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
    <div className="text-sm">
      <label
        htmlFor="message"
        className="mb-2 block text-left text-sm font-medium text-blank"
      >
        Copy your migration code:
      </label>
      <textarea
        id="emigration-code"
        readOnly={true}
        rows={8}
        className="block w-full rounded-lg border border-secondary-2 bg-primary-light p-2.5 text-sm text-blank focus:border-secondary-2 focus:ring-secondary-2"
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
