import { ChangeEvent, useState } from 'react'
import logo from './assets/logo.svg'
import { NewNote } from './components/new-note-card'
import { NoteCard } from './components/note-card'

// Define the structure of a note
interface Note {
  id: string
  date: Date
  content: string
}

export function App() {
  // State for search input
  const [search, setSearch] = useState('');

  // State for storing notes
  const [notes, setNotes] = useState<Note[]>(() => {
    // Retrieve notes from local storage if available
    const notesFromLocalStorage = localStorage.getItem('notes');
    if (notesFromLocalStorage) {
      return JSON.parse(notesFromLocalStorage);
    }
    return [];
  });

  // Function to handle note creation
  function createNoteHandler(content: string) {
    const newNote = {
      id: crypto.randomUUID(), // Generate unique ID
      date: new Date(), // Current date
      content,
    };

    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);

    // Save notes to local storage
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
  }

  // Function to handle note deletion
  function deleteNoteHandler(id: string) {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);

    // Update notes in local storage
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
  }

  // Function to handle search input
  function searchChangeHandler(event: ChangeEvent<HTMLInputElement>) {
    const query = event.target.value;

    setSearch(query);
  }

  // Filter notes based on search input
  const filteredNotesList =
    search !== ''
      ? notes.filter((note) => note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
      : notes;

  // Render the UI
  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6 px-5 ">
      <img src={logo} alt="Logo Expert" />
      <form className="w-full">
        <input
          type="text"
          placeholder="Search for your notes..."
          className="w-full bg-transparent text-3xl font-semibold outline-none tracking-tight placeholder:text-slate-500"
          onChange={searchChangeHandler}
        />
      </form>
      <div className="h-px bg-slate-700" />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 auto-rows-[250px]">
        {/* Component for creating new notes */}
        <NewNote onNoteCreated={createNoteHandler} />
        {/* Render each note */}
        {filteredNotesList.map((note) => {
          return <NoteCard key={note.id} note={note} onDeleteNote={deleteNoteHandler} />
        })}
      </div>
    </div>
  );
}
