import path from 'path';
import { NoteMetadata } from './note_metadata';
import isElectron from 'is-electron';
const fs = isElectron() ? window.require('fs') : require('fs');
const NOTE_APP_DIR = './.noteapp';
const metadata = path.join(NOTE_APP_DIR, 'metadata.json');

interface NoteMetaData {
    Create(): NoteMetaDataResult;
    Add(noteData: NoteMetadata): NoteMetaDataResult;
    Delete(id: string): NoteMetaDataResult;
    Get(id: string): NoteMetaDataResultWithData<NoteMetadata | null>;
}

interface NoteMetaDataProvider {
    Create(): NoteMetaData;
}

interface NoteMetaDataResult {
    IsSuccess(): boolean;
}

interface NoteMetaDataResultWithData<T> extends NoteMetaDataResult {
    GetResult(): T;
}

class SimpleNoteMetaDataResult implements NoteMetaDataResult {
    Success: boolean;

    constructor(success: boolean) {
        this.Success = success;
    }

    IsSuccess(): boolean {
        return this.Success;
    }
}

class SimpleNoteMetaDataResultWithData<T> implements NoteMetaDataResultWithData<T> {
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

class SimpleNoteMetaDataProvider implements NoteMetaDataProvider {
    Create(): MetaDataAccess {
        return new MetaDataAccess();
    }
}

class MetaDataAccess implements NoteMetaData {
    Create(): NoteMetaDataResult {
        const dict = {};
        const writeDict = JSON.stringify(dict);
        fs.writeFileSync(metadata, writeDict);
        return new SimpleNoteMetaDataResult(true);
    }

    Add(noteData: NoteMetadata): NoteMetaDataResult {
        const readData = fs.readFileSync(metadata, 'utf8');
        const data: NoteMetadata = JSON.parse(readData);
        data[noteData.id] = noteData;
        const writeData = JSON.stringify(data, null, 2);
        fs.writeFileSync(metadata, writeData);
        return new SimpleNoteMetaDataResult(true);
    }

    Delete(id: string): NoteMetaDataResult {
        const readData = fs.readFileSync(metadata, 'utf8');
        const data: NoteMetadata = JSON.parse(readData);
        if (id in data) {
            delete data[id];
            const writeData = JSON.stringify(data, null, 2);
            fs.writeFileSync(metadata, writeData);
            return new SimpleNoteMetaDataResult(true);
        } else {
            return new SimpleNoteMetaDataResult(false);
        }
    }

    Get(id: string): NoteMetaDataResultWithData<NoteMetadata | null> {
        const readData = fs.readFileSync(metadata, 'utf8');
        const data: NoteMetadata = JSON.parse(readData);
        if (id in data) {
            const noteMetadata = data[id];
            return new SimpleNoteMetaDataResultWithData(true, noteMetadata);
        } else {
            return new SimpleNoteMetaDataResultWithData(false, null);
        }
    }

}

export {SimpleNoteMetaDataProvider}