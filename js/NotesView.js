"use strict";

export default class NotesView {
  // root is the main div
  // the object methods are destructured
  // the backbone html is added using innerHTML
  constructor(root, {onNoteSelect, onNoteAdd, onNoteEdit, onNoteDelete} = {}) {
    this.root = root;
    this.onNoteSelect = onNoteSelect;
    this.onNoteAdd = onNoteAdd;
    this.onNoteEdit = onNoteEdit;
    this.onNoteDelete = onNoteDelete;
    this.root.innerHTML = `
      <div class="notes-sidebar">
        <button class="notes-add" type="button">Add Notes</button>
        <div class="notes-list">
          <div class="notes-list-item notes-list-item-selected"></div>
        </div>
      </div>
      <div class="notes-preview">
        <input type="text" class="notes-title" placeholder="Untitled" maxlength="30">
        <textarea class="notes-body" placeholder="Add note..."></textarea>
      </div>
    `;

    // after adding the main-structure of the html, assign the three input types
    // and add eventListeners to them
    const btnAddNote = this.root.querySelector(".notes-add");
    const inpTitle = this.root.querySelector(".notes-title");
    const inpBody = this.root.querySelector(".notes-body");

    // btn click fires .onNoteAdd()
    btnAddNote.addEventListener("click", () => this.onNoteAdd());

    // blur is the opposite of focus state
    [inpTitle, inpBody].forEach(inpField => {
      inpField.addEventListener("blur", () => {
        // trim white-spaces from beginning and end
        const updatedTitle = inpTitle.value.trim();
        const updatedBody = inpBody.value.trim();

        // .onNoteEdit() updates a note, which is identified by its id
        this.onNoteEdit(updatedTitle, updatedBody);
      });
    });

    // notes-preview is set to hidden by default
    this.updateNotePreviewVisibility(false);
  }

  // create the html for side-bar note
  // updated is a new Date object
  _createListItemHTML(id, title, body, updated) {
    // if the body length excides this add ... after 65 characters
    const maxBodyLength = 65;
    
    // imp: the data-note-id is a dataset attribute, which is a custom attribute
    // its really useful, to select the unique id
    return `
    <div class="notes-list-item" data-note-id="${id}">
      <div class="notes-small-title">${title}</div>
      <div class="notes-small-body">
        ${body.substring(0, maxBodyLength)}${(body.length > maxBodyLength) ? "..." : ""}
      </div>
      <div class="notes-small-updated">
        ${updated.toLocaleString(undefined, {dateStyle: "full", timeStyle: "short"})}
      </div>
    </div>
    `;
  }

  // main function for add/removing note-items from side-bar 
  updateNoteList(notes) {
    // notes-list is the div below add-btn
    const notesListContainer = this.root.querySelector(".notes-list");
    // we clear the list, to ensure that the item is added or removed
    notesListContainer.innerHTML = "";

    // loop through the notes arr of note objs
    for (const note of notes) {
      // create html for a note obj
      const noteHtml = this._createListItemHTML(note.id, note.title, note.body, new Date(note.updated));

      // remember: the note objs are sorted in descending order
      // insert the noteHtml before the end of the notes-list div, after the last child element
      notesListContainer.insertAdjacentHTML("beforeend", noteHtml);
    }
    // add select & delete events for each list item
    // we select all notes-list-item divs, and loop them over
    notesListContainer.querySelectorAll(".notes-list-item").forEach(noteListItem => {
      // on a click evt, onNoteSelect is fired, that takes in a parameter of dataset.noteId that was create using the unique id in _createListItemHTML
      noteListItem.addEventListener("click", () => {
        this.onNoteSelect(noteListItem.dataset.noteId);
      });

      // on a double click event, prompt the user to confirm action
      noteListItem.addEventListener("dblclick", () => {
        const doDelete = confirm("Are you sure you want to delete this note?");

        // if true, fire onNoteDelete, which takes the dataset.noteId
        if (doDelete) this.onNoteDelete(noteListItem.dataset.noteId);
      });
    });
  }

  // takes a note, sets it as active, by changing the values of the notes-preview area {inputs} to the note's title and body respectively
  updateActiveNote(note) {
    this.root.querySelector(".notes-title").value = note.title;
    this.root.querySelector(".notes-body").value = note.body;

    // if any noteListItem has the -selected class remove it {the class}
    this.root.querySelectorAll(".notes-list-item").forEach(noteListItem => {
      noteListItem.classList.remove("notes-list-item-selected");
    });

    // using queryselector find the div with the custom dataset attribute and add -selected class to it
    this.root.querySelector(`.notes-list-item[data-note-id="${note.id}"]`).classList.add("notes-list-item-selected");
  }

  // visible parameter is boolean {true == visible}
  updateNotePreviewVisibility(visible) {
    this.root.querySelector(".notes-preview").style.visibility = (visible) ? "visible" : "hidden";
  }
}