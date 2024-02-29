import NoteForm from "./NoteForm"
import { useLocation } from 'react-router-dom';
function NewNote({ onSubmit, onAddTag, availableTags }) {
    const location = useLocation();
    const initialMarkdown = location.state?.markdown || '';
    return (
        <>
 <h1 className="mb-4">New Note</h1>
            <NoteForm onSubmit={onSubmit} onAddTag={onAddTag} availableTags={availableTags}
                title="" markdown={initialMarkdown} tags={[]} />
        </>
    )
}

export default NewNote
