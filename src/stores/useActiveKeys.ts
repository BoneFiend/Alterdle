import { create } from 'zustand'

interface ActiveKeys {
  activeKeys: string[]
  activateKey: (key: string) => void
  deactivateKey: (key: string) => void
  deactivateAllKeys: () => void
  isKeyActive: (key: string) => boolean
}

const keyTimeouts: { [key: string]: NodeJS.Timeout | null } = {}

const useActiveKeys = create<ActiveKeys>((set, get) => ({
  activeKeys: [],

  activateKey: (key: string) => {
    set((state) => {
      if (!state.activeKeys.includes(key)) {
        // deactivate the key after 5 seconds assuming it's stuck down
        keyTimeouts[key] = setTimeout(() => {
          get().deactivateKey(key)
        }, 5000)

        return {
          activeKeys: [...state.activeKeys, key],
        }
      }
      return state
    })
  },

  deactivateKey: (key: string) => {
    if (keyTimeouts[key]) {
      clearTimeout(keyTimeouts[key])
      keyTimeouts[key] = null
    }
    set((state) => ({
      activeKeys: state.activeKeys.filter((i) => i !== key),
    }))
  },

  isKeyActive: (key: string) => {
    const { activeKeys } = get()
    return activeKeys.includes(key)
  },

  deactivateAllKeys: () => {
    set({ activeKeys: [] })
  },
}))

export default useActiveKeys
