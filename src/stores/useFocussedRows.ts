import { create } from 'zustand'

interface FocussedRows {
  focussedRows: number[]
  focusRow: (index: number) => void
  unfocusEarliestRow: () => void
  unfocusAllRows: () => void
  isRowFocussed: (index: number) => boolean
}

const useFocussedRows = create<FocussedRows>((set, get) => ({
  focussedRows: [],

  focusRow: (index: number) =>
    set((state) => {
      if (!state.focussedRows.includes(index)) {
        return {
          focussedRows: [...state.focussedRows, index],
        }
      }
      return state
    }),

  unfocusEarliestRow: () =>
    set((state) => ({
      focussedRows: state.focussedRows.slice(1),
    })),

  unfocusAllRows: () =>
    set(() => ({
      focussedRows: [],
    })),

  isRowFocussed: (index: number) => {
    const { focussedRows } = get()
    return focussedRows.includes(index)
  },
}))

export default useFocussedRows
