import { Note } from './note_access';
import fs from 'fs';
import path from 'path';
const NOTE_DIR = './notes';

if (!fs.existsSync(NOTE_DIR)) {
    fs.mkdirSync(NOTE_DIR);
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

class SimpleDataStoreProvider implements DataStoreProvider {
    Create(): SimpleDataStore {
        return new SimpleDataStore();
    }
}

// Simple data store class that uses a dictionary as the database
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

class FileStore implements DataStore {
    Save(note: Note): DataStoreResult {
        const file = note.id + '.txt';
        fs.writeFile(path.join(NOTE_DIR, file), note.content, function(err) {
            if (err) {
                return new SimpleDataStoreResult(false);
            }
            console.log("File created!");
        });
        return new SimpleDataStoreResult(true);
    }

    Delete(id: String): DataStoreResult {
        const file = id + '.txt';
        const res = path.join(NOTE_DIR, file);
        fs.unlink(res, function(err) {
            if (err) {
                return new SimpleDataStoreResult(false);
            }
            console.log("File deleted!");
        });
        return new SimpleDataStoreResult(true);
    }

    
}

export {SimpleDataStoreProvider}