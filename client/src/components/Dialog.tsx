import React, { Dispatch, SetStateAction } from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import PropTypes from 'prop-types'
import { Typography } from '@material-ui/core'

interface Props {
  open: boolean
  inputValue: string
  handleOpen: Dispatch<SetStateAction<boolean>>
  handleInputValue: Dispatch<SetStateAction<string>>
  handleConfirmed: any
}

export const FormDialog: React.FC<Props> = (props) => {
  const handleClose = () => {
    props.handleOpen(!open)
  }

  const handleConfirm = () => {
    handleClose()
    props.handleConfirmed()
  }

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Create a New Note</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography variant="subtitle1" color="textPrimary" gutterBottom>
              Non-valid characters will be removed.
            </Typography>
            <Typography>
              You do not need to add .md extension, it will automatically be
              added.
            </Typography>
          </DialogContentText>
          <TextField
            autoFocus
            fullWidth
            margin="dense"
            id="name"
            label="Name your new note"
            type="text"
            value={props.inputValue}
            onChange={(event) => props.handleInputValue(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

FormDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  inputValue: PropTypes.string.isRequired,
  handleOpen: PropTypes.func.isRequired,
  handleInputValue: PropTypes.func.isRequired,
  handleConfirmed: PropTypes.func.isRequired,
}
