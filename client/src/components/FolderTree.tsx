/* eslint-disable @typescript-eslint/no-var-requires */
import React, { SetStateAction } from 'react'
import TreeView from '@material-ui/lab/TreeView'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import TreeItem from '@material-ui/lab/TreeItem'
import { makeStyles } from '@material-ui/core/styles'
import { Dispatch } from 'react'
import { FileStoreProvider } from '../note_storage'
const dirTree = window.require('directory-tree')

const useStyles = makeStyles({
  root: {
    height: 'auto',
    flexGrow: 1,
    maxWidth: 400,
    overflow: 'auto',
  },
})

interface TreeNode {
  path: string
  name: string
  size: number
  type: string
  children: [TreeNode]
  extension?: string
}
interface Props {
  handleChange: Dispatch<SetStateAction<string>>
}

export const FolderTree: React.FC<Props> = (props) => {
  const classes = useStyles()

  const tree = dirTree('./notes')

  // NEXT: each file should be an active link, so user can open the selected note
  const renderTree = (nodes: TreeNode) => (
    <TreeItem
      key={nodes.name}
      nodeId={nodes.name}
      label={nodes.name}
      onLabelClick={(event) => {
        getNote(nodes, event)
      }}
    >
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => renderTree(node))
        : null}
    </TreeItem>
  )

  const getNote = (node: TreeNode, event: React.MouseEvent) => {
    if (node.type === 'file' && node.extension === '.md') {
      // get content of file
      event.preventDefault()
      const DataStoreProvider = new FileStoreProvider()
      const FileStore = DataStoreProvider.Create()
      const note = FileStore.Get(node.path)
      console.log(node)
      if (note.IsSuccess()) {
        const text = note.GetResult()?.content || ''
        // eslint-disable-next-line react/prop-types
        props.handleChange(text)
      } else {
        alert('Something went wrong while retrieving notes :(')
      }
    }
    return event
  }

  return (
    <TreeView
      className={classes.root}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpanded={['root']}
      defaultExpandIcon={<ChevronRightIcon />}
    >
      {renderTree(tree)}
    </TreeView>
  )
}
