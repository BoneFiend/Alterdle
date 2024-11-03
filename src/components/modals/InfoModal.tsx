import {
  MAX_NUMBER_OF_LETTERS,
  MAX_NUMBER_OF_WORDS,
  MIN_NUMBER_OF_LETTERS,
  MIN_NUMBER_OF_WORDS,
} from '@constants/settings'

import useModalStore, { updateModals } from '@stores/useModalStore'

import { BaseModal } from './BaseModal'

export const InfoModal = () => {
  const isInfoModalOpen = useModalStore((s) => s.modals.isInfoModalOpen)

  const handleClose = () => updateModals({ isInfoModalOpen: false })

  return (
    <BaseModal
      title="Game Info"
      isOpen={isInfoModalOpen}
      handleClose={handleClose}
    >
      <p className="mt-2 text-sm text-ui-main">
        Alterdle is a fully customisable word guessing game.
        <br />
        <br />
        Choose how long each word is (between {MIN_NUMBER_OF_LETTERS} and{' '}
        {MAX_NUMBER_OF_LETTERS} letters) <i>as well</i> as how many of them to
        guess (between {MIN_NUMBER_OF_WORDS} and {MAX_NUMBER_OF_WORDS}) ,
        resulting in{' '}
        {(MAX_NUMBER_OF_LETTERS - MIN_NUMBER_OF_LETTERS + 1) *
          (MAX_NUMBER_OF_WORDS - MIN_NUMBER_OF_WORDS + 1) -
          MAX_NUMBER_OF_WORDS + // Accounts for only 2 single letter words
          2}{' '}
        unique daily puzzles!!
      </p>
      <br />
      <p className="text-sm text-ui-main">
        This game chooses words at random, so it will occasionally choose
        obscure or inappropriate ones. If you find a particularly offensive word
        please consider contributing to the project, or contact me on{' '}
        <a
          href="https://www.reddit.com/user/BoneFiend82"
          className="font-bold underline"
          target="_blank"
          rel="noreferrer"
        >
          Reddit
        </a>
        .{' '}
      </p>
      <p className="mt-6 text-sm italic text-ui-main">
        Check out the code for Alterdle{' '}
        <a
          href="https://github.com/BoneFiend/alterdle"
          className="font-bold underline"
          target="_blank"
          rel="noreferrer"
        >
          here
        </a>
        .
      </p>
    </BaseModal>
  )
}
