import React from 'react'
import marked from 'marked'

marked.setOptions({
    breaks: true,
})

interface Props {
    text: string
}

export const Preview: React.FC<Props> = ({ text }: Props) => {
    const toHTML = () => {
        return { __html: marked(text) }
    }

    return <div dangerouslySetInnerHTML={toHTML()} className="preview" />
}
