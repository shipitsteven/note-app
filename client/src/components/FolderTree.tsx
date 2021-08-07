/* eslint-disable @typescript-eslint/no-var-requires */
import React, { useEffect } from 'react'
import TreeView from '@material-ui/lab/TreeView'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import TreeItem from '@material-ui/lab/TreeItem'
import { makeStyles } from '@material-ui/core/styles'
const dirTree = require('directory-tree')
const upath = require('upath')
const currentPath = window.require('electron').remote.app.getAppPath()

const useStyles = makeStyles({
  root: {
    height: 110,
    flexGrow: 1,
    maxWidth: 400,
  },
})

interface TreeNode {
  path: string
  name: string
  size: number
  type: string
  children: [TreeNode]
}

const renderTree = (nodes: TreeNode) => (
  <div>placeholder</div>
  //   <TreeItem key={nodes.name} nodeId={nodes.name} label={nodes.name}>
  //     {Array.isArray(nodes.children)
  //       ? nodes.children.map((node) => renderTree(node))
  //       : null}
  //   </TreeItem>
)

export const FolderTree: React.FC = () => {
  const classes = useStyles()

  // FIXME: dirTree is not working on any given path
  const tree = dirTree(currentPath.toString())

  useEffect(() => {
    // console.log(currentPath)
    console.log(tree)
  }, [tree])

  return (
    <TreeView
      className={classes.root}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpanded={['root']}
      defaultExpandIcon={<ChevronRightIcon />}
    >
      {/* {renderTree(tree)} */}
    </TreeView>
  )
}
