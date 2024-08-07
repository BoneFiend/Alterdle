import React, { useEffect } from 'react'

import useClientSettings from '../stores/useClientSettings'

const Theme: React.FC = () => {
  const {
    clientSettings: { isDarkMode, isHighContrastMode },
  } = useClientSettings()

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

  return null
}

export default Theme
