import {SimpleDataStoreProvider, Note} from './note_storage';

test('tests creating note adds id to datastore', () => {
    const DataStoreProvider = new SimpleDataStoreProvider();
    const Database = DataStoreProvider.Create();
    Database.Create("Note_1");
    const id = "Note_1";
    expect(id in Database.DataStore).toBe(true);
})

test('tests saving a note to the datastore', () => {
    const DataStoreProvider = new SimpleDataStoreProvider();
    const Database = DataStoreProvider.Create();
    const note = new Note("Note_1");
    Database.Create(note.id);
    note.edit("Hello World!");
    Database.Save(note);
    const note2 = Database.DataStore[note.id];
    expect(note2.content).toEqual('Hello World!');
})

test('tests deleting a note from the datastore', () => {
    const DataStoreProvider = new SimpleDataStoreProvider();
    const Database = DataStoreProvider.Create();
    Database.Create("Note_1");
    const id = "Note_1";
    expect(id in Database.DataStore).toBe(true);
    Database.Delete(id);
    expect(id in Database.DataStore).toBe(false);
})

test('tests getting a note from the datastore', () => {
    const DataStoreProvider = new SimpleDataStoreProvider();
    const Database = DataStoreProvider.Create();
    const note = new Note("Note_1");
    Database.Create(note.id);
    note.edit("Hello World!");
    Database.Save(note);
    const result = Database.Get(note.id).GetResult()!;
    expect(result).toBeInstanceOf(Note);
    expect(result.content).toEqual('Hello World!');
})

test('tests getting a list of all notes from the datastore', () => {
    const DataStoreProvider = new SimpleDataStoreProvider();
    const Database = DataStoreProvider.Create();
    const note = new Note("Note_1");
    const note2 = new Note("Note_2");
    Database.Create(note.id);
    Database.Create(note2.id);
    let keys = ['Note_1', 'Note_2'];
    const result = Database.GetAll().GetResult()!;
    expect(result).toMatchObject(keys);
})

export {}