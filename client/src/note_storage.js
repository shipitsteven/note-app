"use strict";
exports.__esModule = true;
exports.Note = void 0;
var inMemoryDataStoreResult = /** @class */ (function () {
    function inMemoryDataStoreResult(success) {
        this.Success = success;
    }
    inMemoryDataStoreResult.prototype.IsSuccess = function () {
        return this.Success;
    };
    return inMemoryDataStoreResult;
}());
var inMemoryDataStoreResultWithData = /** @class */ (function () {
    function inMemoryDataStoreResultWithData(success, result) {
        this.Success = success;
        this.Result = result;
    }
    inMemoryDataStoreResultWithData.prototype.IsSuccess = function () {
        return this.Success;
    };
    inMemoryDataStoreResultWithData.prototype.GetResult = function () {
        return this.Result;
    };
    return inMemoryDataStoreResultWithData;
}());
var SimpleDataStoreProvider = /** @class */ (function () {
    function SimpleDataStoreProvider() {
    }
    SimpleDataStoreProvider.prototype.Create = function () {
        return new SimpleDataStore();
    };
    return SimpleDataStoreProvider;
}());
// Simple data store class that uses a dictionary as the database
var SimpleDataStore = /** @class */ (function () {
    function SimpleDataStore() {
        this.DataStore = {};
    }
    SimpleDataStore.prototype.Save = function (note) {
        this.DataStore[note.iD] = note;
        return new inMemoryDataStoreResult(true);
    };
    SimpleDataStore.prototype.Delete = function (id) {
        if (id in this.DataStore) {
            delete this.DataStore[id];
            return new inMemoryDataStoreResult(true);
        }
        else {
            return new inMemoryDataStoreResult(false);
        }
    };
    SimpleDataStore.prototype.Get = function (id) {
        if (id in this.DataStore) {
            var note = this.DataStore[id];
            return new inMemoryDataStoreResultWithData(true, note);
        }
        else {
            return new inMemoryDataStoreResultWithData(false, null);
        }
    };
    SimpleDataStore.prototype.Create = function (id) {
        this.DataStore[id] = new Note(id);
        return new inMemoryDataStoreResult(true);
    };
    SimpleDataStore.prototype.GetAll = function () {
        var notes = Object.keys(this.DataStore);
        return notes;
    };
    return SimpleDataStore;
}());
// Simple note class which stores the name as iD and the content of note as note
var Note = /** @class */ (function () {
    function Note(iD) {
        this.iD = iD;
        this.note = "";
    }
    Note.prototype.edit = function (text) {
        this.note = text;
    };
    return Note;
}());
exports.Note = Note;
// Test class using simple data store
var Test = /** @class */ (function () {
    function Test() {
    }
    Test.prototype.TestCreate = function () {
        var DataStoreProvider = new SimpleDataStoreProvider();
        var Database = DataStoreProvider.Create();
        Database.Create("Note_1");
        var id = "Note_1";
        return id in Database.DataStore;
    };
    Test.prototype.TestSave = function () {
        var DataStoreProvider = new SimpleDataStoreProvider();
        var Database = DataStoreProvider.Create();
        var note = new Note("Note_1");
        Database.Create(note.iD);
        note.edit("Hello World!");
        Database.Save(note);
        var note2 = Database.DataStore[note.iD];
        console.log(note2.note);
    };
    Test.prototype.TestDelete = function () {
        var DataStoreProvider = new SimpleDataStoreProvider();
        var Database = DataStoreProvider.Create();
        Database.Create("Note_1");
        var id = "Note_1";
        console.log(id in Database.DataStore);
        Database.Delete(id);
        console.log(id in Database.DataStore);
    };
    Test.prototype.TestGet = function () {
        var DataStoreProvider = new SimpleDataStoreProvider();
        var Database = DataStoreProvider.Create();
        var note = new Note("Note_1");
        Database.Create(note.iD);
        note.edit("Hello World!");
        Database.Save(note);
        var result = Database.Get(note.iD);
        return result.GetResult();
    };
    Test.prototype.TestGetAll = function () {
        var DataStoreProvider = new SimpleDataStoreProvider();
        var Database = DataStoreProvider.Create();
        var note = new Note("Note_1");
        var note2 = new Note("Note_2");
        Database.Create(note.iD);
        Database.Create(note2.iD);
        return Database.GetAll();
    };
    return Test;
}());
