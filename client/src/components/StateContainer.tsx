import React, { useState } from 'react'
import { Editable } from './Editable'
import { Preview } from './Preview'
import NotesDrawer from './Drawer'

export const StateContainer: React.FC = () => {
  const [value, setValue] = useState(
    '# Hello World \n## Write in Markdown, see preview\n**bold** _italic_ \nTry typing markdown here'
  )

  return (
    <>
      <NotesDrawer>
        <div className="flex-container">
          <Editable value={value} handleChange={setValue.bind(this)} />
          <Preview text={value} />
        </div>
      </NotesDrawer>
    </>
  )
}
