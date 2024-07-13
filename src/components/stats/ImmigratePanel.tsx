import { SaveIcon } from '@heroicons/react/outline'
import { useState } from 'react'

import { decrypt } from '../../lib/encryption'
import {
  saveGameStateToLocalStorage,
  saveStatsToLocalStorage,
} from '../../lib/localStorage'
import { Button } from '../inputs/Button'
import { MigrationStats } from '../modals/MigrateStatsModal'

export const ImmigratePanel = () => {
  const [isSaveButtonEnabled, setIsSaveButtonEnabled] = useState(false)

  const textareaClassNames = {
    valid: ['bg-pink-50', 'dark:bg-stone-700'],
    invalid: ['bg-red-300', 'dark:bg-red-500'],
  }
  const allClassNames = [
    ...textareaClassNames.valid,
    ...textareaClassNames.invalid,
  ]

  const handleImmigrationCodeChange = (event: any) => {
    if (event.target instanceof Element) {
      const textarea = event.target

      allClassNames.forEach((cn) => textarea.classList.remove(cn))

      setIsSaveButtonEnabled(false)

      const text = textarea.value

      try {
        const migrationStats = JSON.parse(decrypt(text) ?? '') as MigrationStats
        if (
          !migrationStats ||
          (!migrationStats.gameState && !migrationStats.statistics)
        ) {
          textareaClassNames.invalid.forEach((cn) => textarea.classList.add(cn))
          return
        }

        textareaClassNames.valid.forEach((cn) => textarea.classList.add(cn))
        setIsSaveButtonEnabled(true)
      } catch (error) {
        textareaClassNames.invalid.forEach((cn) => textarea.classList.add(cn))
      }
    }
  }

  const handleSaveButton = () => {
    const textarea = document.getElementById(
      'immigration-code'
    ) as HTMLInputElement
    if (
      textarea &&
      window.confirm(
        'Are you sure you want to override the statistics on this device? This action is not reversable.'
      )
    ) {
      var migrationStats = JSON.parse(
        decrypt(textarea.value) ?? ''
      ) as MigrationStats
      if (!migrationStats) return

      if (migrationStats.gameState) {
        saveGameStateToLocalStorage(true, migrationStats.gameState)
      }

      if (migrationStats.statistics) {
        saveStatsToLocalStorage(migrationStats.statistics)
      }

      alert('The site will now reload.')

      window.location.reload()
    }
  }

  return (
    <div className="text-sm text-gray-500 dark:text-gray-300">
      <label
        htmlFor="message"
        className="mb-2 block text-left text-sm font-medium text-gray-900 dark:text-gray-400"
      >
        Paste your migration code:
      </label>
      <textarea
        onChange={(e) => handleImmigrationCodeChange(e)}
        id="immigration-code"
        rows={8}
        className="block w-full rounded-lg border border-stone-400 bg-pink-50 p-2.5 text-sm text-stone-900  focus:border-stone-400 focus:ring-stone-400 dark:bg-stone-500 dark:text-white"
      ></textarea>
      <Button
        disabled={!isSaveButtonEnabled}
        onClick={handleSaveButton}
        className="migrate-button"
      >
        {isSaveButtonEnabled && (
          <SaveIcon className="mr-2 h-6 w-6 cursor-pointer dark:stroke-white" />
        )}
        Save
      </Button>
    </div>
  )
}
