import { Note } from './note_storage';

interface NoteAccess {
    Create(id: string): NoteAccessResult;
    Update(note: Note): NoteAccessResult;
    Delete(id: string): NoteAccessResult;
    Get(id: string): NoteAccessResultWithNote<Note | null>;
}

interface NoteAccessResult {
    IsSuccess(): boolean;
}

interface NoteAccessResultWithNote<T> extends NoteAccessResult {
    GetResult(): T;
}