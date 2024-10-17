import { create } from 'zustand'

interface FocussedRows {
  focussedRows: number[]
  isRowFocussed: (index: number) => boolean
}

const useFocussedRows = create<FocussedRows>((_, get) => ({
  focussedRows: [],

  isRowFocussed: (index: number) => {
    const { focussedRows } = get()
    return focussedRows.includes(index)
  },
}))

export function focusRow(index: number) {
  useFocussedRows.setState((state) => {
    if (!state.focussedRows.includes(index)) {
      return {
        focussedRows: [...state.focussedRows, index],
      }
    }
    return state
  })
}

export function unfocusEarliestRow() {
  useFocussedRows.setState((state) => ({
    focussedRows: state.focussedRows.slice(1),
  }))
}

export function unfocusAllRows() {
  useFocussedRows.setState(() => ({
    focussedRows: [],
  }))
}

export default useFocussedRows
