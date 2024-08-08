import { Button } from './Button'

type Props = {
  settingName: string | any
  description?: string
  onClick: () => void
  Icon?: any
  buttonText: string
}

export const SettingsButton = ({
  settingName,
  description,
  onClick,
  Icon,
  buttonText,
}: Props) => {
  return (
    <div className="flex justify-between gap-4 py-3 text-left text-secondary transition-colors duration-500">
      <div>
        <div className="leading-none">{settingName}</div>
        {description && <p className="mt-1 text-xs">{description}</p>}
      </div>
      <div className="flex items-center">
        <Button onClick={onClick}>
          {Icon && <Icon className="mr-2 h-6 w-6 shrink-0 cursor-pointer" />}
          {buttonText}
        </Button>
      </div>
    </div>
  )
}
