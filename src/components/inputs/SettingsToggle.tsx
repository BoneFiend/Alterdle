import cn from '@lib/cn'

type Props = {
  settingName: string
  flag: boolean
  handleFlag: Function
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
  const toggleHolder = cn(
    'flex h-8 w-14 shrink-0 items-center rounded-full p-1 duration-300 ease-in-out dark:shadow-lg',
    {
      'bg-accent': flag && !disabled,
      'bg-accent-disabled': !flag || disabled,
    },
  )
  const toggleButton = cn(
    'h-6 w-6 rounded-full bg-white shadow-lg transition-all duration-300 ease-in-out dark:text-secondary',
    {
      'translate-x-6': flag,
      'opacity-10': disabled,
    },
  )

  return (
    <div className="flex justify-between gap-4 py-3">
      <div className="text-left text-secondary transition-colors duration-500">
        <p className="leading-none">{settingName}</p>
        {description && (
          <p className="mt-1 text-xs text-secondary transition-colors duration-500">
            {description}
          </p>
        )}
      </div>
      <button className={toggleHolder} onClick={() => handleFlag(!flag)}>
        <div className={toggleButton} />
      </button>
    </div>
  )
}
