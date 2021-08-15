import path from 'path';
import isElectron from 'is-electron';
const fs = isElectron() ? window.require('fs') : require('fs');
const NOTES_DIR = './notes';

if (!fs.existsSync(NOTES_DIR)) {
    fs.mkdirSync(NOTES_DIR);
}

// Datastore interface that implements 5 basic features
interface DataStore {
    Save(id: string, content: string): DataStoreResult;
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

class FileStoreProvider implements DataStoreProvider {
    Create(): FileStore {
        return new FileStore();
    }
}

class FileStore implements DataStore {
    Save(id: string, content: string): DataStoreResult {
        fs.writeFileSync(id, content);
        return new SimpleDataStoreResult(true);
    }

    Delete(id: string): DataStoreResult {
        const file = id;
        const res = path.join(NOTES_DIR, file);
        fs.unlinkSync(res);
        return new SimpleDataStoreResult(true);
    }

    Get(id: string): DataStoreResultWithData<Note | null> {
        if (!fs.existsSync(id)) {
            return new SimpleDataStoreResultWithData(false, null);
        } else {
            const data = fs.readFileSync(id, 'utf8');
            const note = new Note(id, data);
            return new SimpleDataStoreResultWithData(true, note);
        }
    }

    GetAll(): DataStoreResultWithData<Array<string> | null> {
        function rreaddirSync (dir: string, allFiles: string[] = []): string[] {
            const files = fs.readdirSync(dir).map(f => path.join(dir, f))
            allFiles.push(...files)
            files.forEach(f => {
              fs.statSync(f).isDirectory() && rreaddirSync(f, allFiles)
            })
            return allFiles.filter(f=> !fs.statSync(f).isDirectory())
        }
        const notes = rreaddirSync(NOTES_DIR);
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