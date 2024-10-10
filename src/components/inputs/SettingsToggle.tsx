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
    'w-14 h-8 flex shrink-0 items-center dark:shadow-lg rounded-full p-1 duration-300 ease-in-out',
    {
      'bg-accent': flag && !disabled,
      'bg-accent-disabled': !flag || disabled,
    },
  )
  const toggleButton = cn(
    'bg-white dark:text-secondary w-6 h-6 rounded-full shadow-lg transition-all duration-300 ease-in-out',
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
