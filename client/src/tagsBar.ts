import {searchResult} from './simpleSearch'
import { string } from 'prop-types';

interface tags{
    name:string
    color?:string
}

export function checkTags(){
    const searchTag = '#tag'
    const tags:tags[] = [];
    let newTagList:string[]=[];

    const filterItems = (arr:any, query:string) => {
        return arr.filter(el => el.toLowerCase().indexOf(query.toLowerCase()) !== -1)
    }

    function onlyUnique(value:string, index:number, self:string[]){
        return self.indexOf(value) === index;
    }

    //search for notes with tags
    const noteWithTag = searchResult(searchTag)

    //get the all the tags are exist now(new tag list)
    for(let i = 0; i < noteWithTag.length;i++){
        const temp = noteWithTag[i].content.split(/[\s]/)
        newTagList.push(filterItems(temp, searchTag))
    }
    newTagList = newTagList.flat()
    newTagList = newTagList.filter(onlyUnique)
    for(let i = 0; i < newTagList.length;i++){
        newTagList[i] = newTagList[i].slice(4,)
    }

    // compare old and new tag list
    const result = newTagList.map(e =>{
        return{
            name:e,
            color:'#'+ Math.floor(Math.random()*16777215).toString(16)
        }
    })

    const newTags = Object.assign(tags, result)

    return newTags
}
