import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react'
import { XCircleIcon } from '@heroicons/react/outline'
import classnames from 'classnames'

type Props = {
  title: string
  children: React.ReactNode
  isOpen: boolean
  handleClose: () => void
}

export const BaseModal = ({ title, children, isOpen, handleClose }: Props) => {
  return (
    <Dialog
      as="div"
      className="fixed inset-0 z-10 overflow-y-auto focus:outline-none"
      open={isOpen}
      onClose={handleClose}
    >
      <DialogBackdrop
        transition
        className={classnames(
          'fixed inset-0 bg-gray-500/75',
          'transition-opacity duration-300 ease-out',
          'data-[closed]:opacity-0 data-[closed]:duration-200 data-[closed]:ease-in'
        )}
      />
      <DialogPanel
        transition
        className={classnames(
          'h-full w-full',
          'transition-all duration-300 ease-out',
          'data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[closed]:duration-200 data-[closed]:ease-in data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95'
        )}
      >
        <div className="flex min-h-full items-center justify-center px-4 py-10 text-center sm:p-0">
          <div
            className={classnames(
              '',
              'inline-block transform overflow-hidden rounded-lg bg-primary-2 px-4 pb-4 pt-5 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:align-middle'
            )}
          >
            <button
              onClick={handleClose}
              tabIndex={0}
              aria-pressed="false"
              className="absolute right-4 top-4"
            >
              <XCircleIcon className="h-6 w-6 cursor-pointer dark:stroke-white" />
            </button>
            <div>
              <div className="text-center">
                <DialogTitle
                  as="h3"
                  className="text-xl font-semibold leading-6 text-gray-900 dark:text-gray-100"
                >
                  {title}
                </DialogTitle>
                <div className="">{children}</div>
              </div>
            </div>
          </div>
        </div>
      </DialogPanel>
    </Dialog>
  )
}
