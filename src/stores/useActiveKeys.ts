import { create } from 'zustand'

interface ActiveKeys {
  activeKeys: string[]
  isKeyActive: (key: string) => boolean
}

const keyTimeouts: { [key: string]: NodeJS.Timeout | null } = {}

const useActiveKeys = create<ActiveKeys>((_, get) => ({
  activeKeys: [],

  isKeyActive: (key: string) => {
    const { activeKeys } = get()
    return activeKeys.includes(key)
  },
}))

export function activateKey(key: string) {
  useActiveKeys.setState((state) => {
    if (!state.activeKeys.includes(key)) {
      // deactivate the key after 5 seconds assuming it's stuck down
      keyTimeouts[key] = setTimeout(() => {
        deactivateKey(key)
      }, 5000)

      return {
        activeKeys: [...state.activeKeys, key],
      }
    }
    return state
  })
}

export function deactivateKey(key: string) {
  if (keyTimeouts[key]) {
    clearTimeout(keyTimeouts[key])
    keyTimeouts[key] = null
  }
  useActiveKeys.setState((state) => ({
    activeKeys: state.activeKeys.filter((i) => i !== key),
  }))
}

export function deactivateAllKeys() {
  useActiveKeys.setState({ activeKeys: [] })
}

export default useActiveKeys
