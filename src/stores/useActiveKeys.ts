import { create } from 'zustand'

interface ActiveKeys {
  activeKeys: string[]
  activateKey: (index: string) => void
  deactivateKey: (index: string) => void
  isKeyActive: (index: string) => boolean
}

const useActiveKeys = create<ActiveKeys>((set, get) => ({
  activeKeys: [],

  activateKey: (index: string) =>
    set((state) => {
      if (!state.activeKeys.includes(index)) {
        return {
          activeKeys: [...state.activeKeys, index],
        }
      }
      return state
    }),

  deactivateKey: (index: string) =>
    set((state) => ({
      activeKeys: state.activeKeys.slice(1),
    })),

  isKeyActive: (index: string) => {
    const { activeKeys } = get()
    return activeKeys.includes(index)
  },
}))

export default useActiveKeys
