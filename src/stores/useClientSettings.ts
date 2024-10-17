import { create } from 'zustand'

import { defaultClientSettings } from '@constants/types'
import { ClientSettings } from '@constants/types'

import {
  loadClientSettingsFromLocalStorage,
  saveClientSettingsToLocalStorage,
} from '@lib/localStorage'

const useClientSettings = create<ClientSettings>(() => defaultClientSettings)

export function updateClientSettings(clientSettings: Partial<ClientSettings>) {
  useClientSettings.setState((state) => {
    const newSettings = {
      ...state,
      ...clientSettings,
    }

    saveClientSettingsToLocalStorage(newSettings)

    return newSettings
  })
}

export function loadClientSettings(): ClientSettings {
  const settings = loadClientSettingsFromLocalStorage()
  updateClientSettings(settings)
  return settings
}

export default useClientSettings
