import { Note } from '../note_storage'

export interface TreeNode {
  id: string
  name: string
  children: [TreeNode] | any
}

export const parseTreeFromNotes = (notes: Note[]): TreeNode => {
  const root: TreeNode = { id: 'root', name: 'root', children: [] }

  notes.forEach((note) => {
    let currentNode: TreeNode = root
    const split = note.id.split('/')
    for (let i = 0; i < split.length - 1; i++) {
      const currentLevel = split[i]

      let childNode = currentNode.children.find((cNote) => {
        return cNote.name == currentLevel
      })

      if (childNode === undefined) {
        childNode = {
          id: currentLevel,
          name: currentLevel,
          children: [],
        }
        currentNode.children.push(childNode)
      }

      currentNode = childNode
    }
    const leafFileName = split[split.length - 1]
    if (isMarkdown(leafFileName)) {
      currentNode.children.push({
        id: note.id,
        name: split[split.length - 1],
      })
    }
  })

  // TODO: throw exception if notes folder haven't been created?
  return root.children[0]
}

const isMarkdown = (fileName: string) => {
  try {
    const extension: string = fileName.split('.').slice(-1)[0]
    return extension === 'md'
  } catch (e) {
    console.log(e)
    return false
  }
}
