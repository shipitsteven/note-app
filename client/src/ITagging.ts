
interface tagFunction{
    add(tag:Tag, id:Note):TagResult;
    delete(id:string):TagResult;
    //update(tag:Tag,id:Note):TagResult;
    get(id:string):TagResultWithData<Tag|null>
}

interface TagProvider{
    Create():tagFunction;
}

interface TagResult{
    isSuccess():boolean;
}

interface TagResultWithData<T>extends TagResult{
    GetResult():T;
}

class inMemoryResult implements TagResult{
    Success:boolean;

    constructor(success:boolean){
        this.Success = success;
    }

    isSuccess():boolean{
        return this.Success;
    }
}

class inMemoryDataResult<T> implements TagResultWithData<T>{
    Success:boolean;
    Result:T;

    constructor(success:boolean, result:T){
        this.Success = success;
        this.Result = result;
    }

    isSuccess():boolean{
        return this.Success;
    }

    GetResult():T{
        return this.Result;
    }
}

class SimpleTagFunction implements tagFunction{
    tagFunction:{[iD:string]:Tag} = {};

    add(tag:Tag, id:Note):TagResult{
        this.tagFunction[id.iD] = tag;
        return new inMemoryResult(true);
    }

    delete(id:string):TagResult{
        if(id in this.tagFunction){
            delete this.tagFunction[id];
            return new inMemoryResult(true);
        }else{
            return new inMemoryResult(false);
        }
    }

    /*update(tag:Tag,id:Note):TagResult{
        if(id.iD in this.tagFunction){
            delete this.tagFunction[id.iD];
            this.tagFunction[id.iD] = tag;
            return new inMemoryResult(true);
        }else {
            return new inMemoryResult(false);
        }
    }*/

    get(id:string):TagResultWithData<Tag|null>{
        if(id in this.tagFunction){
            let tag = this.tagFunction[id];
            return new inMemoryDataResult(true, tag);
        }else{
            return new inMemoryDataResult(false, null);
        }
    }
}

class Tag{
    label:string;
    color:string;

    constructor(label: string){
        this.label=label;
        this.color = 'white';
    }

    changeColor(color:string){
        this.color = color;
    }

    editLabel(label:string){
        this.label = label;
    }
}

class Note {
    iD: string;
    note: string;

    constructor(iD: string) {
        this.iD = iD;
        this.note = "";
    }

    edit(text: string) {
        this.note = text;
    }
}

class Test{
    TestAdd():void{
        let tagFunction = new SimpleTagFunction();
        let note = new Note('Note_1');
        let tag = new Tag('Math');
        tag.changeColor('red');
        tag.editLabel('art');
        tagFunction.add(tag,note);
        let tag2 = tagFunction.tagFunction[note.iD];
        console.log(tag2.label);
    }

    TestDelete():void{
        let tagFunction = new SimpleTagFunction();
        let note = new Note('Note_1');
        let id = 'Note_1';
        let tag = new Tag('Math');
        tag.changeColor('red');
        tag.editLabel('art');
        tagFunction.add(tag,note);
        console.log(id in tagFunction.tagFunction);
        tagFunction.delete(id);
        console.log(id in tagFunction.tagFunction);
    }

    TestGet():Tag|null{
        let tagFunction = new SimpleTagFunction();
        let note = new Note('Note_1');
        let tag = new Tag('Math');
        tag.changeColor('red');
        tag.editLabel('art');
        tagFunction.add(tag,note);
        let result = tagFunction.get(note.iD);
        return result.GetResult();
    }
}

let t: Test = new Test();
t.TestAdd();
t.TestDelete();
t.TestGet();

export {}