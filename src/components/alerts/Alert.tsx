import { Fragment } from 'react'

import { Transition } from '@headlessui/react'

import cn from '@lib/cn'

type Props = {
  isOpen: boolean
  message: string
  variant?: 'success' | 'error'
}

export const Alert = ({ isOpen, message, variant = 'error' }: Props) => {
  const classes = cn(
    'pointer-events-auto fixed left-1/2 top-14 z-20 max-w-sm -translate-x-1/2 transform overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5',
    {
      'bg-incorrect text-white': variant === 'error',
      'bg-blue-500 text-white': variant === 'success',
    },
  )

  return (
    <Transition
      show={isOpen}
      as={Fragment}
      enter="ease-out duration-300 transition"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className={classes}>
        <div className="p-2">
          <p className="text-center text-sm font-medium">{message}</p>
        </div>
      </div>
    </Transition>
  )
}
