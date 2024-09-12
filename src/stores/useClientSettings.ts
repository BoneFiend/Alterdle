import { create } from 'zustand'

import { ClientSettings, defaultClientSettings } from '../constants/types'
import {
  loadClientSettingsFromLocalStorage,
  saveClientSettingsToLocalStorage,
} from '../lib/localStorage'

type ClientSettingsStore = {
  clientSettings: ClientSettings
  loadClientSettings: () => void
  updateClientSettings: (clientSettings: Partial<ClientSettings>) => void
}

const useClientSettings = create<ClientSettingsStore>((set, get) => ({
  clientSettings: defaultClientSettings,

  loadClientSettings: () => {
    get().updateClientSettings(loadClientSettingsFromLocalStorage())
  },

  updateClientSettings: (clientSettings: Partial<ClientSettings>) => {
    saveClientSettingsToLocalStorage({
      ...get().clientSettings,
      ...clientSettings,
    })
    set(() => ({
      clientSettings: { ...get().clientSettings, ...clientSettings },
    }))
  },
}))

export default useClientSettings
