import fs from 'fs';
import path from 'path';
const NOTES_DIR = './notes';

if (!fs.existsSync(NOTES_DIR)) {
    fs.mkdirSync(NOTES_DIR);
}

// Datastore interface that implements 5 basic features
interface DataStore {
    Save(note: Note): DataStoreResult;
    Delete(id: string): DataStoreResult;
    Get(id: string): DataStoreResultWithData<Note | null>;
    GetAll(): DataStoreResultWithData<Array<string> | null>;
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

class SimpleDataStoreResult implements DataStoreResult {
    Success: boolean;

    constructor(success: boolean) {
        this.Success = success;
    }

    IsSuccess(): boolean {
        return this.Success;
    }
}

class SimpleDataStoreResultWithData<T> implements DataStoreResultWithData<T> {
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

/*
class SimpleDataStoreProvider implements DataStoreProvider {
    Create(): SimpleDataStore {
        return new SimpleDataStore();
    }
}


class SimpleDataStore implements DataStore {
    DataStore: {[id: string]: Note} = {};

    Save(note: Note): DataStoreResult {
        this.DataStore[note.id] = note;
        return new SimpleDataStoreResult(true);
    }

    Delete(id: string): DataStoreResult {
        if (id in this.DataStore) {
            delete this.DataStore[id];
            return new SimpleDataStoreResult(true);
        } else {
            return new SimpleDataStoreResult(false);
        }
    }

    Get(id: string): DataStoreResultWithData<Note | null> {
        if (id in this.DataStore) {
            const note = this.DataStore[id];
            return new SimpleDataStoreResultWithData(true, note);
        } else {
            return new SimpleDataStoreResultWithData(false, null);
        }
    }

    GetAll(): DataStoreResultWithData<Array<string> | null> {
        const notes = Object.keys(this.DataStore)
        return new SimpleDataStoreResultWithData(true, notes);
    } 
}
**/

class FileStoreProvider implements DataStoreProvider {
    Create(): FileStore {
        return new FileStore();
    }
}

class FileStore implements DataStore {
    Save(note: Note): DataStoreResult {
        const file = note.id + '.txt';
        fs.writeFileSync(path.join(NOTES_DIR, file), note.content);
        return new SimpleDataStoreResult(true);
    }

    Delete(id: string): DataStoreResult {
        const file = id;
        const res = path.join(NOTES_DIR, file);
        fs.unlinkSync(res);
        return new SimpleDataStoreResult(true);
    }

    Get(id: string): DataStoreResultWithData<Note | null> {
        const file = id + '.txt';
        const res = path.join(NOTES_DIR, file);
        if (!fs.existsSync(res)) {
            return new SimpleDataStoreResultWithData(false, null);
        } else {
            const data = fs.readFileSync(res, 'utf8');
            const note = new Note(id, data);
            return new SimpleDataStoreResultWithData(true, note);
        }
    }

    GetAll(): DataStoreResultWithData<Array<string> | null> {
        const notes = fs.readdirSync(NOTES_DIR);
        return new SimpleDataStoreResultWithData(true, notes);
    }
}

class Note {
    id: string;
    content: string;
    tags: Array<string>;

    constructor(id: string, content: string) {
        this.id = id;
        this.content = content;
        this.tags = [];
    }

    edit(content: string): void {
        this.content = content;
    }
} 

export {Note, FileStoreProvider}