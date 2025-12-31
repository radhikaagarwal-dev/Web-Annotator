// ======================================
// DAY 1 + DAY 2 + DAY 3 : Web Annotator
// ======================================

// Selecting elements
const addNoteBtn = document.getElementById("AddNoteBtn");
const clearBtn = document.getElementById("ClearBtn");
const notesList = document.querySelector(".notes-list");
const editableArea = document.querySelector(".editable");

// Notes data
let notes = [];
let activeNoteId = null;

// --------------------------------------
// LOAD DATA FROM localStorage (DAY 3)
// --------------------------------------
function loadFromLocalStorage() {
  const savedNotes = localStorage.getItem("notes");
  const savedActiveId = localStorage.getItem("activeNoteId");

  if (savedNotes) {
    notes = JSON.parse(savedNotes);
  }

  if (savedActiveId) {
    activeNoteId = Number(savedActiveId);
  }

  if (notes.length > 0 && activeNoteId !== null) {
    const activeNote = notes.find(note => note.id === activeNoteId);
    if (activeNote) {
      editableArea.innerText = activeNote.text;
    }
  }

  renderNotes();
}

// --------------------------------------
// SAVE DATA TO localStorage (DAY 3)
// --------------------------------------
function saveToLocalStorage() {
  localStorage.setItem("notes", JSON.stringify(notes));
  localStorage.setItem("activeNoteId", activeNoteId);
}

// --------------------------------------
// Add new note
// --------------------------------------
addNoteBtn.addEventListener("click", () => {
  const newNote = {
    id: Date.now(),
    text: ""
  };

  notes.push(newNote);
  activeNoteId = newNote.id;

  editableArea.innerText = "";
  saveToLocalStorage();
  renderNotes();
});

// --------------------------------------
// Clear active note
// --------------------------------------
clearBtn.addEventListener("click", () => {
  if (activeNoteId === null) return;

  const activeNote = notes.find(note => note.id === activeNoteId);
  activeNote.text = "";

  editableArea.innerText = "";
  saveToLocalStorage();
  renderNotes();
});

// --------------------------------------
// Render notes in sidebar
// --------------------------------------
function renderNotes() {
  notesList.innerHTML = "";

  if (notes.length === 0) {
    notesList.innerHTML = "<li>No annotations yet</li>";
    activeNoteId = null;
    editableArea.innerText = "";
    saveToLocalStorage();
    return;
  }

  notes.forEach(note => {
    const li = document.createElement("li");

    const previewText =
      note.text.length > 25
        ? note.text.slice(0, 25) + "..."
        : note.text || "New Annotation";

    li.innerText = previewText;

    if (note.id === activeNoteId) {
      li.style.backgroundColor = "#dbeafe";
      li.style.fontWeight = "bold";
    }

    li.addEventListener("click", () => {
      activeNoteId = note.id;
      editableArea.innerText = note.text;
      saveToLocalStorage();
      renderNotes();
    });

    notesList.appendChild(li);
  });
}

// --------------------------------------
// Save editor input into active note
// --------------------------------------
editableArea.addEventListener("input", () => {
  if (activeNoteId === null) return;

  const activeNote = notes.find(note => note.id === activeNoteId);
  activeNote.text = editableArea.innerText;

  saveToLocalStorage();
  renderNotes();
});

// --------------------------------------
// Delete active note (Delete key)
// --------------------------------------
document.addEventListener("keydown", (e) => {
  if (e.key === "Delete" && activeNoteId !== null) {
    notes = notes.filter(note => note.id !== activeNoteId);

    if (notes.length > 0) {
      activeNoteId = notes[0].id;
      editableArea.innerText = notes[0].text;
    } else {
      activeNoteId = null;
      editableArea.innerText = "";
    }

    saveToLocalStorage();
    renderNotes();
  }
});

// --------------------------------------
// INITIAL LOAD
// --------------------------------------
loadFromLocalStorage();
