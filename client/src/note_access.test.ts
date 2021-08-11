import {Note} from './note_storage';
import {SimpleNotesProvider} from './note_access';
import path from 'path';

const NOTE_APP_DIR = './.noteapp';
const metadata = path.join(NOTE_APP_DIR, 'metadata.json');

test('tests saving file to filesystem and checks for metadata creation', () => {
    const NoteAccessProvider = new SimpleNotesProvider();
    const NoteAccess = NoteAccessProvider.Create();
    const note = new Note('hello', 'hi');
    NoteAccess.Save(note);
    const note2 = new Note('foo', 'hello');
    NoteAccess.Save(note2);
    const note3 = new Note('bar', 'bad');
    NoteAccess.Save(note3);
})

