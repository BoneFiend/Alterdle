import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { default as GraphemeSplitter } from 'grapheme-splitter'
import Div100vh from 'react-div-100vh'

import { AlertContainer } from '@ui/alerts/AlertContainer'
import { Grid } from '@ui/grid/Grid'
import { Keyboard } from '@ui/keyboard/Keyboard'
import { Navbar } from '@ui/navbar/Navbar'

import { AdvancedSettingsModal } from '@modals/AdvancedSettingsModal'
import { DatePickerModal } from '@modals/DatePickerModal'
import { HelpModal } from '@modals/HelpModal'
import { InfoModal } from '@modals/InfoModal'
import { MigrateStatsModal } from '@modals/MigrateStatsModal'
import { SettingsModal } from '@modals/SettingsModal'
import { StatsModal } from '@modals/StatsModal'

import { useAlert } from '@context/AlertContext'

import {
  DISCOURAGE_INAPP_BROWSERS,
  LONG_ALERT_TIME_MS,
  REVEAL_TIME_MS,
  WELCOME_HELP_MODAL_MS,
} from '@constants/settings'
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
} from '@constants/strings'
import { type Obj2d, updateObj2d } from '@constants/types'

import useClientSettings, {
  loadClientSettings,
  updateClientSettings,
} from '@stores/useClientSettings'
import useFocussedRows, {
  focusRow,
  unfocusAllRows,
  unfocusEarliestRow,
} from '@stores/useFocussedRows'
import useModalStore, { updateModals } from '@stores/useModalStore'

import { useGameSettings } from '@hooks/useGameSettings'

import { isInAppBrowser } from '@lib/browser'
import {
  loadGameStateFromLocalStorage,
  saveGameStateToLocalStorage,
} from '@lib/localStorage'
import { addStatsForCompletedGame, loadStats } from '@lib/stats'
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
} from '@lib/words'

function App() {
  const { numberOfWords, numberOfLetters, gameDate } = useGameSettings()

  const isLatestGame = useMemo(() => getIsLatestGame(gameDate), [gameDate])

  const { showError: showErrorAlert, showSuccess: showSuccessAlert } =
    useAlert()

  const isAnyModalOpen = useModalStore((s) => s.isAnyModalOpen)

  const [currentRowClass, setCurrentRowClass] = useState('')

  const isHardModePreferred = useClientSettings((s) => s.isHardModePreferred)

  const { isRowFocussed } = useFocussedRows()

  const [shouldRefocus, setShouldRefocus] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [gamesWon, setGamesWon] = useState<Obj2d<boolean>>({})
  const { isGameWon, isGameLost } = useMemo(() => {
    return {
      isGameWon: gamesWon[numberOfWords]?.[numberOfLetters] ?? false,
      isGameLost: gamesWon[numberOfWords]?.[numberOfLetters] === false,
    }
  }, [gamesWon, numberOfWords, numberOfLetters])

  const maxChallenges = useMemo(
    () => calculateMaxChallenges(numberOfWords),
    [numberOfWords],
  )

  const solution = useMemo(
    () => getSolution(gameDate, numberOfWords, numberOfLetters).newSolution,
    [numberOfWords, numberOfLetters, gameDate],
  )
  const [guesses, setGuesses] = useState<Obj2d<string[]>>(() => {
    return loadGuesses(gameDate, isLatestGame)
  })

  const [currentGuesses, setCurrentGuesses] = useState<Obj2d<string>>({})
  const currentGuess = useMemo(
    () => currentGuesses[numberOfWords]?.[numberOfLetters] ?? '',
    [currentGuesses, numberOfWords, numberOfLetters],
  )
  const [stats, setStats] = useState(() => loadStats())

  const isHardMode = useMemo(
    () => isHardModePreferred && numberOfWords === 1,
    [isHardModePreferred, numberOfWords],
  )
  // TODO hard mode can be enabled after the start of the game if the user changes settings.

  useEffect(() => {
    // if no game state on load,
    // show the user the how-to info modal
    loadClientSettings()
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
  }, [numberOfWords, numberOfLetters, guesses, shouldRefocus, maxChallenges])

  // biome-ignore lint/correctness/useExhaustiveDependencies: refocus on game settings change
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

  const handleHardMode = useCallback(
    (isHard: boolean) => {
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
    },
    [
      numberOfLetters,
      numberOfWords,
      guesses,
      isHardModePreferred,
      showErrorAlert,
    ],
  )

  const clearCurrentRowClass = useCallback(() => {
    setCurrentRowClass('')
  }, [])

  useEffect(() => {
    saveGameStateToLocalStorage(isLatestGame, {
      guesses: guesses,
      gameDate: gameDate,
    })
  }, [guesses, gameDate, isLatestGame])

  const onChar = useCallback(
    (value: string) => {
      setShouldRefocus(false)
      if (
        isAnyModalOpen ||
        isGameWon ||
        isGameLost ||
        (guesses[numberOfWords]?.[numberOfLetters] || []).length ===
          maxChallenges
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
            `${currentGuess}${value}`,
          )
        })
      }
    },
    [
      isAnyModalOpen,
      isGameWon,
      isGameLost,
      guesses,
      numberOfWords,
      numberOfLetters,
      currentGuess,
      maxChallenges,
    ],
  )

  const onDelete = useCallback(() => {
    if (isAnyModalOpen) return
    setCurrentGuesses(
      updateObj2d(
        currentGuesses,
        numberOfWords,
        numberOfLetters,
        new GraphemeSplitter()
          .splitGraphemes(currentGuess)
          .slice(0, -1)
          .join(''),
      ),
    )
  }, [
    isAnyModalOpen,
    currentGuesses,
    numberOfWords,
    numberOfLetters,
    currentGuess,
  ])

  const onEnter = useCallback(() => {
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
        solution[0],
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
        updateObj2d(currentGuesses, numberOfWords, numberOfLetters, ''),
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
                solution,
              ),
            ),
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
                solution,
              ),
            ),
          )
        }
        setGamesWon(
          updateObj2d(gamesWon, numberOfWords, numberOfLetters, false),
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
  }, [
    clearCurrentRowClass,
    numberOfLetters,
    numberOfWords,
    guesses,
    isGameLost,
    isGameWon,
    isHardMode,
    isLatestGame,
    maxChallenges,
    isAnyModalOpen,
    showSuccessAlert,
    solution,
    currentGuess,
    currentGuesses,
    showErrorAlert,
    gamesWon,
  ])

  return (
    <Div100vh>
      <div className="relative flex h-full flex-col bg-transparent">
        <Navbar />
        <div className="mx-auto flex w-full grow flex-col pb-8">
          <div className="flex h-[1vh] grow flex-wrap items-start justify-center overflow-y-scroll">
            {solution.map((sol) => (
              <Grid
                key={sol}
                solution={sol}
                guesses={guesses[numberOfWords]?.[numberOfLetters] ?? []}
                currentGuess={currentGuess}
                currentRowClassName={currentRowClass}
                maxChallenges={maxChallenges}
                isHardMode={isHardMode}
              />
            ))}
          </div>
          <div className="px-1 pt-3 sm:pt-2 short:pt-2">
            <Keyboard
              onChar={onChar}
              onDelete={onDelete}
              onEnter={onEnter}
              solution={solution}
              guesses={guesses[numberOfWords]?.[numberOfLetters] ?? []}
              isRevealing={
                !isRowFocussed(
                  (guesses[numberOfWords]?.[numberOfLetters] ?? []).length,
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
