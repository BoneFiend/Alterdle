import { CalendarIcon } from '@heroicons/react/outline'
import { format } from 'date-fns'
import { default as GraphemeSplitter } from 'grapheme-splitter'
import { useEffect, useMemo, useRef, useState } from 'react'
import Div100vh from 'react-div-100vh'

import { AlertContainer } from './components/alerts/AlertContainer'
import { Grid } from './components/grid/Grid'
import { Keyboard } from './components/keyboard/Keyboard'
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
  MAX_CHALLENGES_BONUS,
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
import { useAlert } from './context/AlertContext'
import { isInAppBrowser } from './lib/browser'
import {
  getStoredIsHighContrastMode,
  loadGameStateFromLocalStorage,
  saveGameStateToLocalStorage,
  setStoredIsHighContrastMode,
} from './lib/localStorage'
import { addStatsForCompletedGame, loadStats } from './lib/stats'
import {
  loadGameDate,
  loadNumberOfLetters,
  loadNumberOfWords,
  setUrl,
  setWindowTitle,
} from './lib/urlutils'
import {
  Obj2d,
  checkIsGameWon,
  countGridsWon,
  findFirstUnusedReveal,
  getIsLatestGame,
  getSolution,
  isWordInWordList,
  loadGuesses,
  unicodeLength,
  updateObj2d,
} from './lib/words'
import useFocussedRows from './stores/useFocussedRows'

