import {FileStoreProvider, Note} from './note_storage';
import path from 'path';
import fs from 'fs';

const NOTES_DIR = './notes';

test('tests saving note to file system', () => {
    const DataStoreProvider = new FileStoreProvider();
    const FileStore = DataStoreProvider.Create();
    const note = new Note('hello', '');
    const id = 'hello.txt';
    const file = path.join(NOTES_DIR, id);
    expect(fs.existsSync(file)).toBe(false);
    FileStore.Save(note);
    expect(fs.existsSync(file)).toBe(true);
    fs.unlinkSync(file);
})

test('tests getting a list of all notes from the datastore', () => {
    const DataStoreProvider = new FileStoreProvider();
    const Database = DataStoreProvider.Create();
    const note = new Note("foo", "");
    const note2 = new Note("bar", "");
    Database.Save(note);
    Database.Save(note2);
    let keys = ['bar.txt', 'foo.txt'];
    const result = Database.GetAll().GetResult()!;
    expect(result).toMatchObject(keys);
    fs.unlinkSync(path.join(NOTES_DIR, 'bar.txt'));
    fs.unlinkSync(path.join(NOTES_DIR, 'foo.txt'));
})

test('tests deleting a note from the file system', () => {
    const DataStoreProvider = new FileStoreProvider();
    const FileStore = DataStoreProvider.Create();
    const note = new Note('hello', '');
    const id = "hello.txt";
    const file = path.join(NOTES_DIR, id);
    FileStore.Save(note);
    expect(fs.existsSync(file)).toBe(true);
    FileStore.Delete(id);
    expect(fs.existsSync(file)).toBe(false);
})

test('tests getting a note from the datastore', () => {
    const DataStoreProvider = new FileStoreProvider();
    const FileStore = DataStoreProvider.Create();
    const note = new Note('bob', 'My name is Bob.');
    FileStore.Save(note);
    const result = FileStore.Get('bob').GetResult()!;
    expect(result).toBeInstanceOf(Note);
    expect(result.content).toEqual('My name is Bob.');
    fs.unlinkSync(path.join(NOTES_DIR, 'bob.txt'));
})

export {}