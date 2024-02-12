import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { ChangeEvent, FormEvent, useState } from 'react'
import { toast } from 'sonner'

// Define props interface for NewNote component
interface NewNoteProps {
  onNoteCreated: (content: string) => void
}

// Initialize SpeechRecognition variable
let speechRecognition: SpeechRecognition | null = null

// NewNote component
export function NewNote({ onNoteCreated }: NewNoteProps) {
  // State variables
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [content, setContent] = useState('')

  // Function to handle start editing
  function handleStartEditing() {
    setShouldShowOnboarding(false)
  }

  // Function to handle content change
  function handleContentChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setContent(event.target.value)
    if (event.target.value === '') {
      setShouldShowOnboarding(true)
    }
  }

  // Function to handle save note
  function handleSaveNote(event: FormEvent) {
    event.preventDefault()

    if (content === '') {
      toast.error('Note cannot be empty')
      return
    }
    onNoteCreated(content)
    setContent('')
    setShouldShowOnboarding(true)

    toast.success('Note saved')
  }

  // Function to handle start recording
  function handleStartRecording() {
    // Check if speech recognition is supported
    const isSpeechRecognitionSupported =
      'SpeechRecognition' in window || 'webkitSpeechRecognition' in window

    if (!isSpeechRecognitionSupported) {
      toast.error('Speech recognition is not supported by your browser')
      return
    }

    setIsRecording(true)
    setShouldShowOnboarding(false)

    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition

    // Initialize speech recognition
    speechRecognition = new SpeechRecognitionAPI()

    // Configure speech recognition
    speechRecognition.continuous = true
    speechRecognition.interimResults = true
    speechRecognition.lang = 'en-US'
    speechRecognition.maxAlternatives = 1

    // Event listener for speech recognition result
    speechRecognition.onresult = (event) => {
      const transcription = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript)
      }, '')
      setContent(transcription)
    }

    // Event listener for speech recognition error
    speechRecognition.onerror = (event) => {
      console.error(event)
    }

    // Start speech recognition
    speechRecognition.start()
  }

  // Function to handle stop recording
  function handleStopRecording() {
    setIsRecording(false)

    if (speechRecognition !== null) {
      speechRecognition.stop()
    }
  }

  // Render UI
  return (
    <Dialog.Root>
      {/* Trigger for NewNote */}
      <Dialog.Trigger className="rounded-md flex flex-col bg-slate-700 p-5 gap-3 text-left hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400 outline-none">
        <span className="text-sm font-medium text-slate-200 ">Add note</span>
        <p className="text-sm leading-6 text-slate-400">
          Record an audio note that will be automatically converted to text.
        </p>
      </Dialog.Trigger>

      {/* Portal for NewNote */}
      <Dialog.Portal>
        {/* Overlay for NewNote */}
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        {/* Content for NewNote */}
        <Dialog.Content className="fixed inset-0 md:inset-auto overflow-hidden md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none">
          {/* Close button for NewNote */}
          <Dialog.Close className="absolute top-0 right-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
            <X className="size-5" />
          </Dialog.Close>

          {/* Form for NewNote */}
          <form className="flex-1 flex flex-col">
            <div className="flex flex-1 flex-col gap-3 p-5">
              {/* Title */}
              <span className="text-sm text-slate-300 font-medium">
                Add a new note
              </span>
              {/* Instructions */}
              {shouldShowOnboarding ? (
                <p className="text-sm text-slate-400 leading-6">
                  Start{' '}
                  <button
                    type="button"
                    onClick={handleStartRecording}
                    className="font-md text-lime-400 hover:underline"
                  >
                    recording an audio
                  </button>{' '}
                  note or, if you prefer, just{' '}
                  <button
                    type="button"
                    onClick={handleStartEditing}
                    className="font-md text-lime-400 hover:underline"
                  >
                    type your text
                  </button>
                  .
                </p>
              ) : (
                <textarea
                  autoFocus
                  className="text-sm outline-none leading-6 text-slate-400 bg-transparent resize-none flex-1"
                  onChange={handleContentChange}
                  value={content}
                />
              )}
            </div>
            {/* Button to stop recording */}
            {isRecording ? (
              <button
                onClick={handleStopRecording}
                type="button"
                className="w-full bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none font-medium flex items-center gap-2 justify-center hover:text-slate-100 "
              >
                <div className="size-3 rounded-full bg-red-500 animate-pulse" />
                Recording ...(click to stop)
              </button>
            ) : (
              // Button to save note
              <button
                onClick={handleSaveNote}
                type="button"
                className="w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500"
              >
                Save note
              </button>
            )}
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
