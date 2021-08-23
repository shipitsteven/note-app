import React from 'react'
import clsx from 'clsx'
interface Props {
  handleChange: (event: string) => void
  value: string
  preview: boolean
}

export const Editable: React.FC<Props> = ({
  handleChange,
  value,
  preview,
}: Props) => {
  return (
    <textarea
      className={clsx('preview', { ['hidden']: !preview })}
      value={value}
      onChange={(event) => {
        handleChange(event.target.value)
      }}
    />
  )
}
