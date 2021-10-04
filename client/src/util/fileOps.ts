import isElectron from 'is-electron'
const fs = isElectron() ? window.require('fs') : require('fs')
const sanitize = window.require('sanitize-filename')

export const createNewFile = (
  title: string,
  currentFolder: string
): Record<string, any> => {
  const cleanTitle = sanitize(title)
  const filePath = `./${currentFolder}/${cleanTitle}.md`

  try {
    fs.accessSync(filePath)
    return { result: 'error', message: 'File already exists', path: '' }
  } catch (e) {
    const sameTitle = title === cleanTitle
    fs.writeFileSync(filePath, '')
    if (sameTitle) {
      return { result: 'success', warning: false, path: filePath }
    } else {
      return {
        result: 'success',
        warning: true,
        path: filePath,
        newName: cleanTitle,
      }
    }
  }
}

export const deleteFile = (path: string): Record<string, any> => {
  try {
    fs.unlinkSync(path)
    return { result: 'success', message: 'Note deleted' }
  } catch (e) {
    return { result: 'error', message: e }
  }
}
