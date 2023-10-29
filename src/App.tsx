import './App.css'

import { ClockIcon } from '@heroicons/react/outline'
import { format } from 'date-fns'
import { default as GraphemeSplitter } from 'grapheme-splitter'
import { useEffect, useState } from 'react'
import Div100vh from 'react-div-100vh'

import { AlertContainer } from './components/alerts/AlertContainer'
import { Grid } from './components/grid/Grid'
import { Keyboard } from './components/keyboard/Keyboard'
import { DatePickerModal } from './components/modals/DatePickerModal'
import { InfoModal } from './components/modals/InfoModal'
import { MigrateStatsModal } from './components/modals/MigrateStatsModal'
import { SettingsModal } from './components/modals/SettingsModal'
import { StatsModal } from './components/modals/StatsModal'
import { Navbar } from './components/navbar/Navbar'
import {
  DATE_LOCALE,
  DISCOURAGE_INAPP_BROWSERS,
  LONG_ALERT_TIME_MS,
  MAX_NUMBER_OF_LETTERS,
  MAX_NUMBER_OF_WORDS,
  REVEAL_TIME_MS,
  WELCOME_INFO_MODAL_MS,
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
  findFirstUnusedReveal,
  getGameDate,
  getIsLatestGame,
  getSolution,
  isWordInWordList,
  setGameDate,
  unicodeLength,
} from './lib/words'

