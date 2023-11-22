import {
  MAX_NUMBER_OF_LETTERS,
  MAX_NUMBER_OF_WORDS,
  MIN_NUMBER_OF_LETTERS,
  MIN_NUMBER_OF_WORDS,
} from '../../constants/settings'
import { BaseModal } from './BaseModal'

type Props = {
  isOpen: boolean
  handleClose: () => void
}

export const InfoModal = ({ isOpen, handleClose }: Props) => {
  return (
    <BaseModal title="Game Info" isOpen={isOpen} handleClose={handleClose}>
      <p className="mt-2 text-sm text-stone-700 dark:text-gray-300">
        Alterdle is a fully customisable word guessing game.
        <br />
        <br />
        For the first time ever it allows users to choose how many words to
        guess at once (between {MIN_NUMBER_OF_WORDS} and {MAX_NUMBER_OF_WORDS}){' '}
        <i>as well</i> as how long each word is (between {MIN_NUMBER_OF_LETTERS}{' '}
        and {MAX_NUMBER_OF_LETTERS} letters), resulting in{' '}
        {(MAX_NUMBER_OF_LETTERS - MIN_NUMBER_OF_LETTERS + 1) *
          (MAX_NUMBER_OF_WORDS - MIN_NUMBER_OF_WORDS + 1) -
          MAX_NUMBER_OF_WORDS + // Accounts for only 2 single letter words
          2}{' '}
        unique daily puzzles!!
      </p>
      <br />
      <p className="text-sm text-stone-700 dark:text-gray-300">
        This game chooses words at random, so it will occasionally choose
        obscure or inappropriate ones. If you find a particularly offensive word
        please consider contributing to the project.{' '}
      </p>
      <p className="mt-6 text-sm italic text-stone-700 dark:text-gray-300">
        This game was built on top of the open source project{' '}
        <a
          href="https://github.com/cwackerfuss/react-wordle"
          className="font-bold underline"
        >
          react-wordle
        </a>
        , made using React, Typescript, and Tailwind. Check out the code for
        Alterdle{' '}
        <a
          href="https://github.com/BoneFiend/alterdle"
          className="font-bold underline"
        >
          here
        </a>
        .
      </p>
    </BaseModal>
  )
}
