import { CalendarIcon } from '@heroicons/react/outline'
import classNames from 'classnames'
import { format } from 'date-fns'
import { default as GraphemeSplitter } from 'grapheme-splitter'
import { useEffect, useMemo, useRef, useState } from 'react'
import Div100vh from 'react-div-100vh'

import { AlertContainer } from './components/alerts/AlertContainer'
import { Grid } from './components/grid/Grid'
import { Keyboard } from './components/keyboard/Keyboard'
import { AdvancedSettingsModal } from './components/modals/AdvancedSettingsModal'
import { DatePickerModal } from './components/modals/DatePickerModal'
import { HelpModal } from './components/modals/HelpModal'
import { InfoModal } from './components/modals/InfoModal'
import { MigrateStatsModal } from './components/modals/MigrateStatsModal'
import { SettingsModal } from './components/modals/SettingsModal'
import { StatsModal } from './components/modals/StatsModal'
import { Navbar } from './components/navbar/Navbar'
import {
  DATE_LOCALE,
  DISCOURAGE_INAPP_BROWSERS,
  LONG_ALERT_TIME_MS,
  REVEAL_TIME_MS,
  WELCOME_HELP_MODAL_MS,
} from './constants/settings'
import {
  DISCOURAGE_INAPP_BROWSER_TEXT,
  GAME_COPIED_MESSAGE,
  HARD_MODE_CHEATING_MESSAGE,
  HARD_MODE_RESTRICTION_MESSAGE,
  LOSE_MESSAGES,
  NOT_ENOUGH_LETTERS_MESSAGE,
  SHARE_FAILURE_TEXT,
  WIN_MESSAGES,
  WORD_NOT_FOUND_MESSAGE,
} from './constants/strings'
import { Obj2d, updateObj2d } from './constants/types'
import { useAlert } from './context/AlertContext'
import { useGameSettings } from './hooks/useGameSettings'
import { isInAppBrowser } from './lib/browser'
import {
  loadGameStateFromLocalStorage,
  removeLegacyKeys,
  saveGameStateToLocalStorage,
} from './lib/localStorage'
import { addStatsForCompletedGame, loadStats } from './lib/stats'
import {
  calculateMaxChallenges,
  checkIsGameWon,
  countGridsWon,
  findFirstUnusedReveal,
  getIsLatestGame,
  getSolution,
  isWordInWordList,
  loadGuesses,
  unicodeLength,
} from './lib/words'
import useClientSettings from './stores/useClientSettings'
import useFocussedRows from './stores/useFocussedRows'
import useModalStore from './stores/useModalStore'

