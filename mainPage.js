// ===================== ELEMENT REFERENCES =====================
const editor = document.getElementById("editor");
const highlightBtn = document.getElementById("highlight-btn");
const addNoteBtn = document.getElementById("add-note-btn");
const clearBtn = document.getElementById("clear-btn");
const notesContainer = document.getElementById("notes-container");

// ===================== STATE =====================
let annotations = []; // { id, note }
let activeHighlightId = null;
let activeNoteId = null;

// ===================== UTILS =====================
function generateId() {
    return "ann-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
}

// ===================== HIGHLIGHT SELECTION =====================
highlightBtn.addEventListener("click", () => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    if (range.collapsed) return;

    const span = document.createElement("span");
    const id = generateId();

    span.className = "highlighted-text";
    span.dataset.id = id;
    span.style.background = "linear-gradient(135deg , #FFE6A7 , #FFD166)";
    span.style.color = "#1a1a1a";
    span.style.padding = "2px 4px";
    span.style.borderRadius = "4px";
    span.style.cursor = "pointer";

    range.surroundContents(span);
    selection.removeAllRanges();

    setActiveHighlight(span);
    saveState();
});

// ===================== SET ACTIVE HIGHLIGHT =====================
function setActiveHighlight(span) {
    clearActiveStates();
    activeHighlightId = span.dataset.id;
    span.style.outline = "2px solid #6C63FF";

    span.scrollIntoView({ behavior: "smooth", block: "center" });
    focusNoteById(activeHighlightId);
}

// ===================== SET ACTIVE NOTE =====================
function setActiveNote(noteEl) {
    clearActiveStates();
    activeNoteId = noteEl.dataset.id;
    noteEl.classList.add("active-note");

    const highlight = document.querySelector(
        `.highlighted-text[data-id="${activeNoteId}"]`
    );
    if (highlight) {
        highlight.scrollIntoView({ behavior: "smooth", block: "center" });
        highlight.style.outline = "2px solid #6C63FF";
    }
}

// ===================== CLEAR ACTIVE STATES =====================
function clearActiveStates() {
    document
        .querySelectorAll(".highlighted-text")
        .forEach(h => (h.style.outline = "none"));

    document
        .querySelectorAll(".note-card")
        .forEach(n => n.classList.remove("active-note"));

    activeHighlightId = null;
    activeNoteId = null;
}

// ===================== ADD NOTE =====================
addNoteBtn.addEventListener("click", () => {
    if (!activeHighlightId) {
        alert("Please select a highlighted text to add annotation.");
        return;
    }

    const noteObj = {
        id: activeHighlightId,
        note: ""
    };

    annotations.push(noteObj);
    renderNotes();
    focusNoteById(activeHighlightId);
    saveState();
});

// ===================== RENDER NOTES =====================
function renderNotes() {
    notesContainer.innerHTML = "";

    if (annotations.length === 0) {
        notesContainer.innerHTML =
            '<p class="empty-text">No annotations yet.</p>';
        return;
    }

    annotations.forEach(obj => {
        const card = document.createElement("div");
        card.className = "note-card";
        card.dataset.id = obj.id;

        const preview =
            obj.note.length > 60
                ? obj.note.substring(0, 60) + "..."
                : obj.note || "Click to add note...";

        card.innerHTML = `
            <div class="note-preview">${preview}</div>
            <textarea class="note-editor">${obj.note}</textarea>
        `;

        const textarea = card.querySelector("textarea");
        textarea.addEventListener("input", e => {
            obj.note = e.target.value;
            // renderNotes();
            saveState();
        });

        card.addEventListener("click", () => setActiveNote(card));
        notesContainer.appendChild(card);
    });
}

// ===================== FOCUS NOTE =====================
function focusNoteById(id) {
    const note = document.querySelector(`.note-card[data-id="${id}"]`);
    if (note) {
        setActiveNote(note);
        note.scrollIntoView({ behavior: "smooth", block: "center" });
    }
}

// ===================== CLICK ON HIGHLIGHT =====================
editor.addEventListener("click", e => {
    if (e.target.classList.contains("highlighted-text")) {
        setActiveHighlight(e.target);
    } else {
        clearActiveStates();
    }
});

// ===================== CLEAR BUTTON LOGIC =====================
clearBtn.addEventListener("click", () => {
    // CASE 1: Highlight selected
    if (activeHighlightId) {
        const highlight = document.querySelector(
            `.highlighted-text[data-id="${activeHighlightId}"]`
        );

        if (highlight) {
            highlight.replaceWith(highlight.textContent);
        }

        annotations = annotations.filter(a => a.id !== activeHighlightId);
        clearActiveStates();
        renderNotes();
        saveState();
        return;
    }

    // CASE 2: Note selected
    if (activeNoteId) {
        annotations = annotations.filter(a => a.id !== activeNoteId);
        clearActiveStates();
        renderNotes();
        saveState();
        return;
    }

    // CASE 3: Nothing selected → do nothing
});

// ===================== PERSISTENCE =====================
function saveState() {
    localStorage.setItem("annotex-editor", editor.innerHTML);
    localStorage.setItem("annotex-notes", JSON.stringify(annotations));
}

function loadState() {
    const savedEditor = localStorage.getItem("annotex-editor");
    const savedNotes = localStorage.getItem("annotex-notes");

    if (savedEditor) editor.innerHTML = savedEditor;
    if (savedNotes) annotations = JSON.parse(savedNotes);

    renderNotes();
}

// ===================== INIT =====================
loadState();
