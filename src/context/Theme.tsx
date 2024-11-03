import React, { useEffect } from 'react'

import useClientSettings from '@stores/useClientSettings'
import useModalStore from '@stores/useModalStore'

import cn from '@lib/cn'

const Theme: React.FC = () => {
  const { isDarkMode, isHighContrastMode } = useClientSettings((s) => ({
    isDarkMode: s.isDarkMode,
    isHighContrastMode: s.isHighContrastMode,
  }))

  const isSettingsModalOpen = useModalStore((s) => s.modals.isSettingsModalOpen)

  const darkKey = 'dark'
  const highContrastKey = 'high-contrast'

  const applyTheme = (themeKey: string) => {
    document.documentElement.classList.add(themeKey)
  }

  const removeTheme = (themeKey: string) => {
    document.documentElement.classList.remove(themeKey)
  }

  useEffect(() => {
    if (isDarkMode) {
      applyTheme(darkKey)
    } else {
      removeTheme(darkKey)
    }
  }, [isDarkMode])

  useEffect(() => {
    if (isHighContrastMode) {
      applyTheme(highContrastKey)
    } else {
      removeTheme(highContrastKey)
    }
  }, [isHighContrastMode])

  const classes =
    'fixed mt-12 h-[calc(100vh-3rem)] w-full sm:mt-16 sm:h-[calc(100vh-4rem)]'

  return (
    <div className="bg-ui-foundation-1 fixed h-full w-full transition-colors duration-500">
      {(!isDarkMode || isSettingsModalOpen) && (
        <div
          className={cn(
            'h-full bg-gradient-to-b from-ui-foundation-1-light-mode to-ui-foundation-2-light-mode',
            classes,
          )}
        />
      )}
      {(isDarkMode || isSettingsModalOpen) && (
        <div
          className={cn(
            'bg-gradient-to-b from-ui-foundation-1-dark-mode to-ui-foundation-2-dark-mode opacity-0 transition-opacity duration-500 dark:opacity-100',
            classes,
            isSettingsModalOpen && 'will-change-[opacity]',
          )}
        />
      )}
    </div>
  )
}

export default Theme
