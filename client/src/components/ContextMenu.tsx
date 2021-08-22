import React from 'react'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import PropTypes from 'prop-types'
import TreeItem from '@material-ui/lab/TreeItem'
import { ClickAwayListener } from '@material-ui/core'

const initialState = {
  mouseX: null,
  mouseY: null,
}

export default function ContextMenu(props) {
  const [state, setState] = React.useState<{
    mouseX: null | number
    mouseY: null | number
  }>(initialState)

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
          <MenuItem onClick={handleClose}>Add New Note</MenuItem>
          <MenuItem onClick={handleClose}>Create New Note</MenuItem>
          <MenuItem onClick={handleClose}>Delete</MenuItem>
        </Menu>
      </ClickAwayListener>
    </div>
  )
}

ContextMenu.propTypes = {
  children: PropTypes.node.isRequired,
}
