import React from 'react'
import Editor from './components/Editor'
import Sidebar from './components/Sidebar'
import Split from "react-split"
import {nanoid} from "nanoid"
import { useEffect } from 'react'

export default function App() {
  const [notes, setNotes] = React.useState( () => 
    JSON.parse(localStorage.getItem('notes')) || [] //lazy state initialization
  )
  const [currentNoteId, setCurrentNoteId] = React.useState(
      (notes[0]?.id) || ""
  )

  const currentNote = 
    notes.find(note => note.id === currentNoteId) 
    || notes[0]

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes))
  }, [notes])

  function createNewNote() {
      const newNote = {
          id: nanoid(),
          body: "# Type your markdown note's title here"
      }
      setNotes(prevNotes => [newNote, ...prevNotes])
      setCurrentNoteId(newNote.id)
  }
  
  function updateNote(text) {
    setNotes((oldNotes) => {
      const updatedNotes = oldNotes.map((oldNote) =>
        oldNote.id === currentNoteId
          ? { ...oldNote, body: text }
          : oldNote
      );

      const updatedNoteIndex = updatedNotes.findIndex(
        (note) => note.id === currentNoteId
      );

      if (updatedNoteIndex !== -1) {
        const [updatedNote] = updatedNotes.splice(updatedNoteIndex, 1);
        updatedNotes.unshift(updatedNote);
      }

      return updatedNotes;
    });
  }

  function deleteNote(event, noteId) {
    event.stopPropagation()
    setNotes(oldNotes => oldNotes.filter(note => note.id!==noteId))
  }
  
  return (
      <main>
      {
          notes.length > 0 
          ?
          <Split 
              sizes={[30, 70]} 
              direction="horizontal" 
              className="split"
          >
              <Sidebar
                  notes={notes}
                  currentNote={currentNote()}
                  setCurrentNoteId={setCurrentNoteId}
                  newNote={createNewNote}
                  deleteNote={deleteNote}
              />
              {
                  currentNoteId && 
                  notes.length > 0 &&
                  <Editor 
                      currentNote={currentNote()} 
                      updateNote={updateNote} 
                  />
              }
          </Split>
          :
          <div className="no-notes">
              <h1>You have no notes</h1>
              <button 
                  className="first-note" 
                  onClick={createNewNote}
              >
                  Create one now
              </button>
          </div>
          
      }
      </main>
  )
}