import logo from './assets/logo.svg'
import { NewNote } from './components/new-note-card'
import { NoteCard } from './components/note-card'

export function App() {
  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6">
      <img src={logo} alt="Logo Expert" />
      <form className="w-full">
        <input
          type="text"
          placeholder="Search for your notes..."
          className="w-full bg-transparent text-3xl font-semibold outline-none tracking-tight placeholder:text-slate-500"
        />
      </form>
      <div className="h-px bg-slate-700" />

      <div className="grid gap-6 grid-cols-3 auto-rows-[250px]">
        <NewNote />
        <NoteCard
          note={{
            date: new Date(),
            content:
              'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.'
          }}
        />
      </div>
    </div>
  )
}
