import React, { useState, useEffect } from 'react'
import { Editable } from './Editable'
import { Preview } from './Preview'
import NotesDrawer from './Drawer'
import { getAllNotes } from '../util/getAllNotes'
import { parseTreeFromNotes } from '../util/parseTreeFromNotes'
import { searchResult } from '../simpleSearch'
import { FileStoreProvider } from '../note_storage'
const { ipcRenderer } = window.require('electron')

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

  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    setFolderTree(parseTreeFromNotes(getAllNotes()))

  }, [])

  useEffect(() => {
    ipcRenderer.on('changeNote', (event, url) => {
      setNoteId(`notes${url}`)
      const DataStoreProvider = new FileStoreProvider()
      const FileStore = DataStoreProvider.Create()
      const note = FileStore.Get(`notes${url}`)

      const content = note.GetResult()?.content || ''
      setValue(content)
    })
  }, [])


  useEffect(() => {
    if (searchTerm === '') {
      setFolderTree(parseTreeFromNotes(getAllNotes()))
    } else {
      setFolderTree(parseTreeFromNotes(searchResult(searchTerm)))
    }
  }, [searchTerm])

  return (
    <>
      <NotesDrawer
        preview={preview}
        value={value}
        noteId={noteId}
        folderTree={folderTree}
        searchTerm={searchTerm}
        handlePreview={setPreview.bind(this)}
        handleNoteChange={setValue.bind(this)}
        handleNoteId={setNoteId.bind(this)}
        handleSearchTerm={setSearchTerm.bind(this)}
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
