import type { ReactNode } from 'react'

import type { ShareIcon } from '@heroicons/react/outline'
import type { VariantProps } from 'class-variance-authority'

import { Button, type buttonVariants } from './Button'

interface Props extends VariantProps<typeof buttonVariants> {
  settingName: ReactNode
  description?: string
  onClick: () => void
  Icon?: typeof ShareIcon
  buttonText: string
}

export const SettingsButton = ({
  settingName,
  description,
  onClick,
  Icon,
  buttonText,
  ...props
}: Props) => {
  return (
    <div className="flex justify-between gap-4 py-3 text-left text-ui-main transition-colors duration-500">
      <div>
        <div className="leading-none">{settingName}</div>
        {description && <p className="mt-1 text-xs">{description}</p>}
      </div>
      <div className="flex items-center">
        <Button onClick={onClick} {...props}>
          {Icon && <Icon className="mr-2 h-6 w-6 shrink-0 cursor-pointer" />}
          {buttonText}
        </Button>
      </div>
    </div>
  )
}
