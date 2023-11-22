type Props = {
  settingName: string
  value: number
  handleValue: Function
  description?: string
  minValue: number
  maxValue: number
}

export const SettingsSlider = ({
  settingName,
  value,
  handleValue,
  description,
  minValue,
  maxValue,
}: Props) => {
  return (
    <>
      <div className="mb-3 flex justify-between gap-4 pt-3">
        <div className="text-left text-stone-700 dark:text-gray-300">
          <p className="leading-none">{settingName}</p>
          {description && (
            <p className="mt-1 text-xs text-stone-700 dark:text-gray-300">
              {description}
            </p>
          )}
        </div>
        <div>
          <p className="text-left text-stone-700 dark:text-gray-300">{value}</p>
          <input
            type="range"
            min={minValue}
            max={maxValue}
            value={value}
            onChange={(e) => handleValue(Number(e.target.value))}
            step="1"
          />
        </div>
      </div>
    </>
  )
}
