type Props = {
  settingName: string
  value: number
  handleValue: Function
  description?: string
}

export const SettingsSlider = ({
  settingName,
  value,
  handleValue,
  description,
}: Props) => {
  return (
    <>
      <div className="flex justify-between gap-4 py-3">
        <div className="mt-2 text-left text-gray-500 dark:text-gray-300">
          <p className="leading-none">{settingName}</p>
          {description && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-300">
              {description}
            </p>
          )}
        </div>
        <div className="mt-2 text-left text-gray-500 dark:text-gray-300">
          <p>{value}</p>
          <input
            type="range"
            min="1"
            max="4"
            value={value}
            onChange={(e) => handleValue(Number(e.target.value))}
            step="1"
          />
        </div>
      </div>
    </>
  )
}
