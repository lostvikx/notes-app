"use strict";

export default class NotesAPI {
  static getAllNotes() {
    // if "notes" is null, then add "[]"
    const notes = JSON.parse(localStorage.getItem("notes") || "[]");

    return notes.sort((a, b) => {
      // if a date > b date then don't swap
      return new Date(a.updated) > new Date(b.updated) ? -1 : 1;
    });
  }

  // saveNote to local storage
  static saveNote(noteToSave) {
    const notes = NotesAPI.getAllNotes();
    // check if the note we are trying to add already exists
    // the array.find() finds the first match and assigns it to the variable 
    const exists = notes.find(note => note.id == noteToSave.id);

    // Edit/Update existing note
    if (exists) {
      exists.title = noteToSave.title;
      exists.body = noteToSave.body;
      exists.updated = new Date().toISOString();
    } else {
      // some random id which should not match any existing notes id
      function ranNum() {
        let randomNum = Math.floor(100000 + Math.random() * 900000);
        return (notes.some(n => n.id == randomNum)) ? ranNum() : randomNum;
      }
      noteToSave.id = ranNum();
      noteToSave.updated = new Date().toISOString();
      notes.push(noteToSave);
    }

    localStorage.setItem("notes", JSON.stringify(notes));
  }

  // delete note from local storage
  static deleteNote(id) {
    let notes = NotesAPI.getAllNotes();
    // need that != sign!
    const newNotes = notes.filter(note => note.id != id);

    localStorage.setItem("notes", JSON.stringify(newNotes));
  }
}