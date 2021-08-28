import React, { useState, Dispatch, SetStateAction } from 'react'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import PropTypes from 'prop-types'
import { ClickAwayListener } from '@material-ui/core'
import { createNewFile } from '../util/createNew'
import { FormDialog } from './Dialog'
const { dialog } = window.require('electron').remote

const initialState = {
  mouseX: null,
  mouseY: null,
}

interface Props {
  currentFolder: string
  children: any
  handleNoteId: Dispatch<SetStateAction<string>>
}

export const ContextMenu: React.FC<Props> = (props) => {
  const [state, setState] = React.useState<{
    mouseX: null | number
    mouseY: null | number
  }>(initialState)

  const [openDialog, setOpenDialog] = useState(false)
  const [dialogInputValue, setDialogInputValue] = useState('')

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

  const openDialogWindow = () => {
    handleClose()
    setOpenDialog(true)
  }

  // TODO: add snackbar to display note creation success/failure
  const handleCreateNewNote = () => {
    const newNoteId = createNewFile(dialogInputValue, props.currentFolder)
    if (newNoteId === 'file already exists') {
      dialog.showErrorBox('Error', 'File already exists.')
    } else {
      props.handleNoteId(newNoteId)
    }
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
          <MenuItem onClick={openDialogWindow}>Add New Note</MenuItem>
          <MenuItem onClick={handleClose}>Create New Note</MenuItem>
          <MenuItem onClick={handleClose}>Delete</MenuItem>
          <MenuItem onClick={handleClose}>
            {/* // TODO: DRY dialog title and description */}
            <FormDialog
              open={openDialog}
              inputValue={dialogInputValue}
              handleOpen={setOpenDialog.bind(this)}
              handleInputValue={setDialogInputValue.bind(this)}
              handleConfirmed={handleCreateNewNote}
            ></FormDialog>
          </MenuItem>
        </Menu>
      </ClickAwayListener>
    </div>
  )
}

ContextMenu.propTypes = {
  children: PropTypes.node,
  currentFolder: PropTypes.string.isRequired,
  handleNoteId: PropTypes.func.isRequired,
}
