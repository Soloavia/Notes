// Start note list from localStorage or use empty array
let storedNotes = localStorage.getItem('noteList');

let noteArray;
if (storedNotes) {
    noteArray = JSON.parse(storedNotes);
} else {
    noteArray = [];
}


// Save notes to localStorage
function saveNotes() {
    localStorage.setItem('noteList', JSON.stringify(noteArray));
}

// Create a single note as a bootstrap card element in dedicated DIV
function createNoteElement(note, index) {
    const noteDiv = document.createElement('div');
    noteDiv.className = 'col-3 note';
    noteDiv.innerHTML = `
        <div class='row'>
            <div class="col text-end btnDiv">
                <button class="btn btn-warning delete" data-index="${index}">X</button>
            </div>
        </div>
        <div class="row">
            <div class="col" id="forText">
                ${note.text}
            </div>
        </div>
        <div class="row">
            <div class="col">
                ${note.date} <br/> ${note.time}
            </div>
        </div>
    `;
    return noteDiv;
}

// Rendering the notes as long as notes are not expired
function renderNotes() {
    const notesContainer = document.getElementById('notesHere');
    notesContainer.innerHTML = '';                                  // Clear existing notes in div to avoid duplicates

    const now = new Date();                                         // Setting current time and date

    noteArray.forEach((note, index) => {
        const noteDateTime = new Date(`${note.date}T${note.time}`); // Generating an ISO date string for date comapre

        // Only render notes that are now or in the future
        if (noteDateTime >= now) {                                  // Compare Time & Dates 
            const noteElement = createNoteElement(note, index);
            notesContainer.appendChild(noteElement);
        }
    });

    // Attach delete event handlers to only visible notes
    document.querySelectorAll('.delete').forEach(button => {
        button.addEventListener('click', (event) => {
            const index = event.target.dataset.index;
            noteArray.splice(index, 1);
            saveNotes();
            renderNotes();                                          // Re-render after deletion
        });
    });
}

// Event: Form submission
document.getElementById('dataForm').addEventListener('submit', (event) => {
    event.preventDefault();                                         // Prevent form refresh

    const noteText = document.getElementById('noteText').value.trim();
    const targetDate = document.getElementById('targetDate').value;
    const targetTime = document.getElementById('targetTime').value;

    // Validation: Prevent empty notes
    if (!noteText || !targetDate || !targetTime) {                  // Just for safety - should be handled by the "required"
        alert('Please fill out all fields before submitting.');
        return;
    }

    const newNote = {                                               // Note object
        text: noteText,
        date: targetDate,
        time: targetTime,
    };

    noteArray.push(newNote);                                        // Pushing note into ARR
    saveNotes();
    renderNotes();

    // Reset form
    event.target.reset();                                           // Default form feature for reseting the form
});

// Initial Load
if (noteArray.length > 0) {                                         // Just for fun - Initial run message
    renderNotes();
} else {
    alert('Welcome to My Task Board notes system');
}