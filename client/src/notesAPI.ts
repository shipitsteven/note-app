import React from 'react';
import ReactDOM from 'react-dom';


interface Note {
    metadata: NoteMetaData;
    text: string;
}

interface NoteMetaData {
  id?: string;
  title: string;
  user: string;
  date: string;
  tagging: string;
}
​
let note: Note = {
  metadata: {
    id: "37432487723894",
    title: "blah blah",
    user: "username",
    date: "7/10",
    tagging: "math"
  },
  text: "blah blah blah"
}

// Notes API

interface DbResult <T>{
  code: number;
  success:T;
}

function isSuccess(code):DbResult<boolean>{
  return{
    code:123456,
    success:false,
  };
}

// Create
function CreateNote(note: Note): CreateNoteResult

interface CreateNoteResult {
  id: string;
  result: DbResult<boolean>;
}

let createNoteResult = {
  id: "23948329045839248",
  result: {
    isSuccess: true,
  }
}

// Update
function UpdateNote(note: Note): UpdateNoteResult
​
interface UpdateNoteResult {
  id: string;
  result: DbResult<boolean>;
}

let updateNoteResult = {
  id: "2834723847239847238",
  result: {
    isSuccess: false,
    error: "error message"
  }
}

// Delete
function DeleteNote(note: Note): DeleteNoteResult
​
interface DeleteNoteResult {
  result: DbResult<boolean>;
}

let deleteNoteResult = {
  result: {
    isSuccess: true
  }
}

// Fetch
function FetchNotes(user: string): FetchNoteResult

interface FetchNoteResult {
  result: DbResult<boolean>;
  notes: Note[];
}

let fetchNoteResult = {
  result: {
    isSuccess: true
  },
  notes: [
    {
      metadata: {
        id: "37432487723894",
        title: "blah blah",
        user: "username",
        date: "7/10",
        tagging: "math"
      },
      text: "blah blah blah"
    },
    {
      metadata: {
        id: "32423423432432",
        title: "blah blah",
        user: "username",
        date: "7/10",
        tagging: "history"
      },
      text: "blah blah blah"
    }
  ]
}
​
// Tagging / Categorizing API
// Just use update​ to create a tag

function FetchNotesByCategory(user: string, tagging: string): FetchNotesByCategoryResult

interface FetchNotesByCategoryResult {
  result: DbResult<boolean>;
  notes: Note[];
}

let fetchNotesByCategoryResult = {
  result: {
    isSuccess: true
  },
  notes: [
    {
      metadata: {
        id: "37432487723894",
        title: "blah blah",
        user: "username",
        date: "7/10",
        tagging: "math"
      },
      text: "blah blah blah"
    }
  ]
}

​// Search
function SearchNotes(searchTerm: string): SearchNoteResult

interface SearchNoteResult {
  result: DbResult<boolean>;
  notes?: Note[];
}

let searchNotesResult = {
  result: {
    isSuccess: true
  },
  notes: [
    {
      metadata: {
        id: "37432487723894",
        title: "blah blah",
        user: "username",
        date: "7/10",
        tagging: "math"
      },
      text: "blah blah blah"
    }
  ]
}