import { Note, FileStoreProvider } from './note_storage';
import fs from 'fs';
import path from 'path';
const NOTES_DIR = './notes';
const NOTE_APP_DIR = './.noteapp';
const metadata = path.join(NOTE_APP_DIR, 'metadata.json');

if (!fs.existsSync(NOTE_APP_DIR)) {
    fs.mkdirSync(NOTE_APP_DIR);
    fs.writeFileSync(metadata, '');
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
            const res = this.FileStore.Save(note);
            if (res.IsSuccess()) {
                const data = JSON.stringify(note.id);
                fs.writeFileSync(metadata, data);
                // replace these print statements with UI method calls
                console.log('Successfully Saved Note');
                return new SimpleNoteAccessResult(true);
            } else {
                console.log('Could Not Save Note');
                return new SimpleNoteAccessResult(false);
            }
        } else {
            console.log('Invalid Note');
            return new SimpleNoteAccessResult(false);
        }
    }

    Delete(id: string): NoteAccessResult {
        if (this.ValidateName(id).IsSuccess()) {
            const res = this.FileStore.Delete(id);
            if (res.IsSuccess()) {
                // replace these print statement with UI method calls
                console.log('Successfully Deleted Note');
                return new SimpleNoteAccessResult(true);
            } else {
                console.log('Could Not Delete Note');
                return new SimpleNoteAccessResult(false);
            }
        } else {
            console.log('Note With That Name Does Not Exist');
            return new SimpleNoteAccessResult(false);
        }
    }

    Get(id: string): NoteAccessResultWithNote<Note | null> {
        if (this.ValidateName(id).IsSuccess()) {
            const note = this.FileStore.Get(id);
            if (note.IsSuccess()) {
                // replace these print statement with UI method calls
                console.log('Successfully Retrieved Note');
                return new SimpleNoteAccessResultWithNote(true, note.GetResult());
            } else {
                console.log('Could Not Retrieve Note');
                return new SimpleNoteAccessResultWithNote(false, null);
            }
        } else {
            console.log('Note With That Name Does Not Exist');
            return new SimpleNoteAccessResultWithNote(false, null);
        }
    }

    AddTag(id: string, tag: string): NoteAccessResult {
        if (this.ValidateName(id).IsSuccess()) {
            const res = this.FileStore.Get(id);
            if (res.IsSuccess()) {
                const note = res.GetResult()!;
                note.tags.push(tag);
                // replace these print statement with UI method calls
                console.log('Successfully Added Tag');
                return new SimpleNoteAccessResult(true);
            } else {
                console.log('Could Not Added Tag');
                return new SimpleNoteAccessResult(false);
            } 
        } else {
            console.log('Note Does Not Exist');
            return new SimpleNoteAccessResult(false);
        }
    }
}

export {SimpleNotesProvider}