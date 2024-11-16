import { create } from 'zustand'

interface FocussedRows {
  focussedRows: number[]
}

const useFocussedRows = create<FocussedRows>(() => ({
  focussedRows: [],
}))

export function isRowFocussed(index: number) {
  const { focussedRows } = useFocussedRows.getState()
  return focussedRows.includes(index)
}

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
