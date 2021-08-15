import path from 'path';
import isElectron from 'is-electron';
const fs = isElectron() ? window.require('fs') : require('fs');
const NOTES_DIR = './notes';

if (!fs.existsSync(NOTES_DIR)) {
    fs.mkdirSync(NOTES_DIR);
}

// Datastore interface that implements 5 basic features
export interface DataStore {
    Save(note: Note): DataStoreResult;
    Delete(id: string): DataStoreResult;
    Get(id: string): DataStoreResultWithData<Note | null>;
    GetAll(): DataStoreResultWithData<Array<string>>;
    GetAllNotes(): DataStoreResultWithData<Array<Note>>;
}

export interface DataStoreProvider {
    Create(): DataStore;
}

export interface DataStoreResult {
    IsSuccess(): boolean;
}

export interface DataStoreResultWithData<T> extends DataStoreResult {
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

export class FileStore implements DataStore {
    NoteRoot: string;

    constructor(noteRoot = "./") {
        this.NoteRoot = noteRoot;
    }

    Save(note: Note): DataStoreResult {
        fs.writeFileSync(note.id, note.content);
        return new SimpleDataStoreResult(true);
    }

    Delete(id: string): DataStoreResult {
        const file = id;
        const res = path.join(NOTES_DIR, file);
        fs.unlinkSync(res);
        return new SimpleDataStoreResult(true);
    }

    Get(id: string): DataStoreResultWithData<Note> {
        if (!fs.existsSync(id)) {
            return new SimpleDataStoreResultWithData(false, new Note(id));
        } else {
            const data = fs.readFileSync(id, 'utf8');
            const note = new Note(id, data);
            return new SimpleDataStoreResultWithData(true, note);
        }
    }

    GetAll(): DataStoreResultWithData<Array<string>> {
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

    GetAllNotes(): DataStoreResultWithData<Array<Note>> {
        const files: string[] = this.GetAll().GetResult();

        const notes = new Array<Note>();
        files.forEach(element => {
            notes.push(this.Get(element).GetResult())
        });

        return new SimpleDataStoreResultWithData<Array<Note>>(true, notes);
    }
}

export class Note {
    id: string;
    content: string;
    tags: Array<string>;

    constructor(id: string, content = "") {
        this.id = id;
        this.content = content;
        this.tags = [];
    }

    edit(content: string): void {
        this.content = content;
    }
}
