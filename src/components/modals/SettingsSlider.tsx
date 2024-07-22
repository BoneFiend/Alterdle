import { Slider } from '@nextui-org/slider'

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
    <div className="mb-3 flex justify-between gap-4 pt-3">
      <div className="text-left text-secondary transition-colors duration-500">
        <p className="leading-none">{settingName}</p>
        {description && (
          <p className="mt-1 text-xs text-secondary transition-colors duration-500">
            {description}
          </p>
        )}
      </div>
      <div className="flex gap-3">
        <p className="text-secondary transition-colors duration-500">{value}</p>
        <Slider
          aria-label={settingName}
          minValue={minValue}
          maxValue={maxValue}
          value={value}
          onChange={(e) => handleValue(Number(e))}
          step={1}
          showSteps
          color="warning"
          className="w-36"
          classNames={{
            filler: 'transition-colors duration-500',
            thumb: 'transition-colors duration-500 after:bg-white',
            track: 'bg-accent-disabled transition-colors duration-500',
            step: 'transition-colors duration-500',
          }}
        />
      </div>
    </div>
  )
}
