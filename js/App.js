"use strict";

import NotesAPI from "./NotesAPI.js";
import NotesView from "./NotesView.js";

export default class App {
  // constructor takes only one parameter root, which is the div with the id app
  constructor(root) {
    this.notes = [];
    this.activeNote = null;
    this.view = new NotesView(root, this._handlers());

    // call refreshNotes() everytime class is instanciated 
    this._refreshNotes();
  }

  // imp function
  _refreshNotes() {
    // gets all notes from NotesAPI [array]
    const notes = NotesAPI.getAllNotes();

    // calls setNotes
    this._setNotes(notes);

    if (notes.length > 0) {
      this._setActiveNote(notes[0]);
    }
  }

  // sets this.notes = notes (from the localStorage)
  _setNotes(notes) {
    this.notes = notes;
    // adds notes inside sidebar
    this.view.updateNoteList(notes);
    // check, if no notes in the localStorage, then notes-preview area is hidden
    this.view.updateNotePreviewVisibility(notes.length > 0 ? true : false);
  }

  // sets active note, runs well with click event
  _setActiveNote(note) {
    // assign this.activeNote as parameter
    this.activeNote = note;
    // takes the active/selected note and displays info in notes-preview area
    // and change the background color of the div
    this.view.updateActiveNote(note);
  }

  // the handlers is an important function, it returns an obj of some useful methods
  // they are the final part of the script
  _handlers() {
    return {
      // called on a click event on the notes-list-item div
      // takes in the parameter of dataset attribute {data-note-id}
      onNoteSelect: noteId => {
        // finds and assign the note obj to selectedNote
        const selectedNote = this.notes.find(note => note.id == noteId);
        // calls setActiveNote which calls updateActiveNote
        this._setActiveNote(selectedNote);
      },
      onNoteAdd: () => {
        // create a new note
        const newNote = {
          "title": "Untitled",
          "body": "Take notes..."
        };

        // save in local storage, where it also gets a unique id, then refresh, which adds the note to the html & sets the new note as active
        NotesAPI.saveNote(newNote);
        this._refreshNotes();
      },
      // takes the input fields' value (title & body) on blur event listener
      onNoteEdit: (title, body) => {
        // update note, by confirming the id
        NotesAPI.saveNote(
          {
            "id": this.activeNote.id,
            "title": title,
            "body": body
          }
        );

        // basically refreshNotes() is a beast
        this._refreshNotes();
      },
      // called on a dblclick event on the notes-list-item div
      // takes in parameter of dataset attribute
      onNoteDelete: noteId => {
        // delete the note which matches noteId
        NotesAPI.deleteNote(noteId);
        // refresh
        this._refreshNotes();
      }
    }
  }
}