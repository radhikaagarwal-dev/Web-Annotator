// ==============================
// DAY 1 + DAY 2: Web Annotator
// ==============================

// Selecting elements
const addNoteBtn = document.getElementById("AddNoteBtn");
const clearBtn = document.getElementById("ClearBtn");
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
// Clear active note
// ------------------------------
clearBtn.addEventListener("click", () => {
  if (activeNoteId === null) return;

  const activeNote = notes.find(note => note.id === activeNoteId);
  activeNote.text = "";

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
    activeNoteId = null;
    editableArea.innerText = "";
    return;
  }

  notes.forEach(note => {
    const li = document.createElement("li");

    // Preview text (first 25 chars)
    const previewText =
      note.text.length > 25
        ? note.text.slice(0, 25) + "..."
        : note.text || "New Annotation";

    li.innerText = previewText;

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

// ------------------------------
// Delete active note (keyboard support)
// ------------------------------
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

    renderNotes();
  }
});
