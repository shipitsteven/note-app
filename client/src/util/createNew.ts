import isElectron from 'is-electron'
const fs = isElectron() ? window.require('fs') : require('fs')

export const createNewFile = (title: string, currentFolder: string): string => {
  // TODO: sanitize file name
  const filePath = `./${currentFolder}/${title}.md`
  try {
    // TODO: check if file already exist
    fs.writeFileSync(filePath, '')
    return filePath
  } catch (e) {
    console.log(e)
    return 'error'
  }
}
