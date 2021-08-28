import isElectron from 'is-electron'
const fs = isElectron() ? window.require('fs') : require('fs')
const sanitize = window.require('sanitize-filename')

export const createNewFile = (title: string, currentFolder: string): string => {
  const cleanTitle = sanitize(title)
  const filePath = `./${currentFolder}/${cleanTitle}.md`

  try {
    fs.accessSync(filePath)
    return 'file already exists'
  } catch (e) {
    fs.writeFileSync(filePath, '')
    return filePath
  }
}
