import { Note, FileStoreProvider } from './note_storage';
import { NoteMetadata } from './note_metadata';
import { SimpleNoteMetaDataProvider } from './metadata_create';
import path from 'path';
import isElectron from 'is-electron';
const fs = isElectron() ? window.require('fs') : require('fs');
const NOTE_APP_DIR = './.noteapp';
const metadata = path.join(NOTE_APP_DIR, 'metadata.json');

if (!fs.existsSync(NOTE_APP_DIR)) {
    fs.mkdirSync(NOTE_APP_DIR);
    fs.writeFileSync(metadata, '');
    const MetaDataProvider = new SimpleNoteMetaDataProvider();
    const MetaDataStore = MetaDataProvider.Create();
    MetaDataStore.Create();
}

// Business logic interface
interface NoteAccess {
    Save(note: Note): NoteAccessResult;
    Delete(id: string): NoteAccessResult;
    Get(id: string): NoteAccessResultWithNote<Note | null>;
    AddTag(id: string, tag: string): NoteAccessResult;
}

interface NoteAccessProvider {
    Create(): NoteAccess;
}

interface NoteAccessResult {
    IsSuccess(): boolean;
}

interface NoteAccessResultWithNote<T> extends NoteAccessResult {
    GetResult(): T;
}

class SimpleNoteAccessResult implements NoteAccessResult {
    Success: boolean;

    constructor(success: boolean) {
        this.Success = success;
    }

    IsSuccess(): boolean {
        return this.Success;
    }
}

class SimpleNoteAccessResultWithNote<T> implements NoteAccessResultWithNote<T> {
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

class SimpleNotesProvider implements NoteAccessProvider {
    Create(): SimpleNoteAccess {
        return new SimpleNoteAccess();
    }
}

class SimpleNoteAccess implements NoteAccess {

    DataStoreProvider = new FileStoreProvider();
    FileStore = this.DataStoreProvider.Create();
    MetaDataProvider = new SimpleNoteMetaDataProvider();
    MetaDataStore = this.MetaDataProvider.Create();

    ValidateText(text: string): NoteAccessResult {
        if (text) {
            return new SimpleNoteAccessResult(true);
        } else {
            return new SimpleNoteAccessResult(false);
        }
    }

    ValidateName(name: string): NoteAccessResult {
        if (name in this.FileStore.GetAll()) {
            return new SimpleNoteAccessResult(false);
        } else {
            return new SimpleNoteAccessResult(true);
        }
    }

    ValidateNote(note: Note): NoteAccessResult {
        if (note.id in this.FileStore.GetAll()) {
            return new SimpleNoteAccessResult(true);
        } else {
            return new SimpleNoteAccessResult(false);
        }
    }

    Save(note: Note): NoteAccessResult {
        if (this.ValidateText(note.content).IsSuccess()) {
            const res = this.FileStore.Save(note.id, note.content);
            if (res.IsSuccess()) {
                const MetaDataProvider = new SimpleNoteMetaDataProvider;
                const data = MetaDataProvider.Create();
                if (data.Get(note.id).GetResult() === null) {
                    console.log(note.id);
                    const noteData = new NoteMetadata(note.id, note.tags);
                    this.MetaDataStore.Add(noteData);
                } else {
                    const noteData = data.Get(note.id).GetResult()!;
                    noteData.date_edited = new Date().toISOString();
                    this.MetaDataStore.Add(noteData!);
                }
                return new SimpleNoteAccessResult(true);
            } else {
                return new SimpleNoteAccessResult(false);
            }
        } else {
            // Invalid note.
            return new SimpleNoteAccessResult(false);
        }
    }

    Delete(id: string): NoteAccessResult {
        if (this.ValidateName(id).IsSuccess()) {
            const res = this.FileStore.Delete(id);
            if (res.IsSuccess()) { 
                return new SimpleNoteAccessResult(true);
            } else {
                return new SimpleNoteAccessResult(false);
            }
        } else {
            // Note with that name does not exist.
            return new SimpleNoteAccessResult(false);
        }
    }

    Get(id: string): NoteAccessResultWithNote<Note | null> {
        if (this.ValidateName(id).IsSuccess()) {
            const note = this.FileStore.Get(id);
            if (note.IsSuccess()) {
                return new SimpleNoteAccessResultWithNote(true, note.GetResult());
            } else {
                return new SimpleNoteAccessResultWithNote(false, null);
            }
        } else {
            // Note with that name does not exist.
            return new SimpleNoteAccessResultWithNote(false, null);
        }
    }

    AddTag(id: string, tag: string): NoteAccessResult {
        if (this.ValidateName(id).IsSuccess()) {
            const res = this.FileStore.Get(id);
            if (res.IsSuccess()) {
                const note = res.GetResult()!;
                note.tags.push(tag);
                return new SimpleNoteAccessResult(true);
            } else {
                return new SimpleNoteAccessResult(false);
            } 
        } else {
            // Note does not exist.
            return new SimpleNoteAccessResult(false);
        }
    }
}

export {SimpleNotesProvider}