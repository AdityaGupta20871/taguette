import { useState, useMemo, useEffect } from 'react';
import { Row, Col, Button, Form, Card, Badge, Modal, Stack } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ReactSelect from 'react-select';
import styles from '../../src/NoteList.module.css';
import Highlight from './Highlight';

export const NoteList = ({ availableTags, notes, deleteTag, updateTag }) => {
    const [selectedTags, setSelectedTags] = useState([]);
    const [search, setSearch] = useState('');
    const [uploadedText, setUploadedText] = useState('');
    const [highlights, setHighlights] = useState([]);
    // const [highlightedText, setHighlightedText] = useState('');
    // const [highlightColor, setHighlightColor] = useState('yellow');

    // useEffect(() => {
    //     const storedText = localStorage.getItem('highlightedText');
    //     const storedColor = localStorage.getItem('highlightColor');
    //     const storedUploadedText = localStorage.getItem('uploadedText');
        
    //     if (storedText) setHighlightedText(storedText);
    //     if (storedColor) setHighlightColor(storedColor);
    //     if (storedUploadedText) setUploadedText(storedUploadedText);
    // }, []);
    
    useEffect(() => {
        // Retrieve uploaded text and highlights from localStorage
        const uploadedText = localStorage.getItem('uploadedText');
        const storedHighlights = localStorage.getItem('highlights');

        if (storedHighlights) {
            setHighlights(JSON.parse(storedHighlights));
        }

        if (uploadedText) {
            setUploadedText(uploadedText);
        }
    }, []);
    

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target.result;
            setUploadedText(text);
            localStorage.setItem('uploadedText', text);
        };
        reader.readAsText(file);
    };

    const filteredNotes = useMemo(() => {
        return notes.filter(note => {
            return (
                (search === '' || note.title.toLowerCase().includes(search) || note.markdown.toLowerCase().includes(search)) &&
                (selectedTags.length === 0 || selectedTags.every(tag => note.tags.some(noteTag => noteTag.id === tag.id)))
            );
        });
    }, [search, selectedTags, notes]);
    const [modalShow, setModalShow] = useState(false);

    const handleCreateNote = (newNoteData) => {
        // Call your function to create a new note
        // You might need to pass this function down as a prop
    };

    return (
        <>
            <Row>
                 <Col>
                    <h2 className="mb-4">Uploaded Text</h2>
                    <input type="file" accept=".txt" onChange={handleFileChange} />
                    <Highlight text={uploadedText}  onSubmit={handleCreateNote} />
                </Col>
            </Row>

            <Row>
                <Col>
                    <h1 className="mb-4">Notes</h1>
                </Col>
                <Col xs="auto">
                    <Row className="mb-4">
                        <Col>
                            <Form.Group controlId="search">
                                <Form.Label>Search</Form.Label>
                                <Form.Control type="text" placeholder="Search" value={search} onChange={e => setSearch(e.target.value)} />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="tags">
                                <Form.Label>Tags</Form.Label>
                                <ReactSelect
                                    styles={{
                                        control: provided => ({
                                            ...provided,
                                            backgroundColor: '#fff8e6',
                                        }),
                                    }}
                                    value={selectedTags.map(tag => ({
                                        value: tag.id,
                                        label: tag.name,
                                    }))}
                                    options={availableTags.map(tag => ({
                                        value: tag.id,
                                        label: tag.name,
                                    }))}
                                    onChange={tags => setSelectedTags(tags.map(tag => ({ id: tag.value, name: tag.label })))}
                                    isMulti
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Link to="/new">
                                <Button variant="primary">New Note</Button>
                            </Link>
                        </Col>
                        <Col>
                            <Button variant="outline-secondary" onClick={() => setModalShow(true)}>Edit Tags</Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row xs={1} sm={2} lg={3} xl={4} className="g-3">
                {filteredNotes.map(note => (
                    <Col key={note.id}>
                        <NoteCard id={note.id} title={note.title} tags={note.tags} markdown={note.markdown} />
                    </Col>
                ))}
            </Row>

            <EditTagsModal show={modalShow} availableTags={availableTags} onHide={() => setModalShow(false)} deleteTag={deleteTag} updateTag={updateTag} />
        </>
    );
};

const NoteCard = ({ id, title, tags, markdown }) => {
    if (markdown.length > 30) {
        markdown = markdown.substring(0, 30) + '...';
    }

    return (
        // Wrap Card with Link instead of using `as={Link}` prop
        <Link to={`${id}`} className="text-reset text-decoration-none">
            <Card className={`h-100 ${styles.card}`}>
                <Card.Body>
                    <Stack gap={2} className="align-items-center justify-content-center h-100">
                        <span className="fs-5">{title}</span>
                        <Card.Text className="text-truncate">{markdown}</Card.Text>
                        <Stack direction="horizontal" gap={2} className="justify-content-center flex-wrap">
                            {tags.map(tag => (
                                <Badge className="text-truncate" key={tag.id}>{tag.name}</Badge>
                            ))}
                        </Stack>
                    </Stack>
                </Card.Body>
            </Card>
        </Link>
    );
};

const EditTagsModal = ({ availableTags, show, onHide, deleteTag, updateTag }) => {
    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Tags</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Stack gap={2}>
                        {availableTags.map(tag => (
                            <Row key={tag.id}>
                                <Col>
                                    <Form.Control type="text" defaultValue={tag.name} onChange={e => updateTag(tag.id, e.target.value)} />
                                </Col>
                                <Col xs="auto">
                                    <Button variant="outline-danger" onClick={() => deleteTag(tag.id)}>
                                        &times;
                                    </Button>
                                </Col>
                            </Row>
                        ))}
                    </Stack>
                </Form>
            </Modal.Body>
        </Modal>
    );
};
