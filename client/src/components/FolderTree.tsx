/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react'
import TreeView from '@material-ui/lab/TreeView'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import TreeItem from '@material-ui/lab/TreeItem'
import { makeStyles } from '@material-ui/core/styles'
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
}

// NEXT: each file should be an active link, so user can open the selected note
const renderTree = (nodes: TreeNode) => (
  <TreeItem key={nodes.name} nodeId={nodes.name} label={nodes.name}>
    {Array.isArray(nodes.children)
      ? nodes.children.map((node) => renderTree(node))
      : null}
  </TreeItem>
)

export const FolderTree: React.FC = () => {
  const classes = useStyles()

  const tree = dirTree('./notes')

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
