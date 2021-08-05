import React from 'react'
import marked from 'marked'
import clsx from 'clsx'

marked.setOptions({
  breaks: true,
})

interface Props {
  text: string
  preview: boolean
}

export const Preview: React.FC<Props> = ({ text, preview }: Props) => {
  const toHTML = () => {
    return { __html: marked(text) }
  }

  return (
    <div
      dangerouslySetInnerHTML={preview ? toHTML() : undefined}
      className={clsx('preview', { ['hidden']: !preview })}
    />
  )
}
