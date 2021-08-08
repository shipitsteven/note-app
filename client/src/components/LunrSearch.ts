import {FileStoreProvider, Note} from '../note_storage';
import lunr from 'lunr';

const DataStoreProvider = new FileStoreProvider();
const Database = DataStoreProvider.Create();
const Notes = Database.GetAll().GetResult();



const idx = lunr(function(){
    //@ts-ignore
    this.ref("id");
    //@ts-ignore
    this.field("content");
    //@ts-ignore
    this.field("tags");

    if(Notes != null || Notes != undefined){
        for (let i = 0; i < Notes.length; i++) {
            //@ts-ignore
            this.add(Database.Get(Notes[i]))
        }
    }
})

/*function searchNote(query){
    const result = idx.searchNote(query)

    return result.map((item)=>{
        return Notes!.find((note) => item.ref === note)
    })
}*/

export function searchResult(inputKey:string){
    const output = idx.search(inputKey)
    return output;
}
