import classNames from 'classnames'

type Props = {
  index: number
  size: number
  label: string
  isCurrentDayStatRow: boolean
}

export const Progress = ({
  index,
  size,
  label,
  isCurrentDayStatRow,
}: Props) => {
  const currentRowClass = classNames(
    'text-xs font-medium text-white text-center p-0.5',
    {
      'bg-accent': isCurrentDayStatRow,
      'bg-accent-disabled': !isCurrentDayStatRow,
    }
  )
  return (
    <div className="justify-left m-1 flex">
      <div className="w-2 items-center justify-center">{index}</div>
      <div className="ml-3 w-full">
        <div style={{ width: `${8 + size}%` }} className={currentRowClass}>
          {label}
        </div>
      </div>
    </div>
  )
}
