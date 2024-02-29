import "bootstrap/dist/css/bootstrap.min.css"
import { useMemo } from "react"
import { Container } from "react-bootstrap"
import { Routes, Route, Navigate } from "react-router-dom"
import NewNote from "./components/NewNote"
import { NoteList } from "./components/NoteList";
import useLocalStorage from "./hooks/useLocalStorage"
import { v4 as uuidv4 } from 'uuid'
import {NoteLayout} from "./components/NoteLayout"
import Note from "./components/Note"
import EditNote from "./components/EditNote"
import './App.scss'

function App() {
  const [notes, setNotes] = useLocalStorage('NOTES', [])
  const [tags, setTags] = useLocalStorage('TAGS', [])

  const notesWithTags = useMemo(() => {
    return notes.map(note => {
      return {
        ...note,
        tags: tags.filter(tag => note.tagIds.includes(tag.id))
      }
    })
  }, [notes, tags])

  const createNote = ({ tags, ...data }) => {
    setNotes(notes => {
      return [...notes, { ...data, id: uuidv4(), tagIds: tags.map(tag => tag.id) }]
    })
  }

  const addTag = (tag) => {
    setTags(tags => [...tags, tag])
  }

  const onUpdateNote = (id, { tags, ...data }) => {
    setNotes(notes => {
      return notes.map(note => {
        if (note.id !== id) {
          return note
        }

        return {
          ...note,
          ...data,
          tagIds: tags.map(tag => tag.id)
        }
      })
    })
  }

  const onDeleteNote = (id) => {
    setNotes(notes => {
      return notes.filter(note => note.id !== id)
    })
  }

  const updateTag = (id, name) => {
    setTags(tags => {
      return tags.map(tag => {
        if (tag.id !== id) {
          return tag
        }
        else {
          return {
            ...tag,
            name: name
          }
        }
      })
    })
  }

  const deleteTag = (id) => {
    setTags(tags => {
      return tags.filter(tag => tag.id !== id)
    })
  }

  return (
    <Container className="my-4">
      <Routes>
        <Route path="/" element={<NoteList notes={notesWithTags} availableTags={tags} updateTag={updateTag} deleteTag={deleteTag} />} />
        <Route path="/new" element={<NewNote onSubmit={createNote} onAddTag={addTag} availableTags={tags} />} />
        <Route path="/:id" element={<NoteLayout notes={notesWithTags} />}>
          <Route index element={<Note onDelete={onDeleteNote} />} />
          <Route path="edit" element={<EditNote onSubmit={onUpdateNote} onAddTag={addTag} availableTags={tags} />} />
        </Route>
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    </Container>
  )
}

export default App
