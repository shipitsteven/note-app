// Datastore interface that implements 5 basic features
interface DataStore {
    Save(note: Note): DataStoreResult;
    Delete(id: string): DataStoreResult;
    Get(id: string): DataStoreResultWithData<Note | null>;
    Create(id: string, author: string): DataStoreResult;
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

class SimpleDataStoreProvider implements DataStoreProvider {
    Create(): SimpleDataStore {
        return new SimpleDataStore();
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
            const note = this.DataStore[id];
            return new inMemoryDataStoreResultWithData(true, note);
        } else {
            return new inMemoryDataStoreResultWithData(false, null);
        }
    }

    Create(id: string, author: string): DataStoreResult {
        this.DataStore[id] = new Note(id, author);
        return new inMemoryDataStoreResult(true);
    }

    GetAll(): Array<string> {
        const notes = Object.keys(this.DataStore)
        return notes;
    } 
}


// Simple note class which stores the name as iD and the content of note as note
export class Note {
    iD: string;
    note: string;
    author: string;

    constructor(iD: string, author: string) {
        this.iD = iD;
        this.note = "";
        this.author = author;
    }

    edit(text: string): void {
        this.note = text;
    }
} 

// Test class using simple data store
class Test {

    TestCreate(): boolean {
        const DataStoreProvider = new SimpleDataStoreProvider();
        const Database = DataStoreProvider.Create();
        Database.Create("Note_1", "Bob");
        const id = "Note_1";
        return id in Database.DataStore;
    }

    TestSave(): void {
        const DataStoreProvider = new SimpleDataStoreProvider();
        const Database = DataStoreProvider.Create();
        const note = new Note("Note_1", "Bob");
        Database.Create(note.iD, note.author);
        note.edit("Hello World!");
        Database.Save(note);
        const note2 = Database.DataStore[note.iD];
        console.log(note2.note);
    }

    TestDelete(): void {
        const DataStoreProvider = new SimpleDataStoreProvider();
        const Database = DataStoreProvider.Create();
        Database.Create("Note_1", "Bob");
        const id = "Note_1";
        console.log(id in Database.DataStore);
        Database.Delete(id);
        console.log(id in Database.DataStore);
    }

    TestGet(): Note | null {
        const DataStoreProvider = new SimpleDataStoreProvider();
        const Database = DataStoreProvider.Create();
        const note = new Note("Note_1", "Jack");
        Database.Create(note.iD, note.author);
        note.edit("Hello World!");
        Database.Save(note);
        const result = Database.Get(note.iD);
        return result.GetResult();
    }

    TestGetAll(): Array<string> {
        const DataStoreProvider = new SimpleDataStoreProvider();
        const Database = DataStoreProvider.Create();
        const note = new Note("Note_1", "Bill");
        const note2 = new Note("Note_2", "Steve");
        Database.Create(note.iD, note.author);
        Database.Create(note2.iD, note2.author);
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