export const GAME_TITLE = process.env.REACT_APP_GAME_NAME!

export const WIN_MESSAGES = [
  'Great Job!',
  'Awesome',
  'Well done!',
  'Poggers',
  'Proud of you',
  'Excellent',
  'Sweet!',
  'Brilliant',
]
export const GAME_COPIED_MESSAGE = 'Game copied to clipboard'
export const NOT_ENOUGH_LETTERS_MESSAGE = 'Not enough letters'
export const WORD_NOT_FOUND_MESSAGE = 'Word not found'
export const HARD_MODE_CHEATING_MESSAGE =
  'Hard Mode can be enabled only at the start'
export const HARD_MODE_RESTRICTION_MESSAGE =
  'Hard mode can be enabled only in single challenge games'
export const HARD_MODE_DESCRIPTION =
  'Any revealed hints must be used in subsequent guesses'
export const HIGH_CONTRAST_MODE_DESCRIPTION = 'For improved color vision'
export const CHALLENGES_DESCRIPTION = 'Number of words to guess at once'
export const LENGTH_DESCRIPTION = 'Length of each word'
export const CORRECT_WORD_MESSAGE = (solution: string[]) => {
  const sol = [...solution]
  const last = sol.pop()
  return `The word${solution.length > 1 ? 's were' : ' was'} ${sol.join(
    ', '
  )} ${solution.length > 1 ? 'and' : ''}  ${last}`
}
export const WRONG_SPOT_MESSAGE = (guess: string, position: number) =>
  `Must use ${guess} in position ${position}`
export const NOT_CONTAINED_MESSAGE = (letter: string) =>
  `Guess must contain ${letter}`
export const ENTER_TEXT = 'Enter'
export const DELETE_TEXT = 'Delete'
export const STATISTICS_TITLE = 'Statistics'
export const GUESS_DISTRIBUTION_TEXT = 'Guess Distribution'
export const NEW_WORD_TEXT = (solution: string[]) =>
  `New word${solution.length > 1 ? 's' : ''} in`
export const SHARE_TEXT = 'Share'
export const SHARE_FAILURE_TEXT =
  'Unable to share the results. This feature is available only in secure contexts (HTTPS), in some or all supporting browsers.'
export const MIGRATE_BUTTON_TEXT = 'Transfer'
export const MIGRATE_DESCRIPTION_TEXT =
  'Click here to transfer your statistics to a new device.'
export const TOTAL_TRIES_TEXT = 'Total tries'
export const SUCCESS_RATE_TEXT = 'Success rate'
export const CURRENT_STREAK_TEXT = 'Current streak'
export const BEST_STREAK_TEXT = 'Best streak'
export const DISCOURAGE_INAPP_BROWSER_TEXT =
  "You are using an embedded browser and may experience problems sharing or saving your results. We encourage you rather to use your device's default browser."

export const DATEPICKER_TITLE = 'Play a Previous Alterdle'
export const DATEPICKER_CHOOSE_TEXT = 'Play'
export const DATEPICKER_TODAY_TEXT = "today's Alterdle"
export const ARCHIVE_GAMEDATE_TEXT = 'Game date'
export const DATEPICKER_DESCRIPTION =
  'Play an Alterdle game from a past date at any setting'
export const DATEPICKER_BUTTON = 'Choose Date'
