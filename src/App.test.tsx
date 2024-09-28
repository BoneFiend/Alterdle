import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { GAME_TITLE } from '@constants/strings'

import App from './App'

beforeEach(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
})

describe('App Component', () => {
  it('renders App component', () => {
    render(<App />)
    const linkElement = screen.getByText(GAME_TITLE)
    expect(linkElement).toBeInTheDocument()
  })
})