function App() {
  const [gameDate, setGameDate] = useState<Date>(() => {
    return loadGameDate()
  })
  const isLatestGame = useMemo(() => getIsLatestGame(gameDate), [gameDate])
  const prefersDarkMode = window.matchMedia(
    '(prefers-color-scheme: dark)'
  ).matches

  const { showError: showErrorAlert, showSuccess: showSuccessAlert } =
    useAlert()
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false)
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false)
  const [isDatePickerModalOpen, setIsDatePickerModalOpen] = useState(false)
  const [isMigrateStatsModalOpen, setIsMigrateStatsModalOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)

  const isAnyModalOpen = useMemo(
    () =>
      isHelpModalOpen ||
      isStatsModalOpen ||
      isSettingsModalOpen ||
      isMigrateStatsModalOpen ||
      isInfoModalOpen ||
      isDatePickerModalOpen,
    [
      isHelpModalOpen,
      isStatsModalOpen,
      isSettingsModalOpen,
      isMigrateStatsModalOpen,
      isInfoModalOpen,
      isDatePickerModalOpen,
    ]
  )

  const [currentRowClass, setCurrentRowClass] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('theme')
      ? localStorage.getItem('theme') === 'dark'
      : prefersDarkMode
        ? true
        : false
  )
  const [isHighContrastMode, setIsHighContrastMode] = useState(
    getStoredIsHighContrastMode()
  )

  const [longShare, setLongShare] = useState(
    localStorage.getItem('longShare') === 'true'
  )

  const { isRowFocussed, focusRow, unfocusEarliestRow, unfocusAllRows } =
    useFocussedRows()
  const [shouldRefocus, setShouldRefocus] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [numberOfWords, setNumberOfWords] = useState(() => {
    return loadNumberOfWords()
  })
  const [numberOfLetters, setNumberOfLetters] = useState(() => {
    return loadNumberOfLetters()
  })

  const [gamesWon, setGamesWon] = useState<Obj2d>({})
  const isGameWon = gamesWon[numberOfWords]?.[numberOfLetters] ?? false
  const isGameLost = gamesWon[numberOfWords]?.[numberOfLetters] === false

  const maxChallenges = numberOfWords + MAX_CHALLENGES_BONUS

  const solution = useMemo(
    () => getSolution(gameDate, numberOfWords, numberOfLetters).newSolution,
    [numberOfWords, numberOfLetters, gameDate]
  )
  const [guesses, setGuesses] = useState<Obj2d>(() => {
    return loadGuesses(gameDate, isLatestGame)
  })

  const [currentGuesses, setCurrentGuesses] = useState<Obj2d>({})
  const currentGuess = currentGuesses[numberOfWords]?.[numberOfLetters] ?? ''

  const [stats, setStats] = useState(() => loadStats())

  const [isHardModeRequested, setIsHardModeRequested] = useState(
    localStorage.getItem('gameMode')
      ? localStorage.getItem('gameMode') === 'hard'
      : false
  )
  const isHardMode = isHardModeRequested && numberOfWords === 1
  // TODO hard mode can be enabled after the start of the game if the user changes settings.
  // TODO dont show invalid words in hard mode
  // TODO disable hard mode toggle (make it look disabled)
  // TODO move lots of functions here to game component

  useEffect(() => {
    // if no game state on load,
    // show the user the how-to info modal
    if (
      !loadGameStateFromLocalStorage(true) &&
      !loadGameStateFromLocalStorage(false)
    ) {
      setTimeout(() => {
        setIsHelpModalOpen(true)
      }, WELCOME_HELP_MODAL_MS)
    }
  }, [])

  useEffect(() => {
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
    // Ensures only 2 challenges can played at once with 2 letters
    if (numberOfLetters === 1 && numberOfWords > 2) {
      setNumberOfWords(2)
    }

    const timeoutId = setTimeout(() => {
      setUrl(numberOfWords, numberOfLetters, gameDate)
      setWindowTitle(numberOfWords, numberOfLetters)
    }, 1000)

    if (timerRef.current) clearTimeout(timerRef.current)
    setShouldRefocus(true)

    return () => clearTimeout(timeoutId)
  }, [numberOfLetters, numberOfWords, gameDate, ,])

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

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    if (isHighContrastMode) {
      document.documentElement.classList.add('high-contrast')
    } else {
      document.documentElement.classList.remove('high-contrast')
    }
  }, [isDarkMode, isHighContrastMode])

  const handleLongShare = (isLongShare: boolean) => {
    setLongShare(isLongShare)
    localStorage.setItem('longShare', isLongShare.toString())
  }

  const handleDarkMode = (isDark: boolean) => {
    setIsDarkMode(isDark)
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }

  const handleHardMode = (isHard: boolean) => {
    if (numberOfWords === 1) {
      if (
        (guesses[numberOfWords]?.[numberOfLetters] ?? []).length === 0 ||
        localStorage.getItem('gameMode') === 'hard'
      ) {
        setIsHardModeRequested(isHard)
        localStorage.setItem('gameMode', isHard ? 'hard' : 'normal')
      } else {
        showErrorAlert(HARD_MODE_CHEATING_MESSAGE)
      }
    } else {
      showErrorAlert(HARD_MODE_RESTRICTION_MESSAGE)
    }
  }

  const handleHighContrastMode = (isHighContrast: boolean) => {
    setIsHighContrastMode(isHighContrast)
    setStoredIsHighContrastMode(isHighContrast)
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
          onClose: () => setIsStatsModalOpen(true),
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
          onClose: () => setIsStatsModalOpen(true),
        })
      }
    }
  }

  return (
    <Div100vh>
      <div className="fixed h-full w-full bg-gradient-to-b from-primary-1-light-mode to-primary-2-light-mode" />
      <div className="fixed h-full w-full bg-gradient-to-b from-primary-1-dark-mode to-primary-2-dark-mode opacity-0 transition-opacity duration-500 dark:opacity-100" />
      <div className="3xl relative flex h-full flex-col bg-transparent">
        <Navbar
          setIsInfoModalOpen={setIsInfoModalOpen}
          setIsHelpModalOpen={setIsHelpModalOpen}
          setIsStatsModalOpen={setIsStatsModalOpen}
          setIsSettingsModalOpen={setIsSettingsModalOpen}
          numberOfLetters={numberOfLetters}
          numberOfWords={numberOfWords}
        />

        {!isLatestGame && (
          <div className="mb-1 flex items-center justify-center">
            <CalendarIcon className="h-6 w-6 stroke-gray-600 dark:stroke-gray-300" />
            <p className="ml-1 text-base text-gray-600 dark:text-gray-300">
              {format(gameDate, 'd MMMM yyyy', { locale: DATE_LOCALE })}
            </p>
          </div>
        )}

        <div className="mx-auto flex w-full grow flex-col pb-8 short:pb-2 short:pt-2">
          <div className="flex h-[1vh] grow flex-wrap items-start justify-center overflow-y-scroll">
            {solution.map((sol: any, i: any) => (
              <Grid
                key={i}
                solution={solution[i]}
                guesses={guesses[numberOfWords]?.[numberOfLetters] ?? []}
                currentGuess={currentGuess}
                currentRowClassName={currentRowClass}
                maxChallenges={maxChallenges}
                numberOfLetters={numberOfLetters}
                numberOfWords={numberOfWords}
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
              numberOfLetters={numberOfLetters}
            />
          </div>
          <HelpModal
            isOpen={isHelpModalOpen}
            handleClose={() => setIsHelpModalOpen(false)}
            numberOfWords={numberOfWords}
            handleNumberOfWords={setNumberOfWords}
            numberOfLetters={numberOfLetters}
            handleNumberOfLetters={setNumberOfLetters}
          />
          <InfoModal
            isOpen={isInfoModalOpen}
            handleClose={() => setIsInfoModalOpen(false)}
          />
          <StatsModal
            isOpen={isStatsModalOpen}
            handleClose={() => setIsStatsModalOpen(false)}
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
            handleMigrateStatsButton={() => {
              setIsStatsModalOpen(false)
              setIsMigrateStatsModalOpen(true)
            }}
            isHardMode={isHardMode}
            isDarkMode={isDarkMode}
            isHighContrastMode={isHighContrastMode}
            numberOfGuessesMade={
              (guesses[numberOfWords]?.[numberOfLetters] ?? []).length
            }
            numberOfWords={numberOfWords}
            handleNumberOfWords={setNumberOfWords}
            numberOfLetters={numberOfLetters}
            handleNumberOfLetters={setNumberOfLetters}
            maxChallenges={maxChallenges}
            gameDate={gameDate}
            longShare={longShare}
          />
          <DatePickerModal
            isOpen={isDatePickerModalOpen}
            initialDate={gameDate}
            handleSelectDate={(d) => {
              setIsDatePickerModalOpen(false)
              setGameDate(d)
              setUrl(numberOfWords, numberOfLetters, d)
              setIsSettingsModalOpen(false)
            }}
            handleClose={() => {
              setIsSettingsModalOpen(true)
              setIsDatePickerModalOpen(false)
            }}
          />
          <MigrateStatsModal
            isOpen={isMigrateStatsModalOpen}
            handleClose={() => {
              setIsSettingsModalOpen(true)
              setIsMigrateStatsModalOpen(false)
            }}
          />
          <SettingsModal
            isOpen={isSettingsModalOpen}
            handleClose={() => setIsSettingsModalOpen(false)}
            isHardMode={isHardMode}
            handleHardMode={handleHardMode}
            isDarkMode={isDarkMode}
            handleDarkMode={handleDarkMode}
            isHighContrastMode={isHighContrastMode}
            handleHighContrastMode={handleHighContrastMode}
            numberOfWords={numberOfWords}
            handleNumberOfWords={setNumberOfWords}
            numberOfLetters={numberOfLetters}
            handleNumberOfLetters={setNumberOfLetters}
            handleChooseDateButton={() => {
              setIsDatePickerModalOpen(true)
              setIsSettingsModalOpen(false)
            }}
            handleMigrateStatsButton={() => {
              setIsSettingsModalOpen(false)
              setIsMigrateStatsModalOpen(true)
            }}
            longShare={longShare}
            handleLongShare={handleLongShare}
          />
          <AlertContainer />
        </div>
      </div>
    </Div100vh>
  )
}

export default App
