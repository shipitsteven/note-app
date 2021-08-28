import React, { useState, Dispatch, SetStateAction } from 'react'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import PropTypes from 'prop-types'
import { ClickAwayListener } from '@material-ui/core'
import { createNewFile } from '../util/createNew'
import { FormDialog } from './Dialog'
import { useSnackbar } from 'notistack'

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

  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  const handleCreateNewNote = () => {
    const creation = createNewFile(dialogInputValue, props.currentFolder)
    if (creation.result === 'error') {
      enqueueSnackbar(creation.message, { variant: 'error' })
    } else {
      props.handleNoteId(creation.path)
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
