import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react'
import { XCircleIcon } from '@heroicons/react/outline'

import useModalStore from '@stores/useModalStore'

import cn from '@lib/cn'

type Props = {
  title: string
  children: React.ReactNode
  isOpen: boolean
  handleClose: () => void
}

export const BaseModal = ({ title, children, isOpen, handleClose }: Props) => {
  const isAnyModalOpen = useModalStore((s) => s.isAnyModalOpen)

  return (
    <Dialog
      as="div"
      className="fixed inset-0 z-10 overflow-y-auto outline-none [scrollbar-width:none]"
      open={isOpen}
      onClose={handleClose}
    >
      <DialogBackdrop
        transition
        className={cn(
          'fixed inset-0 bg-black/40',
          'transition-opacity duration-200 ease-out',
          'data-[closed]:opacity-0 data-[closed]:ease-in',
          isAnyModalOpen && 'transition-none',
        )}
      />
      <DialogPanel
        transition
        className={cn(
          'h-full w-full',
          'transition-all duration-200 ease-out',
          'data-[closed]:translate-y-48 data-[closed]:opacity-0 data-[closed]:ease-in data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-[0.9]',
        )}
      >
        <div className="flex min-h-full items-center justify-center px-4 py-10 text-center sm:p-0">
          <div
            className={cn(
              'inline-block transform overflow-hidden rounded-lg text-left align-bottom drop-shadow-2xl duration-500 ease-in-out sm:w-full sm:max-w-sm sm:align-middle',
              'bg-gradient-to-tl from-[--foundation-property] to-[--foundation-2-property] [transition-property:_--foundation-property,_--foundation-2-property]',
            )}
          >
            <div className="px-4 pb-4 pt-5 sm:p-6">
              <button
                type="button"
                onClick={handleClose}
                tabIndex={0}
                aria-pressed="false"
                className="absolute right-4 top-4 z-50"
              >
                <XCircleIcon className="h-6 w-6 cursor-pointer stroke-ui-main transition-colors duration-500" />
              </button>
              <div className="relative">
                <div>
                  <div className="text-center">
                    <DialogTitle
                      as="h3"
                      className="text-xl font-semibold leading-6 text-ui-main transition-colors duration-500"
                    >
                      {title}
                    </DialogTitle>
                    <div>{children}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogPanel>
    </Dialog>
  )
}
