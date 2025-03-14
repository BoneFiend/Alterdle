export const GAME_TITLE = 'Alterdle'

export const WIN_MESSAGES = [
  'Great Job!',
  'Awesome',
  'Well done!',
  'Poggers',
  'Proud of you',
  'Excellent',
  'Sweet!',
  'Brilliant',
  'Sweet as',
  'cool beans',
  'Awesome sauce',
  'Fantastic work!',
  'Sublime',
  'Outstanding performance',
  'Superb',
]
export const LOSE_MESSAGES = [
  "We'll get 'em next time",
  'Bad luck!',
  'Next time for sure',
  'Good try!',
  'That was a hard one',
  'I know you have what it takes',
  "You miss every shot you don't take",
  'Chin up',
  'In the ashes of defeat, a phoenix of triumph is born',
  "Don't give up. I know you can do it!",
  'Good effort but not quite enough',
  'The maze of failure is merely a detour to the road of success',
  'The silent river runs deep, carrying the whispers of ancient resolve',
  'It is what it is',
]
export const GAME_COPIED_MESSAGE = 'Copied to clipboard'
export const NOT_ENOUGH_LETTERS_MESSAGE = 'Not enough letters'
export const WORD_NOT_FOUND_MESSAGE = 'Word not found'
export const LONG_SHARE_DESCRIPTION =
  'Share text will contain details of every guess of every word'
export const HARD_MODE_CHEATING_MESSAGE =
  'Hard Mode can be enabled only at the start'
export const HARD_MODE_RESTRICTION_MESSAGE =
  'Hard mode can be enabled only in single challenge games'
export const HARD_MODE_DESCRIPTION =
  'Any revealed hints must be used in subsequent guesses'
export const HIGH_CONTRAST_MODE_DESCRIPTION = 'For improved color vision'
export const PERFORMANCE_MODE_DESCRIPTION =
  'Reduces some animations and rendering'
export const CHALLENGES_DESCRIPTION = 'How many words to guess'
export const LENGTH_DESCRIPTION = 'Length of each word'
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
export const MIGRATE_HEADING_TEXT = 'New Device'
export const MIGRATE_BUTTON_TEXT = 'Transfer'
export const MIGRATE_DESCRIPTION_TEXT =
  'Transfer your statistics to a new device'
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

export const ADVANCED_SETTINGS_TITLE = 'Advanced Settings'
export const ADVANCED_SETTINGS_DESC = 'Some boring, some interesting'
export const ADVANCED_SETTINGS_BUTTON = 'More Settings'
