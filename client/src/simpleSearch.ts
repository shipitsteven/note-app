import {FileStoreProvider, Note} from './note_storage';
const DataStoreProvider = new FileStoreProvider();
const Database = DataStoreProvider.Create();


export function searchResult(searchTerm:string) : Note[] {
  const allNotes = Database.GetAll().GetResult();
  const arr:Note[] = [];

  if(searchTerm)
    allNotes?.forEach((item)=>{
        const note = Database.Get(item).GetResult();
        if(note!=null||note!=undefined){
          arr.push(note)
        }
    })

  const filterItems = (arr:Note[], query:string) => {
    return arr.filter(el => el.content.toLowerCase().indexOf(query.toLowerCase()) !== -1)
  }

  const result = filterItems(arr,searchTerm)

  return result;
}