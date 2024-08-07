export type CharStatus = 'absent' | 'present' | 'correct' | 'incorrect' | 'null'

export type GameStats = {
  winDistribution: { [key: number]: number }
  gridsWonDistribution: { [key: number]: number }
  gamesFailed: number
  currentStreak: number
  bestStreak: number
  totalGames: number
  successRate: number
  latestDate: Date
}

export type MigrationStats = {
  statistics: Obj2d
  gameState: StoredGameState | null
}

export type Obj2d = {
  // 2d Object type to avoid type errors
  [key: number]: {
    [key: number]: any
  }
}

export const updateObj2d = (
  obj: Obj2d,
  numberOfWords: number,
  numberOfLetters: number,
  newValue: any
) => {
  const newObj = { ...obj }
  if (!newObj[numberOfWords]) {
    newObj[numberOfWords] = {}
  }
  newObj[numberOfWords][numberOfLetters] = newValue
  return newObj
}

export type StoredGameState = {
  guesses: Obj2d
  gameDate: Date
}