function App() {
  const isLatestGame = getIsLatestGame()
  const gameDate = getGameDate()
  const prefersDarkMode = window.matchMedia(
    '(prefers-color-scheme: dark)'
  ).matches

  const { showError: showErrorAlert, showSuccess: showSuccessAlert } =
    useAlert()
  const [currentGuess, setCurrentGuess] = useState('')
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
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
  const [wonGrids, setWonGrids] = useState<any[][]>(
    Array(MAX_NUMBER_OF_WORDS)
      .fill(0)
      .map((row, index) => new Array(MAX_NUMBER_OF_LETTERS).fill([]))
  )
  const [gamesWon, setGamesWon] = useState<any[][]>(
    Array(MAX_NUMBER_OF_WORDS)
      .fill(0)
      .map((row, index) => new Array(MAX_NUMBER_OF_LETTERS).fill(false))
  )
  const [gamesLost, setGamesLost] = useState<any[][]>(
    Array(MAX_NUMBER_OF_WORDS)
      .fill(0)
      .map((row, index) => new Array(MAX_NUMBER_OF_LETTERS).fill(false))
  )

  const isGameWon = gamesWon[numberOfWords - 1][numberOfLetters - 1]
  const isGameLost = gamesLost[numberOfWords - 1][numberOfLetters - 1]

  const maxChallenges = numberOfWords + 5

  const { newSolution, solutionGameDate } = getSolution(
    getGameDate(),
    numberOfWords,
    numberOfLetters
  )
  const solution = newSolution

  const [guesses, setGuesses] = useState<any[][]>(
    Array(MAX_NUMBER_OF_WORDS)
      .fill(0)
      .map((row, index) => new Array(MAX_NUMBER_OF_LETTERS).fill([]))
  )

  //   const loaded = loadGameStateFromLocalStorage(isLatestGame)
  //   // console.log('loaded: ')
  //   // console.log(loaded)
  //   if (!loaded?.solution || loaded?.solution !== solution) {
  //     // TODO and below, this currently just ignores all loaded guesses
  //     return Array(MAX_NUMBER_OF_WORDS)
  //       .fill(0)
  //       .map(() =>
  //         Array(MAX_NUMBER_OF_LETTERS)
  //           .fill(0)
  //           .map(() => [])
  //       )
  //   }
  //   const gameWasWon = solution.every((word) =>
  //     loaded.guesses[numberOfWords - 1][numberOfLetters - 1].includes(word)
  //   )
  //   if (gameWasWon) {
  //     // setIsGameWon(true)
  //   }
  //   if (
  //     loaded.guesses[numberOfWords - 1][numberOfLetters - 1].length ===
  //       maxChallenges &&
  //     !gameWasWon
  //   ) {
  //     // setIsGameLost(true)
  //     showErrorAlert(CORRECT_WORD_MESSAGE(solution), {
  //       persist: true,
  //     })
  //   }
  //   setGuesses(loaded.guesses)
  // })

  const [stats, setStats] = useState(() => loadStats())

  const [isHardMode, setIsHardMode] = useState(
    localStorage.getItem('gameMode')
      ? localStorage.getItem('gameMode') === 'hard'
      : false
  )

  useEffect(() => {
    // if no game state on load,
    // show the user the how-to info modal
    if (!loadGameStateFromLocalStorage(true)) {
      setTimeout(() => {
        setIsInfoModalOpen(true)
      }, WELCOME_INFO_MODAL_MS)
    }
  })

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
      guesses[numberOfWords - 1][numberOfLetters - 1].length === 0 ||
      localStorage.getItem('gameMode') === 'hard'
    ) {
      setIsHardMode(isHard)
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
    saveGameStateToLocalStorage(getIsLatestGame(), { guesses, solution })

    if (
      guesses[numberOfWords - 1][numberOfLetters - 1].length ===
        maxChallenges &&
      !isGameWon &&
      !isGameLost
    ) {
      if (isLatestGame) {
        setStats((prevStats) =>
          addStatsForCompletedGame(
            prevStats,
            guesses[numberOfWords - 1][numberOfLetters - 1].length + 1
          )
        )
      }
      const newGamesLost = [...gamesLost]
      newGamesLost[numberOfWords - 1][numberOfLetters - 1] = true
      setGamesLost(newGamesLost)
      showErrorAlert(CORRECT_WORD_MESSAGE(solution), {
        // persist: true, // TODO rework to show the solutions permanently on each setting
        delayMs: REVEAL_TIME_MS * numberOfLetters + 1,
      })
    }
  }, [
    guesses,
    isLatestGame,
    maxChallenges,
    numberOfLetters,
    numberOfWords,
    showErrorAlert,
    solution,
    gamesLost,
    isGameWon,
    isGameLost,
  ])

  useEffect(() => {
    if (
      wonGrids[numberOfWords - 1][numberOfLetters - 1].length ===
        numberOfWords &&
      !isGameWon &&
      !isGameLost
    ) {
      if (isLatestGame) {
        // TODO redo stats
        setStats((prevStats) =>
          addStatsForCompletedGame(
            prevStats,
            guesses[numberOfWords - 1][numberOfLetters - 1].length
          )
        )
      }
      const newGamesWon = [...gamesWon]
      newGamesWon[numberOfWords - 1][numberOfLetters - 1] = true
      setGamesWon(newGamesWon)
    }
  }, [
    wonGrids,
    numberOfLetters,
    numberOfWords,
    guesses,
    isLatestGame,
    gamesWon,
    isGameWon,
    isGameLost,
  ])

  const handleGridWin = (gridId: number) => {
    if (!wonGrids[numberOfWords - 1][numberOfLetters - 1].includes(gridId)) {
      const newWonGrids = wonGrids.map((row) => row.map((cell) => [...cell]))
      newWonGrids[numberOfWords - 1][numberOfLetters - 1] = [
        ...newWonGrids[numberOfWords - 1][numberOfLetters - 1],
        gridId,
      ]
      setWonGrids(newWonGrids)
    }
  }

  useEffect(() => {
    if (isGameWon) {
      const winMessage =
        WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)]
      const delayMs = REVEAL_TIME_MS * numberOfLetters

      showSuccessAlert(winMessage, {
        delayMs,
        onClose: () => setIsStatsModalOpen(true),
      })
    }

    if (isGameLost) {
      setTimeout(() => {
        setIsStatsModalOpen(true)
      }, (numberOfLetters + 1) * REVEAL_TIME_MS)
    }
  }, [isGameWon, isGameLost, showSuccessAlert, numberOfLetters])

  const onChar = (value: string) => {
    if (
      unicodeLength(`${currentGuess}${value}`) <= numberOfLetters &&
      guesses[numberOfWords - 1][numberOfLetters - 1].length < maxChallenges &&
      !isGameWon
    ) {
      setCurrentGuess(`${currentGuess}${value}`)
    }
  }

  const onDelete = () => {
    setCurrentGuess(
      new GraphemeSplitter().splitGraphemes(currentGuess).slice(0, -1).join('')
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
    if (isHardMode) {
      const firstMissingReveal = findFirstUnusedReveal(
        currentGuess,
        guesses[numberOfWords - 1][numberOfLetters - 1]
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
      guesses[numberOfWords - 1][numberOfLetters - 1].length < maxChallenges &&
      !isGameWon
    ) {
      const newGuesses = guesses.map((row) => row.map((cell) => [...cell]))
      newGuesses[numberOfWords - 1][numberOfLetters - 1] = [
        ...newGuesses[numberOfWords - 1][numberOfLetters - 1],
        currentGuess,
      ]
      setGuesses(newGuesses)
      setCurrentGuess('')
    }
  }

  return (
    <Div100vh>
      <div className="flex h-full flex-col">
        <Navbar
          setIsInfoModalOpen={setIsInfoModalOpen}
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

        <div className="mx-auto flex w-full grow flex-col px-1 pt-2 pb-8 sm:px-6 md:max-w-7xl lg:px-8 short:pb-2 short:pt-2">
          <div className="flex grow flex-col justify-center pb-6 short:pb-2">
            {solution.map((sol, i) => (
              <Grid
                key={i}
                solution={solution[i]}
                guesses={guesses[numberOfWords - 1][numberOfLetters - 1]}
                currentGuess={currentGuess}
                isRevealing={isRevealing}
                currentRowClassName={currentRowClass}
                onWin={() => handleGridWin(i)}
                maxChallenges={maxChallenges}
              />
            ))}
          </div>
          <Keyboard // TODO remake keyboard logic
            onChar={onChar}
            onDelete={onDelete}
            onEnter={onEnter}
            solution={solution[0]}
            guesses={guesses[numberOfWords - 1][numberOfLetters - 1]}
            isRevealing={isRevealing}
          />
          <InfoModal
            isOpen={isInfoModalOpen}
            handleClose={() => setIsInfoModalOpen(false)}
          />
          <StatsModal
            isOpen={isStatsModalOpen}
            handleClose={() => setIsStatsModalOpen(false)}
            solution={solution[0]} // TODO overhaul stats
            guesses={guesses[numberOfWords - 1][numberOfLetters - 1]}
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
              guesses[numberOfWords - 1][numberOfLetters - 1].length
            }
            numberOfWords={numberOfWords}
            handleNumberOfWords={setNumberOfWords}
            numberOfLetters={numberOfLetters}
            handleNumberOfLetters={setNumberOfLetters}
          />
          <DatePickerModal
            isOpen={isDatePickerModalOpen}
            initialDate={solutionGameDate}
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
