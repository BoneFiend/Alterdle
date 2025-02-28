import { useMemo } from 'react'

import { SaveIcon } from '@heroicons/react/outline'
import { useForm } from 'react-hook-form'

import { Button } from '@ui/inputs/Button'

import type { MigrationStats } from '@constants/types'

import cn from '@lib/cn'
import { decrypt } from '@lib/encryption'
import {
  saveGameStateToLocalStorage,
  saveStatsToLocalStorage,
} from '@lib/localStorage'

type DeviceForm = {
  value: string
}

export const ImmigratePanel = () => {
  const { register, handleSubmit, watch } = useForm<DeviceForm>()

  const value = watch('value')

  const isValid = useMemo(() => {
    try {
      const migrationStats = JSON.parse(decrypt(value) ?? '') as MigrationStats
      if (
        !migrationStats ||
        (!migrationStats.gameState && !migrationStats.statistics)
      ) {
        return false
      }

      return true
    } catch (error) {
      return false
    }
  }, [value])

  const handleSaveButton = ({ value }: DeviceForm) => {
    if (
      window.confirm(
        'Are you sure you want to override the statistics on this device? This action is not reversable.',
      )
    ) {
      const migrationStats = JSON.parse(decrypt(value) ?? '') as MigrationStats
      if (!migrationStats) return

      if (migrationStats.gameState) {
        saveGameStateToLocalStorage(true, migrationStats.gameState)
      }

      if (migrationStats.statistics) {
        saveStatsToLocalStorage(migrationStats.statistics)
      }

      window.location.reload()
    }
  }

  return (
    <form className="text-sm" onSubmit={handleSubmit(handleSaveButton)}>
      <label
        htmlFor="message"
        className="mb-2 block text-left text-sm font-medium text-ui-main"
      >
        Paste your migration code:
      </label>
      <textarea
        {...register('value')}
        id="immigration-code"
        rows={8}
        className={cn(
          'block w-full rounded-lg border border-ui-main/50 bg-ui-foundation-light p-2.5 text-sm text-ui-main focus:border-accent focus:ring-1 focus:ring-accent',
          !isValid && 'bg-incorrect/30',
        )}
      />
      <Button disabled={!isValid} type="submit" className="mt-2 w-min">
        <SaveIcon className="mr-2 h-6 w-6 cursor-pointer" />
        Save
      </Button>
    </form>
  )
}
