import type React from 'react'
import { useCallback, useEffect } from 'react'

import useClientSettings from '@stores/useClientSettings'

import cn from '@lib/cn'

const Theme: React.FC = () => {
  const { isDarkMode, isHighContrastMode } = useClientSettings((s) => ({
    isDarkMode: s.isDarkMode,
    isHighContrastMode: s.isHighContrastMode,
  }))

  const darkKey = 'dark'
  const highContrastKey = 'high-contrast'

  const applyTheme = useCallback((themeKey: string) => {
    document.documentElement.classList.add(themeKey)
  }, [])

  const removeTheme = useCallback((themeKey: string) => {
    document.documentElement.classList.remove(themeKey)
  }, [])

  useEffect(() => {
    if (isDarkMode) {
      applyTheme(darkKey)
    } else {
      removeTheme(darkKey)
    }
  }, [isDarkMode, applyTheme, removeTheme])

  useEffect(() => {
    if (isHighContrastMode) {
      applyTheme(highContrastKey)
    } else {
      removeTheme(highContrastKey)
    }
  }, [isHighContrastMode, applyTheme, removeTheme])

  return (
    <div
      className={cn(
        'fixed mt-12 h-[calc(100vh-3rem)] w-full bg-ui-foundation transition-colors duration-500 sm:mt-16 sm:h-[calc(100vh-4rem)]',
        'bg-gradient-to-b from-[--foundation-property] to-[--foundation-2-property] [transition-property:_--foundation-property,_--foundation-2-property]',
      )}
    />
  )
}

export default Theme
