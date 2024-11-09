import { create } from 'zustand'

interface ActiveKeysState {
  activeKeys: Record<string, boolean>
}

const keyTimeouts: { [key: string]: NodeJS.Timeout | null } = {}

const useActiveKeys = create<ActiveKeysState>(() => ({
  activeKeys: {},
}))

export function useIsKeyActive(key: string) {
  return useActiveKeys((state) => state.activeKeys[key] || false)
}

export function activateKey(key: string) {
  useActiveKeys.setState((state) => {
    if (!state.activeKeys[key]) {
      // deactivate the key after 5 seconds assuming it's stuck down
      keyTimeouts[key] = setTimeout(() => {
        deactivateKey(key)
      }, 5000)

      return {
        activeKeys: { ...state.activeKeys, [key]: true },
      }
    }
    return state
  })
}

export function deactivateKey(key: string) {
  if (keyTimeouts[key]) {
    clearTimeout(keyTimeouts[key]!)
    keyTimeouts[key] = null
  }

  useActiveKeys.setState((state) => {
    if (!state.activeKeys[key]) return state

    const { [key]: _, ...newActiveKeys } = state.activeKeys
    return { activeKeys: newActiveKeys }
  })
}

export function deactivateAllKeys() {
  Object.values(keyTimeouts).forEach((timeout) => {
    if (timeout) clearTimeout(timeout)
  })

  Object.keys(keyTimeouts).forEach((key) => {
    keyTimeouts[key] = null
  })

  useActiveKeys.setState({ activeKeys: {} })
}
