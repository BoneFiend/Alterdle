import { create } from 'zustand'

import { ClientSettings, defaultClientSettings } from '../constants/types'
import {
  loadClientSettingsFromLocalStorage,
  saveClientSettingsToLocalStorage,
} from '../lib/localStorage'

type ClientSettingsStore = {
  clientSettings: ClientSettings
  loadAllSettings: () => void
  setClientSettings: (clientSettings: ClientSettings) => void
}

const useClientSettings = create<ClientSettingsStore>((set, get) => ({
  clientSettings: defaultClientSettings,

  loadAllSettings: () => {
    get().setClientSettings(loadClientSettingsFromLocalStorage())
  },

  setClientSettings: (clientSettings: ClientSettings) => {
    saveClientSettingsToLocalStorage(clientSettings)
    set(() => ({ clientSettings }))
  },
}))

export default useClientSettings
