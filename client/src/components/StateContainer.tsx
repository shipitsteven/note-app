import React, { useState, useEffect } from 'react'
import { Editable } from './Editable'
import { Preview } from './Preview'
import NotesDrawer from './Drawer'
import { getAllNotes } from '../util/getAllNotes'
import { parseTreeFromNotes } from '../util/parseTreeFromNotes'
import { searchResult } from '../simpleSearch'
import { SnackbarProvider } from 'notistack'

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

  const [currentFolder, setCurrentFolder] = useState('notes')

  // Initialize folder tree
  useEffect(() => {
    const tree = parseTreeFromNotes(getAllNotes())
    setFolderTree(tree)
  }, [])

  // Update folder tree base on search result
  useEffect(() => {
    if (searchTerm === '') {
      setFolderTree(parseTreeFromNotes(getAllNotes()))
    } else {
      setFolderTree(parseTreeFromNotes(searchResult(searchTerm)))
    }
  }, [searchTerm, noteId])

  // Update current folder level for create new note/folder
  useEffect(() => {
    // console.log(currentFolder)
  }, [currentFolder])

  return (
    <>
      <SnackbarProvider
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <NotesDrawer
          preview={preview}
          value={value}
          noteId={noteId}
          folderTree={folderTree}
          searchTerm={searchTerm}
          currentFolder={currentFolder}
          handlePreview={setPreview.bind(this)}
          handleNoteChange={setValue.bind(this)}
          handleNoteId={setNoteId.bind(this)}
          handleSearchTerm={setSearchTerm.bind(this)}
          handleCurrentFolder={setCurrentFolder.bind(this)}
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
      </SnackbarProvider>
    </>
  )
}
