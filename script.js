// script.js

// Obtener las notas almacenadas en localStorage (si existen)
let notes = JSON.parse(localStorage.getItem('notes')) || [];

// Obtener elementos del DOM
const noteTitleInput = document.getElementById('note-title');
const noteContentInput = document.getElementById('note-content');
const noteTypeSelect = document.getElementById('note-type');
const noteImageInput = document.getElementById('note-image');
const addNoteBtn = document.getElementById('add-note-btn');
const notesContainer = document.getElementById('notes-container');

let isEditing = false;
let editNoteId = null;

// Función para guardar las notas en localStorage
function saveNotes() {
  localStorage.setItem('notes', JSON.stringify(notes));
}

// Función para agregar una nueva nota
function addNote() {
  const title = noteTitleInput.value.trim();
  const content = noteContentInput.value.trim();
  const type = noteTypeSelect.value;
  const image = noteImageInput.files[0];

  if (title === '' || content === '' || type === '') {
    alert('Por favor, complete todos los campos');
    return;
  }

  if (isEditing) {
    // Editar nota existente
    const noteIndex = notes.findIndex(note => note.id === editNoteId);

    if (noteIndex === -1) {
      alert('La nota a editar no existe');
      return;
    }

    notes[noteIndex].title = title;
    notes[noteIndex].content = content;
    notes[noteIndex].type = type;

    if (image) {
      const reader = new FileReader();
      reader.onload = function (event) {
        notes[noteIndex].image = event.target.result;
        saveNotes(); // Guardar las notas en localStorage
        renderNotes();
      };
      reader.readAsDataURL(image);
    } else {
      saveNotes(); // Guardar las notas en localStorage
      renderNotes();
    }

    isEditing = false;
    editNoteId = null;
    addNoteBtn.innerText = 'Agregar';
  } else {
    // Agregar nueva nota
    const note = {
      id: Date.now(),
      title,
      content,
      type,
      image: null
    };

    if (image) {
      const reader = new FileReader();
      reader.onload = function (event) {
        note.image = event.target.result;
        notes.push(note);
        saveNotes(); // Guardar las notas en localStorage
        renderNotes();
      };
      reader.readAsDataURL(image);
    } else {
      notes.push(note);
      saveNotes(); // Guardar las notas en localStorage
      renderNotes();
    }
  }

  // Limpiar campos del formulario
  noteTitleInput.value = '';
  noteContentInput.value = '';
  noteTypeSelect.value = '';
  noteImageInput.value = '';
}

// Función para cargar los datos de una nota en el formulario para editar
function editNote(event) {
  const noteId = parseInt(event.target.getAttribute('data-id'));
  const note = notes.find(note => note.id === noteId);

  if (note) {
    noteTitleInput.value = note.title;
    noteContentInput.value = note.content;
    noteTypeSelect.value = note.type;

    isEditing = true;
    editNoteId = noteId;
    addNoteBtn.innerText = 'Guardar';
  }
}

// Función para renderizar las notas en el DOM
function renderNotes() {
  notesContainer.innerHTML = '';

  notes.forEach(note => {
    const noteElement = document.createElement('div');
    noteElement.classList.add('note');
    noteElement.innerHTML = `<div class="cont">
      <h1 class="note-title">${note.title}</h1>
      <p>${note.content}</p>
      <p class="note-type">${note.type}</p>
      ${note.image ? `<img class="imagestyles" src="${note.image}" alt="Note Image">` : ''}</div>
      <button class="edit-note-btn" data-id="${note.id}">Editar</button>
      <button class="delete-note-btn" data-id="${note.id}">Eliminar</button>
    `;

    const editButton = noteElement.querySelector('.edit-note-btn');
    const deleteButton = noteElement.querySelector('.delete-note-btn');

    editButton.addEventListener('click', editNote);
    deleteButton.addEventListener('click', deleteNote);

    notesContainer.appendChild(noteElement);
  });
}

// Función para eliminar una nota
function deleteNote(event) {
  const noteId = parseInt(event.target.getAttribute('data-id'));
  notes = notes.filter(note => note.id !== noteId);
  saveNotes(); // Guardar las notas actualizadas en localStorage
  renderNotes();
}

// Cargar las notas en el DOM al cargar la página
renderNotes();

// Event listener para agregar/editar una nota
addNoteBtn.addEventListener('click', addNote);
