import { Note, SimpleDataStoreProvider } from './note_storage';

// Business logic interface
interface NoteAccess {
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

class SimpleNoteAccess implements NoteAccess {

    DataStoreProvider = new SimpleDataStoreProvider();
    SimpleDataStore = this.DataStoreProvider.Create();

    ValidateText(text: string): NoteAccessResult {
        if (text) {
            return new SimpleNoteAccessResult(true);
        } else {
            return new SimpleNoteAccessResult(false);
        }
    }

    ValidateName(name: string): NoteAccessResult {
        if (name in this.SimpleDataStore.GetAll()) {
            return new SimpleNoteAccessResult(false);
        } else {
            return new SimpleNoteAccessResult(true);
        }
    }

    ValidateNote(note: Note): NoteAccessResult {
        if (note.id in this.SimpleDataStore.GetAll()) {
            return new SimpleNoteAccessResult(true);
        } else {
            return new SimpleNoteAccessResult(false);
        }
    }

    Create(id: string): NoteAccessResult {
        if (this.ValidateName(id).IsSuccess()) {
            const res = this.SimpleDataStore.Create(id);
            if (res.IsSuccess()) {
                //replace these print statements with UI method calls
                console.log('Successfully Created Note');
                return new SimpleNoteAccessResult(true);
            } else {
                console.log('Could Not Create Note');
                return new SimpleNoteAccessResult(false);
            }
        } else {
            console.log('Name Already Exists');
            return new SimpleNoteAccessResult(false);
        }
    }

    Save(note: Note): NoteAccessResult {
        if (this.ValidateText(note.content).IsSuccess()) {
            const res = this.SimpleDataStore.Save(note);
            if (res.IsSuccess()) {
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
            const res = this.SimpleDataStore.Delete(id);
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
            const note = this.SimpleDataStore.Get(id);
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
}