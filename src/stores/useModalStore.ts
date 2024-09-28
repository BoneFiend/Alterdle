import { create } from 'zustand'

import { Modals, defaultModals } from '@constants/types'

type ModalStore = {
  modals: Modals
  isAnyModalOpen: boolean
  updateModals: (modals: Partial<Modals>) => void
}

const useModalStore = create<ModalStore>((set) => {
  const calculateIsAnyModalOpen = (modals: Modals) =>
    Object.values(modals).some((value) => value)

  return {
    modals: defaultModals,
    isAnyModalOpen: calculateIsAnyModalOpen(defaultModals),

    updateModals: (newModals: Partial<Modals>) => {
      set((state) => ({
        modals: { ...state.modals, ...newModals },
        isAnyModalOpen: calculateIsAnyModalOpen({
          ...state.modals,
          ...newModals,
        }),
      }))
    },
  }
})

export default useModalStore
