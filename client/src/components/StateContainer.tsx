import React, { useState } from 'react'
import { Editable } from './Editable'
import { Preview } from './Preview'
import NotesDrawer from './Drawer'

export const StateContainer: React.FC = () => {
  const [value, setValue] = useState(
    '# Hello World \n## Write in Markdown, see preview\n**bold** _italic_ \nTry typing markdown here'
  )

  const [preview, setPreview] = useState(true)

  return (
    <>
      <NotesDrawer
        preview={preview}
        handlePreview={setPreview.bind(this)}
        value={value}
        handleNoteChange={setValue.bind(this)}
      >
        <div className="flex-container">
          <Editable
            value={value}
            handleChange={setValue.bind(this)}
            preview={preview}
          />
          <Preview text={value} preview={preview} />
        </div>
      </NotesDrawer>
    </>
  )
}
