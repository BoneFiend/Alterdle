import { Switch } from '@nextui-org/switch'

type Props = {
  settingName: string
  flag: boolean
  handleFlag: (isSelected: boolean) => void
  description?: string
  disabled?: boolean
}

export const SettingsToggle = ({
  settingName,
  flag,
  handleFlag,
  description,
  disabled,
}: Props) => {
  return (
    <div className="flex justify-between gap-4 py-3">
      <div className="text-left text-ui-main transition-colors duration-500">
        <p className="leading-none">{settingName}</p>
        {description && (
          <p className="mt-1 text-xs text-ui-main transition-colors duration-500">
            {description}
          </p>
        )}
      </div>
      <Switch
        aria-label={settingName}
        isSelected={flag}
        onValueChange={handleFlag}
        isDisabled={disabled}
        size="lg"
        color="warning"
        classNames={{
          wrapper: 'bg-ui-primary-disabled shadow-lg',
        }}
      />
    </div>
  )
}
