import { Note } from "./note_storage";
import { DataStore, DataStoreProvider, FileStore } from './note_storage';


class FileStoreProvider implements DataStoreProvider {
    Create(): FileStore {
        return new FileStore("./notes");
    }
}

const filestore: FileStore = new FileStoreProvider().Create();

export function getDataStore() : DataStore { return filestore; }