import { create } from 'zustand'

import { type Modals, defaultModals } from '@constants/types'

type ModalStore = {
  modals: Modals
  isAnyModalOpen: boolean
}

const useModalStore = create<ModalStore>(() => ({
  modals: defaultModals,
  isAnyModalOpen: calculateIsAnyModalOpen(defaultModals),
}))

function calculateIsAnyModalOpen(modals: Modals) {
  return Object.values(modals).some((value) => value)
}

export function updateModals(modals: Partial<Modals>) {
  useModalStore.setState((state) => {
    const newModals = { ...state.modals, ...modals }
    return {
      modals: newModals,
      isAnyModalOpen: calculateIsAnyModalOpen(newModals),
    }
  })
}

export default useModalStore
