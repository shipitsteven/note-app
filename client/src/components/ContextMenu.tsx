import React, { useState, Dispatch, SetStateAction } from 'react'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import PropTypes from 'prop-types'
import { ClickAwayListener } from '@material-ui/core'
import { createNewFile, deleteFile } from '../util/fileOps'
import { FormDialog } from './Dialog'
import { useSnackbar } from 'notistack'

const initialState = {
  mouseX: null,
  mouseY: null,
}

interface Props {
  currentFolder: string
  children: any
  noteId: string
  handleNoteId: Dispatch<SetStateAction<string>>
  handleNoteChange: Dispatch<SetStateAction<string>>
}

export const ContextMenu: React.FC<Props> = (props) => {
  const [state, setState] = React.useState<{
    mouseX: null | number
    mouseY: null | number
  }>(initialState)

  const [openDialog, setOpenDialog] = useState('')
  const [dialogInputValue, setDialogInputValue] = useState('')
  //TODO: ContextMenu needs to know the current selection by reading state from the TreeView. This can be grabbed using onContextMenu in FolderTree line 68.

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    setState({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    })
  }

  const handleClose = () => {
    setState(initialState)
  }

  const openDialogWindow = (operation: string) => {
    handleClose()
    setOpenDialog(operation)
  }

  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  const handleCreateNewNote = () => {
    const creation = createNewFile(dialogInputValue, props.currentFolder)
    if (creation.result === 'error') {
      enqueueSnackbar(creation.message, { variant: 'error' })
    } else {
      props.handleNoteId(creation.path)
      props.handleNoteChange('')
      if (creation.result === 'success' && creation.warning) {
        enqueueSnackbar(
          `Invalid characters found, new note name is: ${creation.newName}`,
          {
            variant: 'warning',
          }
        )
      }
      enqueueSnackbar('New note created', { variant: 'success' })
    }
  }

  const handleDelete = () => {
    const deletion = deleteFile(props.noteId)
    if (deletion.result === 'error') {
      enqueueSnackbar(deletion.message, { variant: 'error' })
    } else {
      enqueueSnackbar('Note deleted', { variant: 'info' })
    }
  }

  const getFilename = (): string => {
    // console.log(props.currentFolder)
    return props.noteId.split('/').slice(-1)[0]
  }

  return (
    <div onContextMenu={handleClick} style={{ cursor: 'context-menu' }}>
      {props.children}
      <ClickAwayListener onClickAway={handleClose}>
        <Menu
          keepMounted
          open={state.mouseY !== null}
          onClose={handleClose}
          anchorReference="anchorPosition"
          anchorPosition={
            state.mouseY !== null && state.mouseX !== null
              ? { top: state.mouseY, left: state.mouseX }
              : undefined
          }
        >
          <MenuItem id="newNote" onClick={() => openDialogWindow('newNote')}>
            Add New Note
          </MenuItem>
          <MenuItem onClick={handleClose}>Create New Note</MenuItem>
          <MenuItem onClick={() => openDialogWindow('delete')}>Delete</MenuItem>
          <MenuItem onClick={() => openDialogWindow('deleteFolder')}>
            Delete Folder
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <FormDialog
              open={openDialog === 'newNote'}
              operation="newNote"
              title="Create a New Note"
              inputValue={dialogInputValue}
              handleOpen={setOpenDialog.bind(this)}
              handleInputValue={setDialogInputValue.bind(this)}
              handleConfirmed={handleCreateNewNote}
            />
            <FormDialog
              open={openDialog === 'delete'}
              operation="delete"
              title={`Delete ${getFilename()}`}
              inputValue={dialogInputValue}
              handleOpen={setOpenDialog.bind(this)}
              handleInputValue={setDialogInputValue.bind(this)}
              handleConfirmed={handleDelete}
            />
            <FormDialog
              open={openDialog === 'deleteFolder'}
              operation="deleteFolder"
              title={`Delete Folder ${getFilename()}`}
              inputValue={dialogInputValue}
              handleOpen={setOpenDialog.bind(this)}
              handleInputValue={setDialogInputValue.bind(this)}
              handleConfirmed={handleDelete}
            />
          </MenuItem>
        </Menu>
      </ClickAwayListener>
    </div>
  )
}

ContextMenu.propTypes = {
  children: PropTypes.node,
  noteId: PropTypes.string.isRequired,
  currentFolder: PropTypes.string.isRequired,
  handleNoteId: PropTypes.func.isRequired,
  handleNoteChange: PropTypes.func.isRequired,
}
