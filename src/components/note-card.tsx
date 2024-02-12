import * as Dialog from '@radix-ui/react-dialog';
import { formatDistanceToNow } from 'date-fns';
import { enCA } from 'date-fns/locale';
import { X } from 'lucide-react';

// Define the props interface for NoteCard component
interface NoteCardProps {
  note: {
    id: string;
    date: Date;
    content: string;
  };
  onDeleteNote: (id: string) => void;
}

// NoteCard component
export function NoteCard({ note, onDeleteNote }: NoteCardProps) {
  return (
    <Dialog.Root>
      {/* Note Card Trigger */}
      <Dialog.Trigger className="flex flex-col rounded-md text-left bg-slate-800 p-5 gap-3 overflow-hidden relative hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400 outline-none">
        {/* Display relative time since note creation */}
        <span className="text-sm font-medium text-slate-200">
          {formatDistanceToNow(note.date, { locale: enCA, addSuffix: true })}
        </span>
        {/* Display note content */}
        <p className="text-sm leading-6 text-slate-300">{note.content}</p>
        {/* Gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-black/0 pointer-events-none" />
      </Dialog.Trigger>

      {/* Dialog Portal */}
      <Dialog.Portal>
        {/* Dialog Overlay */}
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        {/* Dialog Content */}
        <Dialog.Content className="fixed inset-0 md:inset-auto overflow-hidden md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none">
          {/* Close button */}
          <Dialog.Close className="absolute top-0 right-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
            <X className="size-5" />
          </Dialog.Close>
          {/* Display relative time since note creation */}
          <div className="flex flex-1 flex-col gap-3 p-5">
            <span className="text-sm text-slate-300 font-medium">
              {formatDistanceToNow(note.date, {
                locale: enCA,
                addSuffix: true
              })}
            </span>
            {/* Display note content */}
            <p className="text-sm text-slate-400 leading-6">{note.content}</p>
          </div>
          {/* Button to delete note */}
          <button
            onClick={() => onDeleteNote(note.id)}
            type="button"
            className="w-full bg-slate-800 py-4 text-center text-sm text-slate-300 outline-none font-medium group"
          >
            Do you want{' '}
            <span className="text-red-400 group-hover:underline">
              delete this note
            </span>
            ?
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
