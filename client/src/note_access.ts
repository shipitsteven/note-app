import { Note, SimpleDataStore } from './note_storage';

interface NoteAccess {
    ValidateText(text: string): NoteAccessResult;
    ValidateName(name: string): NoteAccessResult;
    ValidateNote(note: Note): NoteAccessResult;
    ValidateUser(user: User): NoteAccessResult;
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

class inMemoryNoteAccessResultWithNote<T> implements NoteAccessResultWithNote<T> {
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
    ValidateText(text: string): NoteAccessResult {
        if (text) {
            return new inMemoryNoteAccessResult(true);
        } else {
            return new inMemoryNoteAccessResult(false);
        }
    }

    ValidateName(name: string): NoteAccessResult {
        if (name in SimpleDataStore.GetAll()) {
            return new inMemoryNoteAccessResult(false);
        } else {
            return new inMemoryNoteAccessResult(true);
        }
    }

    ValidateNote(note: Note): NoteAccessResult {
        if (Note.id in SimpleDataStore.GetAll()) {
            return new inMemoryNoteAccessResult(true);
        } else {
            return new inMemoryNoteAccessResult(false);
        }
    }

    ValidateUser(user: User): NoteAccessResult {
        if (user) {
            return new inMemoryNoteAccessResult(true);
        } else {
            return new inMemoryNoteAccessResult(false);
        }    
    }

    Create(id: string): NoteAccessResult {
        if (this.ValidateName(id).IsSuccess()) {
            const res = SimpleDataStore.Create(id, User.name);
            if (res.IsSuccess()) {
                //replace these print statements with UI method calls
                console.log('Successfully Created Note');
                return new inMemoryNoteAccessResult(true);
            } else {
                console.log('Could Not Create Note');
                return new inMemoryNoteAccessResult(false);
            }
        } else {
            console.log('Name Already Exists');
            return new inMemoryNoteAccessResult(false);
        }
    }

    Save(note: Note): NoteAccessResult {
        if (this.ValidateText(note.note).IsSuccess()) {
            if (this.ValidateUser(note.author).IsSuccess()) {
                const res = SimpleDataStore.Save(note);
                if (res.IsSuccess()) {
                    // replace these print statements with UI method calls
                    console.log('Successfully Saved Note');
                    return new inMemoryNoteAccessResult(true);
                } else {
                    console.log('Could Not Save Note');
                    return new inMemoryNoteAccessResult(false);
                }
            } else {
                console.log('Invalid User/Create Account');
                return new inMemoryNoteAccessResult(false);
            }
        } else {
            console.log('Invalid Note');
            return new inMemoryNoteAccessResult(false);
        }
    }

    Delete(id: string): NoteAccessResult {
        if (this.ValidateName(id).IsSuccess()) {
            const res = SimpleDataStore.Delete(id);
            if (res.IsSuccess()) {
                // replace these print statement with UI method calls
                console.log('Successfully Deleted Note');
                return new inMemoryNoteAccessResult(true);
            } else {
                console.log('Could Not Delete Note');
                return new inMemoryNoteAccessResult(false);
            }
        } else {
            console.log('Note With That Name Does Not Exist');
            return new inMemoryNoteAccessResult(false);
        }
    }

    Get(id: string): NoteAccessResultWithNote<Note | null> {
        if (this.ValidateName(id).IsSuccess()) {
            const note: Note | null = SimpleDataStore.Get(id);
            if (note.IsSuccess()) {
                // replace these print statement with UI method calls
                console.log('Successfully Retrieved Note');
                return new inMemoryNoteAccessResultWithNote(true, note.GetResult());
            } else {
                console.log('Could Not Retrieve Note');
                return new inMemoryNoteAccessResultWithNote(false, null);
            }
        } else {
            console.log('Note With That Name Does Not Exist');
            return new inMemoryNoteAccessResultWithNote(false, null);
        }
    }

    class User {
        
    }
}