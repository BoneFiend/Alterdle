import { useEffect, useState } from 'react'

import { DELETE_TEXT, ENTER_TEXT } from '@constants/strings'

import useActiveKeys from '@stores/useActiveKeys'
import useModalStore from '@stores/useModalStore'

import { getStatuses } from '@lib/statuses'
import { localeAwareUpperCase } from '@lib/words'

import { Key } from './Key'

type Props = {
  onChar: (value: string) => void
  onDelete: () => void
  onEnter: () => void
  solution: string[]
  guesses: string[]
  isRevealing?: boolean
}

export const Keyboard = ({
  onChar,
  onDelete,
  onEnter,
  solution,
  guesses,
  isRevealing,
}: Props) => {
  const [charStatuses, setCharStatuses] = useState(
    getStatuses(solution, guesses),
  )

  useEffect(() => {
    if (!isRevealing) setCharStatuses(getStatuses(solution, guesses))
  }, [isRevealing, solution, guesses])

  const { activateKey, deactivateKey, isKeyActive, deactivateAllKeys } =
    useActiveKeys()

  const isAnyModalOpen = useModalStore((s) => s.isAnyModalOpen)

  const onClick = (value: string) => {
    if (value === 'ENTER') {
      onEnter()
    } else if (value === 'DELETE') {
      onDelete()
    } else {
      onChar(value)
    }
  }

  const keyDown = (e: KeyboardEvent) => {
    activateKey(localeAwareUpperCase(e.key))
    if (e.code === 'Backspace') {
      onDelete()
    }
  }

  const keyUp = (e: KeyboardEvent) => {
    deactivateKey(localeAwareUpperCase(e.key))
    if (e.code === 'Enter') {
      onEnter()
    } else {
      const key = localeAwareUpperCase(e.key)
      if (key.length === 1 && key >= 'A' && key <= 'Z') {
        onChar(key)
      }
    }
  }

  useEffect(() => {
    if (isAnyModalOpen) {
      return deactivateAllKeys()
    }
    window.addEventListener('keyup', keyUp)
    window.addEventListener('keydown', keyDown)
    return () => {
      window.removeEventListener('keyup', keyUp)
      window.removeEventListener('keydown', keyDown)
    }
  }, [onEnter, onDelete, onChar, isAnyModalOpen])

  return (
    <div className="flex flex-col gap-1 *:flex *:justify-center">
      <div>
        {['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'].map((key) => (
          <Key
            value={key}
            key={key}
            onClick={onClick}
            status={charStatuses[key]}
            isRevealing={isRevealing}
            isActive={isKeyActive(key)}
          />
        ))}
      </div>
      <div>
        {['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'].map((key) => (
          <Key
            value={key}
            key={key}
            onClick={onClick}
            status={charStatuses[key]}
            isRevealing={isRevealing}
            isActive={isKeyActive(key)}
          />
        ))}
      </div>
      <div>
        <Key
          longWidth={true}
          value="ENTER"
          onClick={onClick}
          isActive={isKeyActive('ENTER')}
        >
          {ENTER_TEXT}
        </Key>
        {['Z', 'X', 'C', 'V', 'B', 'N', 'M'].map((key) => (
          <Key
            value={key}
            key={key}
            onClick={onClick}
            status={charStatuses[key]}
            isRevealing={isRevealing}
            isActive={isKeyActive(key)}
          />
        ))}
        <Key
          longWidth={true}
          value="DELETE"
          onClick={onClick}
          isActive={isKeyActive('BACKSPACE')}
        >
          {DELETE_TEXT}
        </Key>
      </div>
    </div>
  )
}
