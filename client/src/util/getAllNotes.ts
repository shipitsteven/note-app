import { FileStoreProvider, Note } from '../note_storage'
const DataStoreProvider = new FileStoreProvider()
const Database = DataStoreProvider.Create()

export const getAllNotes = (): Note[] => {
  const allNoteIds = Database.GetAll().GetResult()
  const allNoteArr: Note[] = []

  allNoteIds?.forEach((noteId) => {
    const note = Database.Get(noteId).GetResult()
    if (note !== null) {
      allNoteArr.push(note)
    }
  })
  return allNoteArr
}
