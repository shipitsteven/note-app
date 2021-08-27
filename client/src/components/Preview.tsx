import React from 'react'
import marked from 'marked'
import clsx from 'clsx'
import Markdown from 'markdown-to-jsx'
import PropType from 'prop-types'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'

marked.setOptions({
  breaks: true,
})

interface Props {
  text: string
  preview: boolean
}

export const Preview: React.FC<Props> = ({ text, preview }: Props) => {
  const toHTML = () => {
    return (
      <Markdown
        options={{
          forceBlock: true,
          overrides: {
            pre: PreBlock,
          },
        }}
      >
        {text}
      </Markdown>
    )
  }

  return <div className={clsx({ ['no-preview']: !preview })}>{toHTML()}</div>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CodeBlock = ({ className, children }) => {
  let lang = 'text' // default monospaced text
  if (className && className.startsWith('lang-')) {
    lang = className.replace('lang-', '')
  }
  return <SyntaxHighlighter language={lang}>{children}</SyntaxHighlighter>
}

// markdown-to-jsx uses <pre><code/></pre> for code blocks.
const PreBlock = ({ children, ...rest }) => {
  if ('type' in children && children['type'] === 'code') {
    return CodeBlock(children['props'])
  }
  return <pre {...rest}>{children}</pre>
}

CodeBlock.propTypes = {
  className: PropType.string,
  children: PropType.any,
}

PreBlock.propTypes = {
  children: PropType.any,
}
