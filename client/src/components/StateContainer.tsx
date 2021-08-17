import React, { useState, useEffect } from 'react'
import { Editable } from './Editable'
import { Preview } from './Preview'
import NotesDrawer from './Drawer'
import { getAllNotes } from '../util/getAllNotes'
import { parseTreeFromNotes } from '../util/parseTreeFromNotes'

export const StateContainer: React.FC = () => {
  const [value, setValue] = useState(
    '# Hello World \n## Write in Markdown, see preview\n**bold** _italic_ \nTry typing markdown here'
  )
  const [noteId, setNoteId] = useState('')

  const [preview, setPreview] = useState(true)

  const [folderTree, setFolderTree] = useState({
    id: '',
    name: '',
    children: [],
  })

  useEffect(() => {
    setFolderTree(parseTreeFromNotes(getAllNotes()))

    // console.log(getAllNotes())
  }, [])

  return (
    <>
      <NotesDrawer
        preview={preview}
        value={value}
        noteId={noteId}
        folderTree={folderTree}
        handlePreview={setPreview.bind(this)}
        handleNoteChange={setValue.bind(this)}
        handleNoteId={setNoteId.bind(this)}
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
