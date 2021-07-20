import { Note, SimpleDataStore } from './note_storage';

interface NoteAccess {
    Validate(text: string): NoteAccessResult;
    Validate(user: User): NoteAccessResult;
    Create(id: string): NoteAccessResult;
    Save(note: Note): NoteAccessResult;
    Delete(id: string): NoteAccessResult;
    Get(id: string): NoteAccessResultWithNote<Note | null>;
}

interface NoteAccessResult {
    IsSuccess(): boolean;
}

interface NoteAccessResultWithNote<T> extends NoteAccessResult {
    GetResult(): T;
}

class inMemoryNoteAccessResult implements NoteAccessResult {
    Success: boolean;

    constructor(success: boolean) {
        this.Success = success;
    }

    IsSuccess(): boolean {
        return this.Success;
    }
}

class SimpleNoteAccess implements NoteAccess {
    Validate(text: string): NoteAccessResult {
        if (text) {
            return new inMemoryNoteAccessResult(true);
        } else {
            return new inMemoryNoteAccessResult(false);
        }
    }

    Validate(user: User): NoteAccessResult {
        if (user) {
            return new inMemoryNoteAccessResult(true);
        } else {
            return new inMemoryNoteAccessResult(false);
        }    
    }

    Save(note: Note): NoteAccessResult {
        if (this.Validate(note.note).IsSuccess()) {
            if (this.Validate(note.author).IsSuccess()) {
                SimpleDataStore.Save(note);
                // replace these print statements with UI method calls
                console.log('Successfully Saved Note');
                return new inMemoryNoteAccessResult(true);
            } else {
                console.log('Invalid User/Create Account');
                return new inMemoryNoteAccessResult(false);
            }
        } else {
            console.log('Invalid Note');
            return new inMemoryNoteAccessResult(false);
        }
    }
}