function App() {
  const { numberOfWords, numberOfLetters, gameDate } = useGameSettings()

  const isLatestGame = useMemo(() => getIsLatestGame(gameDate), [gameDate])

  const { showError: showErrorAlert, showSuccess: showSuccessAlert } =
    useAlert()

  const {
    modals: { isSettingsModalOpen },
    isAnyModalOpen,
    updateModals,
  } = useModalStore()

  const [currentRowClass, setCurrentRowClass] = useState('')

  const {
    clientSettings: { isDarkMode, isHardModePreferred },
    loadAllSettings,
    updateClientSettings,
  } = useClientSettings()

  const { isRowFocussed, focusRow, unfocusEarliestRow, unfocusAllRows } =
    useFocussedRows()
  const [shouldRefocus, setShouldRefocus] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [gamesWon, setGamesWon] = useState<Obj2d>({})
  const { isGameWon, isGameLost } = useMemo(() => {
    return {
      isGameWon: gamesWon[numberOfWords]?.[numberOfLetters] ?? false,
      isGameLost: gamesWon[numberOfWords]?.[numberOfLetters] === false,
    }
  }, [gamesWon, numberOfWords, numberOfLetters])

  const maxChallenges = useMemo(
    () => calculateMaxChallenges(numberOfWords),
    [numberOfWords]
  )

  const solution = useMemo(
    () => getSolution(gameDate, numberOfWords, numberOfLetters).newSolution,
    [numberOfWords, numberOfLetters, gameDate]
  )
  const [guesses, setGuesses] = useState<Obj2d>(() => {
    return loadGuesses(gameDate, isLatestGame)
  })

  const [currentGuesses, setCurrentGuesses] = useState<Obj2d>({})
  const currentGuess = useMemo(
    () => currentGuesses[numberOfWords]?.[numberOfLetters] ?? '',
    [currentGuesses, numberOfWords, numberOfLetters]
  )
  const [stats, setStats] = useState(() => loadStats())

  const isHardMode = useMemo(
    () => isHardModePreferred && numberOfWords === 1,
    [isHardModePreferred, numberOfWords]
  )
  // TODO hard mode can be enabled after the start of the game if the user changes settings.

  useEffect(() => {
    // if no game state on load,
    // show the user the how-to info modal
    loadAllSettings()
    removeLegacyKeys()
    if (
      !loadGameStateFromLocalStorage(true) &&
      !loadGameStateFromLocalStorage(false)
    ) {
      setTimeout(() => {
        updateModals({ isHelpModalOpen: true })
      }, WELCOME_HELP_MODAL_MS)
    }
  }, [])

  useEffect(() => {
    // TODO shouldRefocus means there is a 1 tick delay on refocusing
    if (shouldRefocus) {
      setShouldRefocus(false)
      unfocusAllRows()
      const guessesCount = (guesses[numberOfWords]?.[numberOfLetters] ?? [])
        .length
      if (guessesCount < maxChallenges) {
        focusRow(guessesCount)
      }
    }
  }, [
    numberOfWords,
    numberOfLetters,
    guesses,
    focusRow,
    shouldRefocus,
    unfocusAllRows,
    maxChallenges,
  ])

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setShouldRefocus(true)
  }, [numberOfLetters, numberOfWords, gameDate])

  useEffect(() => {
    setGuesses(loadGuesses(gameDate, isLatestGame))
    setGamesWon({})
  }, [gameDate, isLatestGame])

  useEffect(() => {
    DISCOURAGE_INAPP_BROWSERS &&
      isInAppBrowser() &&
      showErrorAlert(DISCOURAGE_INAPP_BROWSER_TEXT, {
        persist: false,
        durationMs: 7000,
      })
  }, [showErrorAlert])

  const handleHardMode = (isHard: boolean) => {
    if (numberOfWords === 1) {
      if (
        (guesses[numberOfWords]?.[numberOfLetters] ?? []).length === 0 ||
        isHardModePreferred
      ) {
        updateClientSettings({ isHardModePreferred: isHard })
      } else {
        showErrorAlert(HARD_MODE_CHEATING_MESSAGE)
      }
    } else {
      showErrorAlert(HARD_MODE_RESTRICTION_MESSAGE)
    }
  }

  const clearCurrentRowClass = () => {
    setCurrentRowClass('')
  }

  useEffect(() => {
    saveGameStateToLocalStorage(isLatestGame, {
      guesses: guesses,
      gameDate: gameDate,
    })
  }, [guesses, gameDate, isLatestGame])

  const onChar = (value: string) => {
    setShouldRefocus(false)
    if (
      isAnyModalOpen ||
      isGameWon ||
      isGameLost ||
      (guesses[numberOfWords]?.[numberOfLetters] || []).length === maxChallenges
    )
      return
    focusRow((guesses[numberOfWords]?.[numberOfLetters] ?? []).length)
    if (
      unicodeLength(`${currentGuess}${value}`) <= numberOfLetters &&
      (guesses[numberOfWords]?.[numberOfLetters] ?? []).length <
        maxChallenges &&
      !isGameWon
    ) {
      setCurrentGuesses((prev) => {
        return updateObj2d(
          prev,
          numberOfWords,
          numberOfLetters,
          `${currentGuess}${value}`
        )
      })
    }
  }

  const onDelete = () => {
    if (isAnyModalOpen) return
    setCurrentGuesses(
      updateObj2d(
        currentGuesses,
        numberOfWords,
        numberOfLetters,
        new GraphemeSplitter()
          .splitGraphemes(currentGuess)
          .slice(0, -1)
          .join('')
      )
    )
  }

  const onEnter = () => {
    if (isGameWon || isGameLost || isAnyModalOpen) return

    if (!(unicodeLength(currentGuess) === numberOfLetters)) {
      setCurrentRowClass('animate-jiggle')
      return showErrorAlert(NOT_ENOUGH_LETTERS_MESSAGE, {
        onClose: clearCurrentRowClass,
        // TODO allow jiggle as frequently as you want
        // TODO pressing enter on a won game shows wrong popup after reloading
      })
    }

    if (!isWordInWordList(currentGuess)) {
      setCurrentRowClass('animate-jiggle')
      return showErrorAlert(WORD_NOT_FOUND_MESSAGE, {
        onClose: clearCurrentRowClass,
      })
    }

    // enforce hard mode - all guesses must contain all previously revealed letters
    if (isHardMode && numberOfWords === 1) {
      const firstMissingReveal = findFirstUnusedReveal(
        currentGuess,
        guesses[numberOfWords]?.[numberOfLetters] ?? [],
        solution[0]
      )
      if (firstMissingReveal) {
        setCurrentRowClass('animate-jiggle')
        return showErrorAlert(firstMissingReveal, {
          onClose: clearCurrentRowClass,
        })
      }
    }

    timerRef.current = setTimeout(() => {
      focusRow((guesses[numberOfWords]?.[numberOfLetters] ?? [1]).length)
      unfocusEarliestRow()
    }, REVEAL_TIME_MS * numberOfLetters)

    if (
      unicodeLength(currentGuess) === numberOfLetters &&
      (guesses[numberOfWords]?.[numberOfLetters] ?? []).length < maxChallenges
    ) {
      const newGuesses = updateObj2d(guesses, numberOfWords, numberOfLetters, [
        ...(guesses[numberOfWords]?.[numberOfLetters] ?? []),
        currentGuess,
      ])
      setGuesses(newGuesses)
      setCurrentGuesses(
        updateObj2d(currentGuesses, numberOfWords, numberOfLetters, '')
      )

      if (
        checkIsGameWon(newGuesses[numberOfWords]?.[numberOfLetters], solution)
      ) {
        // Win situation
        if (isLatestGame) {
          setStats((prevStats) =>
            addStatsForCompletedGame(
              prevStats,
              newGuesses[numberOfWords]?.[numberOfLetters].length,
              numberOfWords,
              numberOfLetters,
              true,
              countGridsWon(
                newGuesses[numberOfWords]?.[numberOfLetters],
                solution
              )
            )
          )
        }
        setGamesWon(updateObj2d(gamesWon, numberOfWords, numberOfLetters, true))
        const winMessage =
          WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)]
        const delayMs = REVEAL_TIME_MS * numberOfLetters

        showSuccessAlert(winMessage, {
          delayMs,
          onClose: () => updateModals({ isStatsModalOpen: true }),
        })
      } else if (
        newGuesses[numberOfWords]?.[numberOfLetters].length === maxChallenges
      ) {
        // Lose situation
        if (isLatestGame) {
          setStats((prevStats) =>
            addStatsForCompletedGame(
              prevStats,
              newGuesses[numberOfWords]?.[numberOfLetters].length + 1,
              numberOfWords,
              numberOfLetters,
              false,
              countGridsWon(
                newGuesses[numberOfWords]?.[numberOfLetters],
                solution
              )
            )
          )
        }
        setGamesWon(
          updateObj2d(gamesWon, numberOfWords, numberOfLetters, false)
        )

        const loseMessage =
          LOSE_MESSAGES[Math.floor(Math.random() * LOSE_MESSAGES.length)]
        const delayMs = REVEAL_TIME_MS * numberOfLetters * 2
        showErrorAlert(loseMessage, {
          delayMs,
          onClose: () => updateModals({ isStatsModalOpen: true }),
        })
      }
    }
  }

  return (
    <Div100vh className="bg-primary-1 transition-colors duration-500">
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
      <div className="3xl relative flex h-full flex-col bg-transparent">
        <Navbar />
        {!isLatestGame && (
          <div className="mb-1 flex items-center justify-center">
            <CalendarIcon className="h-6 w-6 stroke-secondary" />
            <p className="ml-1 text-base text-secondary">
              {format(gameDate, 'd MMMM yyyy', { locale: DATE_LOCALE })}
            </p>
          </div>
        )}
        <div className="mx-auto flex w-full grow flex-col pb-8 short:pb-2 short:pt-2">
          <div className="flex h-[1vh] grow flex-wrap items-start justify-center overflow-y-scroll">
            {solution.map((_, i: any) => (
              <Grid
                key={i}
                solution={solution[i]}
                guesses={guesses[numberOfWords]?.[numberOfLetters] ?? []}
                currentGuess={currentGuess}
                currentRowClassName={currentRowClass}
                maxChallenges={maxChallenges}
                isHardMode={isHardMode}
              />
            ))}
          </div>
          <div className="px-1 pt-5 sm:pt-2 short:pt-2">
            <Keyboard
              onChar={onChar}
              onDelete={onDelete}
              onEnter={onEnter}
              solution={solution}
              guesses={guesses[numberOfWords]?.[numberOfLetters] ?? []}
              isRevealing={
                !isRowFocussed(
                  (guesses[numberOfWords]?.[numberOfLetters] ?? []).length
                )
              }
            />
          </div>
          <HelpModal />
          <InfoModal />
          <StatsModal
            solution={solution}
            guesses={guesses[numberOfWords]?.[numberOfLetters] ?? []}
            gameStats={stats}
            isLatestGame={isLatestGame}
            isGameLost={isGameLost}
            isGameWon={isGameWon}
            handleShareToClipboard={() => showSuccessAlert(GAME_COPIED_MESSAGE)}
            handleShareFailure={() =>
              showErrorAlert(SHARE_FAILURE_TEXT, {
                durationMs: LONG_ALERT_TIME_MS,
              })
            }
            isHardMode={isHardMode}
            numberOfGuessesMade={
              (guesses[numberOfWords]?.[numberOfLetters] ?? []).length
            }
          />
          <DatePickerModal />
          <MigrateStatsModal />
          <SettingsModal
            isHardMode={isHardMode}
            handleHardMode={handleHardMode}
          />
          <AdvancedSettingsModal />
          <AlertContainer />
        </div>
      </div>
    </Div100vh>
  )
}

export default App
