import { Note } from '../note_storage'

interface TreeNode {
  id: string
  name: string
  children: [TreeNode] | any
}

export const parseTreeFromNotes = (notes: Note[]): TreeNode => {
  const root: TreeNode = { id: 'root', name: 'root', children: [] }
  notes.forEach((note) => {
    let currentNode: TreeNode | undefined = root
    const split = note.id.split('/')

    for (let i = 0; i < split.length - 1; i++) {
      const currentLevel = split[i]
      const childNode: TreeNode | undefined = currentNode?.children?.find(
        (note) => note.id === currentLevel
      )

      const newChild: TreeNode = {
        id: currentLevel,
        name: currentLevel,
        children: [],
      }
      if (childNode === undefined) {
        currentNode.children.push(newChild)
      }

      currentNode = newChild
    }
    currentNode?.children?.push({
      id: split[split.length - 1],
      name: split[split.length - 1],
      children: [],
    })
  })

  // TODO: throw exception if notes folder haven't been created?
  return root.children[0]
}
