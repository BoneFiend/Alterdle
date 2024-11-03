import cn from '@lib/cn'

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
  const currentRowClass = cn(
    'bg-ui-primary-disabled p-0.5 text-center text-xs font-medium text-white',
    isCurrentDayStatRow && 'bg-accent font-bold dark:text-ui-foundation',
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
