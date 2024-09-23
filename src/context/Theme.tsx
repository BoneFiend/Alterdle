import classNames from 'classnames'
import React, { useEffect } from 'react'

import useClientSettings from '../stores/useClientSettings'
import useModalStore from '../stores/useModalStore'

const Theme: React.FC = () => {
  const {
    clientSettings: { isDarkMode, isHighContrastMode },
  } = useClientSettings()

  const {
    modals: { isSettingsModalOpen },
  } = useModalStore()

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

  return (
    <>
      {(!isDarkMode || isSettingsModalOpen) && (
        <div className="fixed h-full w-full bg-gradient-to-b from-primary-1-light-mode to-primary-2-light-mode" />
      )}
      {(isDarkMode || isSettingsModalOpen) && (
        <div
          className={classNames(
            'fixed h-full w-full bg-gradient-to-b from-primary-1-dark-mode to-primary-2-dark-mode opacity-0 transition-opacity duration-500 dark:opacity-100',
            isSettingsModalOpen && 'will-change-[opacity]'
          )}
        />
      )}
    </>
  )
}

export default Theme
