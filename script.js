// ==============================
// DAY 1: Notes Add + Select Logic
// ==============================

// Selecting elements
const addNoteBtn = document.getElementById("AddNoteBtn");
const notesList = document.querySelector(".notes-list");
const editableArea = document.querySelector(".editable");

// Notes data
let notes = [];
let activeNoteId = null;

// ------------------------------
// Add new note
// ------------------------------
addNoteBtn.addEventListener("click", () => {
  const newNote = {
    id: Date.now(),
    text: ""
  };

  notes.push(newNote);
  activeNoteId = newNote.id;

  editableArea.innerText = "";
  renderNotes();
});

// ------------------------------
// Render notes in sidebar
// ------------------------------
function renderNotes() {
  notesList.innerHTML = "";

  if (notes.length === 0) {
    notesList.innerHTML = "<li>No annotations yet</li>";
    return;
  }

  notes.forEach(note => {
    const li = document.createElement("li");
    li.innerText = note.text || "New Annotation";

    // Highlight active note
    if (note.id === activeNoteId) {
      li.style.backgroundColor = "#dbeafe";
      li.style.fontWeight = "bold";
    }

    // Click to select note
    li.addEventListener("click", () => {
      activeNoteId = note.id;
      editableArea.innerText = note.text;
      renderNotes();
    });

    notesList.appendChild(li);
  });
}

// ------------------------------
// Save text into active note
// ------------------------------
editableArea.addEventListener("input", () => {
  if (activeNoteId === null) return;

  const activeNote = notes.find(note => note.id === activeNoteId);
  activeNote.text = editableArea.innerText;

  renderNotes();
});
