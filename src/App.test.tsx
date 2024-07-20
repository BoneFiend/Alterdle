import { render, screen } from '@testing-library/react'
import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import App from './App'
import { GAME_TITLE } from './constants/strings'

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
