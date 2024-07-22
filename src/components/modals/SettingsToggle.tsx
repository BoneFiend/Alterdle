import classnames from 'classnames'

type Props = {
  settingName: string
  flag: boolean
  handleFlag: Function
  description?: string
}

export const SettingsToggle = ({
  settingName,
  flag,
  handleFlag,
  description,
}: Props) => {
  const toggleHolder = classnames(
    'w-14 h-8 flex shrink-0 items-center dark:shadow-lg rounded-full p-1 duration-300 ease-in-out',
    {
      'bg-accent': flag,
      'bg-accent-disabled': !flag,
    }
  )
  const toggleButton = classnames(
    'bg-white dark:text-secondary w-6 h-6 rounded-full shadow-lg transform duration-300 ease-in-out',
    {
      'translate-x-6': flag,
    }
  )

  return (
    <div className="mb-3 flex justify-between gap-4 pt-3">
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
