import {Note} from './note_storage';
import lunr from 'lunr';
const fs = window.require('fs');
import path from 'path'
import { string } from 'prop-types';
const allFiles = [];


/*const DataStoreProvider = new FileStoreProvider();
const Database = DataStoreProvider.Create();
const Notes = Database.GetAll().GetResult();
const something = Database.Get(Notes![0]).GetResult()
/*const myJson = JSON.stringify(something)
const obj = JSON.parse(myJson)*/
const damn = [{
    id:"string",
    title:"string",
    content:"string"
}]



const getAllFiles = function(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath)

    files.forEach(function(file) {
      if (fs.statSync(dirPath + "/" + file).isDirectory()) {
        getAllFiles(dirPath + "/" + file, arrayOfFiles)
      } else {
        const temp = path.join(dirPath, file)
        const data = fs.readFileSync(temp, 'utf8');
        const note = new Note(file, data);
        arrayOfFiles = [{
            id:dirPath,
            title:note.id,
            content:note.content
        }]
        damn.push(arrayOfFiles)
      }
    })

    return arrayOfFiles
  }
const result = getAllFiles("./notes",allFiles)
console.log(damn)

export function searchResult(key:string){

    const idx = lunr(function(){

        this.field("title");
        this.field("content");

        for (let i = 0; i < damn.length; i++) {
            this.add(damn[i])
        }
    })

    function searchPosts(query) {
        const result = idx.search(query)

        return result.map((item) => {
            return damn.find((post) => item.ref === post.id)
        })
    }

    const output = searchPosts(key)
    console.log(output);
}


