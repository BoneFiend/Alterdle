import './App.css'

import { ClockIcon } from '@heroicons/react/outline'
import { format } from 'date-fns'
import { default as GraphemeSplitter } from 'grapheme-splitter'
import { useEffect, useMemo, useState } from 'react'
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
  CORRECT_WORD_MESSAGE,
  DISCOURAGE_INAPP_BROWSER_TEXT,
  GAME_COPIED_MESSAGE,
  HARD_MODE_ALERT_MESSAGE,
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
  Obj2d,
  findFirstUnusedReveal,
  getGameDate,
  getIsLatestGame,
  getSolution,
  isWordInWordList,
  setGameDate,
  unicodeLength,
  updateObj2d,
} from './lib/words'

function App() {
  const isLatestGame = getIsLatestGame()
  const gameDate = getGameDate()
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
  const [isRevealing, setIsRevealing] = useState(false)

  const [numberOfWords, setNumberOfWords] = useState(1)
  const [numberOfLetters, setNumberOfLetters] = useState(5)
  const [gamesWon, setGamesWon] = useState<Obj2d>({})
  const isGameWon = gamesWon[numberOfWords]?.[numberOfLetters] ?? false
  const isGameLost =
    gamesWon[numberOfWords]?.[numberOfLetters] === false ?? false

  const maxChallenges = numberOfWords + MAX_CHALLENGES_BONUS

  const solution = useMemo(
    () =>
      getSolution(getGameDate(), numberOfWords, numberOfLetters).newSolution,
    [numberOfWords, numberOfLetters]
  )
  const [guesses, setGuesses] = useState<Obj2d>(() => {
    const loaded = loadGameStateFromLocalStorage(isLatestGame)
    if (loaded?.gameDate.getTime() !== getGameDate().getTime()) {
      return {}
    }
    return loaded.guesses
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

  useEffect(() => {
    // if no game state on load,
    // show the user the how-to info modal
    if (!loadGameStateFromLocalStorage(true)) {
      setTimeout(() => {
        setIsHelpModalOpen(true)
      }, WELCOME_HELP_MODAL_MS)
    }
  })

  useEffect(() => {
    // Ensure only 2 challenges can played at once with 2 letters
    if (numberOfLetters === 1 && numberOfWords > 2) {
      setNumberOfWords(2)
    }
  }, [numberOfLetters, numberOfWords])

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

  const handleDarkMode = (isDark: boolean) => {
    setIsDarkMode(isDark)
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }

  const handleHardMode = (isHard: boolean) => {
    if (
      (guesses[numberOfWords]?.[numberOfLetters] ?? []).length === 0 ||
      localStorage.getItem('gameMode') === 'hard'
    ) {
      setIsHardModeRequested(isHard)
      localStorage.setItem('gameMode', isHard ? 'hard' : 'normal')
    } else {
      showErrorAlert(HARD_MODE_ALERT_MESSAGE)
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
    saveGameStateToLocalStorage(getIsLatestGame(), {
      guesses: guesses,
      gameDate: getGameDate(),
    })
  }, [guesses, solution])

  const checkIsGameWon = (guesses: any[], solution: any[]) => {
    return solution.every((word) => guesses.includes(word))
  }

  useEffect(() => {
    if (isGameWon) {
      const winMessage =
        WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)]
      const delayMs = REVEAL_TIME_MS * numberOfLetters

      showSuccessAlert(winMessage, {
        // TODO only open this once. also only display correct words once
        delayMs,
        onClose: () => setIsStatsModalOpen(true),
      })
    }

    if (isGameLost) {
      setTimeout(
        () => {
          setIsStatsModalOpen(true)
        },
        (numberOfLetters + 1) * REVEAL_TIME_MS
      )
    }
  }, [isGameWon, isGameLost, showSuccessAlert, numberOfLetters])

  const onChar = (value: string) => {
    if (
      unicodeLength(`${currentGuess}${value}`) <= numberOfLetters &&
      (guesses[numberOfWords]?.[numberOfLetters] ?? []).length <
        maxChallenges &&
      !isGameWon
    ) {
      setCurrentGuesses(
        updateObj2d(
          currentGuesses,
          numberOfWords,
          numberOfLetters,
          `${currentGuess}${value}`
        )
      )
    }
  }

  const onDelete = () => {
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
    if (isGameWon || isGameLost) {
      return
    }

    if (!(unicodeLength(currentGuess) === numberOfLetters)) {
      setCurrentRowClass('jiggle')
      return showErrorAlert(NOT_ENOUGH_LETTERS_MESSAGE, {
        onClose: clearCurrentRowClass,
      })
    }

    if (!isWordInWordList(currentGuess)) {
      setCurrentRowClass('jiggle')
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
        setCurrentRowClass('jiggle')
        return showErrorAlert(firstMissingReveal, {
          onClose: clearCurrentRowClass,
        })
      }
    }

    setIsRevealing(true)
    // turn this back off after all
    // chars have been revealed
    setTimeout(() => {
      setIsRevealing(false)
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
              true
            )
          )
        }
        setGamesWon(updateObj2d(gamesWon, numberOfWords, numberOfLetters, true))
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
              false
            )
          )
        }
        setGamesWon(
          updateObj2d(gamesWon, numberOfWords, numberOfLetters, false)
        )
        showErrorAlert(CORRECT_WORD_MESSAGE(solution), {
          // persist: true, // TODO rework to show the solutions permanently on each setting
          delayMs: REVEAL_TIME_MS * numberOfLetters + 1,
        })
      }
    }
  }

  return (
    <Div100vh>
      <div className="flex h-full flex-col">
        <Navbar
          setIsInfoModalOpen={setIsInfoModalOpen}
          setIsHelpModalOpen={setIsHelpModalOpen}
          setIsStatsModalOpen={setIsStatsModalOpen}
          setIsDatePickerModalOpen={setIsDatePickerModalOpen}
          setIsSettingsModalOpen={setIsSettingsModalOpen}
        />

        {!isLatestGame && (
          <div className="flex items-center justify-center">
            <ClockIcon className="h-6 w-6 stroke-gray-600 dark:stroke-gray-300" />
            <p className="text-base text-gray-600 dark:text-gray-300">
              {format(gameDate, 'd MMMM yyyy', { locale: DATE_LOCALE })}
            </p>
          </div>
        )}

        <div className="mx-auto flex w-full grow flex-col pb-8 short:pb-2 short:pt-2">
          <div className="no-scrollbar flex h-[1vh] grow flex-wrap items-center justify-center overflow-y-auto">
            {solution.map((sol: any, i: any) => (
              <Grid
                key={i}
                solution={solution[i]}
                guesses={guesses[numberOfWords]?.[numberOfLetters] ?? []}
                currentGuess={currentGuess}
                isRevealing={isRevealing}
                currentRowClassName={currentRowClass}
                maxChallenges={maxChallenges}
              />
            ))}
          </div>
          <div className="px-1 pt-5">
            <Keyboard
              // TODO remake keyboard logic
              onChar={onChar}
              onDelete={onDelete}
              onEnter={onEnter}
              solution={solution[0]}
              guesses={guesses[numberOfWords]?.[numberOfLetters] ?? []}
              isRevealing={isRevealing}
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
          />
          <DatePickerModal
            isOpen={isDatePickerModalOpen}
            initialDate={getGameDate()}
            handleSelectDate={(d) => {
              setIsDatePickerModalOpen(false)
              setGameDate(d)
            }}
            handleClose={() => setIsDatePickerModalOpen(false)}
          />
          <MigrateStatsModal
            isOpen={isMigrateStatsModalOpen}
            handleClose={() => setIsMigrateStatsModalOpen(false)}
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
          />
          <AlertContainer />
        </div>
      </div>
    </Div100vh>
  )
}

export default App
