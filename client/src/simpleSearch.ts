import { FileStoreProvider, Note } from './note_storage'
const DataStoreProvider = new FileStoreProvider()
const Database = DataStoreProvider.Create()
import { getAllNotes } from './util/getAllNotes'

export function searchResult(searchTerm: string): Note[] {

  const arr = getAllNotes()

  const filterItems = (arr: Note[], query: string) => {
    return arr.filter(
      (el) => el.content.toLowerCase().indexOf(query.toLowerCase()) !== -1 || el.id.toLocaleLowerCase().indexOf(query.toLocaleLowerCase()) !== -1
    )
  }

  const result = filterItems(arr, searchTerm)

  return result
}
