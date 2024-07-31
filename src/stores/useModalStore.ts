import { create } from 'zustand'

interface Modals {
  isHelpModalOpen: boolean
  isStatsModalOpen: boolean
  isSettingsModalOpen: boolean
  isMigrateStatsModalOpen: boolean
  isInfoModalOpen: boolean
  isDatePickerModalOpen: boolean

  isAnyModalOpen: boolean

  setIsHelpModalOpen: (value: boolean) => void
  setIsStatsModalOpen: (value: boolean) => void
  setIsSettingsModalOpen: (value: boolean) => void
  setIsMigrateStatsModalOpen: (value: boolean) => void
  setIsInfoModalOpen: (value: boolean) => void
  setIsDatePickerModalOpen: (value: boolean) => void
}

const useModalStore = create<Modals>((set) => {
  const calculateIsAnyModalOpen = (state: Partial<Modals>) => {
    return (
      state.isHelpModalOpen ||
      state.isStatsModalOpen ||
      state.isSettingsModalOpen ||
      state.isMigrateStatsModalOpen ||
      state.isInfoModalOpen ||
      state.isDatePickerModalOpen
    )
  }

  return {
    isHelpModalOpen: false,
    isStatsModalOpen: false,
    isSettingsModalOpen: false,
    isMigrateStatsModalOpen: false,
    isInfoModalOpen: false,
    isDatePickerModalOpen: false,

    isAnyModalOpen: false,

    setIsHelpModalOpen: (value: boolean) => {
      set((state) => ({
        isHelpModalOpen: value,
        isAnyModalOpen: calculateIsAnyModalOpen({
          ...state,
          isHelpModalOpen: value,
        }),
      }))
    },
    setIsStatsModalOpen: (value: boolean) => {
      set((state) => ({
        isStatsModalOpen: value,
        isAnyModalOpen: calculateIsAnyModalOpen({
          ...state,
          isStatsModalOpen: value,
        }),
      }))
    },
    setIsSettingsModalOpen: (value: boolean) => {
      set((state) => ({
        isSettingsModalOpen: value,
        isAnyModalOpen: calculateIsAnyModalOpen({
          ...state,
          isSettingsModalOpen: value,
        }),
      }))
    },
    setIsMigrateStatsModalOpen: (value: boolean) => {
      set((state) => ({
        isMigrateStatsModalOpen: value,
        isAnyModalOpen: calculateIsAnyModalOpen({
          ...state,
          isMigrateStatsModalOpen: value,
        }),
      }))
    },
    setIsInfoModalOpen: (value: boolean) => {
      set((state) => ({
        isInfoModalOpen: value,
        isAnyModalOpen: calculateIsAnyModalOpen({
          ...state,
          isInfoModalOpen: value,
        }),
      }))
    },
    setIsDatePickerModalOpen: (value: boolean) => {
      set((state) => ({
        isDatePickerModalOpen: value,
        isAnyModalOpen: calculateIsAnyModalOpen({
          ...state,
          isDatePickerModalOpen: value,
        }),
      }))
    },
  }
})

export default useModalStore
