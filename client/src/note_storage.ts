// Datastore interface that implements 5 basic features
interface DataStore {
    Save(note: Note): DataStoreResult;
    Delete(id: string): DataStoreResult;
    Get(id: string): DataStoreResultWithData<Note | null>;
    Create(id: string): DataStoreResult;
    GetAll(): Array<string>;
}

interface DataStoreProvider {
    Create(): DataStore;
}

interface DataStoreResult {
    IsSuccess(): boolean;
}

interface DataStoreResultWithData<T> extends DataStoreResult {
    GetResult(): T;
}

class inMemoryDataStoreResult implements DataStoreResult {
    Success: boolean;

    constructor(success: boolean) {
        this.Success = success;
    }

    IsSuccess(): boolean {
        return this.Success;
    }
}

class inMemoryDataStoreResultWithData<T> implements DataStoreResultWithData<T> {
    Success: boolean;
    Result: T;

    constructor(success: boolean, result: T) {
        this.Success = success;
        this.Result = result;
    }


    IsSuccess(): boolean {
        return this.Success;
    }

    GetResult(): T {
        return this.Result;
    }
}

// Simple data store class that uses a dictionary as the database
class SimpleDataStore implements DataStore {
    DataStore: {[iD: string]: Note} = {};

    Save(note: Note): DataStoreResult {
        this.DataStore[note.iD] = note;
        return new inMemoryDataStoreResult(true);
    }

    Delete(id: string): DataStoreResult {
        if (id in this.DataStore) {
            delete this.DataStore[id];
            return new inMemoryDataStoreResult(true);
        } else {
            return new inMemoryDataStoreResult(false);
        }
    }

    Get(id: string): DataStoreResultWithData<Note | null> {
        if (id in this.DataStore) {
            let note = this.DataStore[id];
            return new inMemoryDataStoreResultWithData(true, note);
        } else {
            return new inMemoryDataStoreResultWithData(false, null);
        }
    }

    Create(id: string): DataStoreResult {
        this.DataStore[id] = new Note(id);
        return new inMemoryDataStoreResult(true);
    }

    GetAll(): Array<string> {
        let notes = Object.keys(this.DataStore)
        return notes;
    } 
}


// Simple note class which stores the name as iD and the content of note as note
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

// Test class using simple data store
class Test {

    TestCreate(): boolean {
        let Database = new SimpleDataStore();
        Database.Create("Note_1");
        let id = "Note_1";
        return id in Database.DataStore;
    }

    TestSave(): void {
        let Database = new SimpleDataStore();
        let note = new Note("Note_1");
        Database.Create(note.iD);
        note.edit("Hello World!");
        Database.Save(note);
        let note2 = Database.DataStore[note.iD];
        console.log(note2.note);
    }

    TestDelete(): void {
        let Database = new SimpleDataStore();
        Database.Create("Note_1");
        let id = "Note_1";
        console.log(id in Database.DataStore);
        Database.Delete(id);
        console.log(id in Database.DataStore);
    }

    TestGet(): Note | null {
        let Database = new SimpleDataStore();
        let note = new Note("Note_1");
        Database.Create(note.iD);
        note.edit("Hello World!");
        Database.Save(note);
        let result = Database.Get(note.iD);
        return result.GetResult();
    }

    TestGetAll(): Array<string> {
        let Database = new SimpleDataStore();
        let note = new Note("Note_1");
        let note2 = new Note("Note_2");
        Database.Create(note.iD);
        Database.Create(note2.iD);
        return Database.GetAll();
    }
}

/* Tests
let t: Test = new Test();
t.TestCreate();
t.TestSave();
t.TestDelete();
t.TestGet();
t.TestGetAll();
*/

export {}