import {searchResult} from './simpleSearch'
import { string } from 'prop-types';

interface tags{
    name:string
    color?:string
}

export function checkTags(){
    const searchTag = '#'
    const tags:tags[] = [];
    let newTagList:string[]=[];

    const filterItems = (arr:any, query:string) => {
        return arr.filter(e => e.toLowerCase().indexOf(query.toLowerCase()) !== -1)
    }

    function onlyUnique(value:string, index:number, self:string[]){
        return self.indexOf(value) === index;
    }

    //search for notes with tags
    const noteWithTag = searchResult(searchTag)

    //get all the tags are exist now
    for(let i = 0; i < noteWithTag.length;i++){
        const temp = noteWithTag[i].content.split(/[\s]/)
        newTagList.push(filterItems(temp, searchTag))
    }
    newTagList = newTagList.flat()
    newTagList = newTagList.filter(onlyUnique)
    for(let i = 0; i < newTagList.length;i++){
        newTagList[i] = newTagList[i].slice(1,)
    }
    newTagList = newTagList.filter(e=>e.length>0)

    const result = newTagList.map(e =>{
        return{
            name:e,
            color:'#'+ Math.floor(Math.random()*16777215).toString(16)
        }
    })

    const newTags = Object.assign(tags, result)
    return newTags
}
