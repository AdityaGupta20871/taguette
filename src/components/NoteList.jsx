import { useState, useMemo, useEffect } from 'react';
import { Row, Col, Button, Form, Card, Badge, Modal, Stack } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ReactSelect from 'react-select';
import styles from '../../src/NoteList.module.css';
import Highlight from './Highlight';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Typewriterdemo from './Typewriterdemo';
export const NoteList = ({ availableTags, notes, deleteTag, updateTag }) => {
    const [selectedTags, setSelectedTags] = useState([]);
    const [search, setSearch] = useState('');
    const [uploadedText, setUploadedText] = useState('');
    const location = useLocation();
    const [highlights, setHighlights] = useState([]);
    
    useEffect(() => {
        const storedText = localStorage.getItem('uploadedText');
        const storedHighlights = localStorage.getItem('highlights');
        
        console.log('Stored Text:', storedText);
        console.log('Stored Highlights:', storedHighlights);
        if (storedText) setUploadedText(storedText);
        if (storedHighlights) setHighlights(JSON.parse(storedHighlights));
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
        <nav class="navbar  sticky-top bg-success bg-gradient-to-br from-green-200 to-blue-500 flex-md-nowrap p-2">
          <a class="navbar-brand text-white col-sm-3 col-md-2 mr-2" href="#">
            Taguette
          </a>
          <input
            class="form-control form-control-dark w-100"
            type="text"
            placeholder="Search"
            aria-label="Search"
          />
          <ul class="navbar-nav px-3">
            <li class="nav-item text-nowrap">
              <a class="nav-link text-white" href="#">
                Sign out
              </a>
            </li>
          </ul>
        </nav>
        <div className="container-fluid">
          <div className="row">
            <nav class="col-md-2 d-none d-md-block bg-light sidebar">
              <div class="sidebar-sticky">
                <ul class="nav flex-column">
                  <li class="nav-item mb-4">
                    <Form.Group controlId="search">
                      <Form.Label>Search</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </Form.Group>
                  </li>
                  <li class="nav-item mb-4">
                    <Form.Group controlId="tags">
                      <Form.Label>Tags</Form.Label>
                      <ReactSelect
                        styles={{
                          control: (provided) => ({
                            ...provided,
                            backgroundColor: "#fff8e6",
                          }),
                        }}
                        value={selectedTags.map((tag) => ({
                          value: tag.id,
                          label: tag.name,
                        }))}
                        options={availableTags.map((tag) => ({
                          value: tag.id,
                          label: tag.name,
                        }))}
                        onChange={(tags) =>
                          setSelectedTags(
                            tags.map((tag) => ({
                              id: tag.value,
                              name: tag.label,
                            }))
                          )
                        }
                        isMulti
                      />
                    </Form.Group>
                    <div className='mb-4'></div>
                    <Row>
                      {filteredNotes.map((note) => (
                        <Col key={note.id}>
                          <NoteCard
                            id={note.id}
                            title={note.title}
                            tags={note.tags}
                            markdown={note.markdown}
                          />
                        </Col>
                      ))}
                    </Row>
                  </li>
                  <li class="nav-item mb-4">
                    <Col>
                      <Link to="/new">
                        <Button variant="primary">New Note</Button>
                      </Link>
                    </Col>
                  </li>
                  <li className="nav-item mb-4">
                    <Col>
                      <Button
                        variant="outline-secondary"
                        onClick={() => setModalShow(true)}
                      >
                        Edit Tags
                      </Button>
                    </Col>
                  </li>
                </ul>
              </div>
            </nav>
            <main role="main" class="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">
              <div className="d-flex  flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
                <Typewriterdemo />
              </div>
              <input className='mb-2' type="file" accept=".txt" onChange={handleFileChange} />
            <Highlight
              text={uploadedText}
              highlights={highlights}
              setHighlights={setHighlights}
              onSubmit={handleCreateNote}
            />
            </main>
          </div>
        </div>
        <EditTagsModal
          show={modalShow}
          availableTags={availableTags}
          onHide={() => setModalShow(false)}
          deleteTag={deleteTag}
          updateTag={updateTag}
        />
      </>
    );
};







const NoteCard = ({ id, title, tags, markdown }) => {
    if (markdown.length > 30) {
        markdown = markdown.substring(0, 30) + '...';
    }

    return (
        <Link to={`${id}`} className="text-reset text-decoration-none">
            <Card className={`w-100 mb-3 ${styles.card}`}>
                <Card.Body>
                    <Stack gap={2}>
                        <h5 className="fs-5 mb-0" style={{ fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</h5>
                        <p className="text-muted" style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{markdown}</p>
                        <Stack direction="horizontal" gap={2} className="flex-wrap">
                            {tags.map(tag => (
                                <Badge key={tag.id}>{tag.name}</Badge>
                            ))}
                        </Stack>
                    </Stack>
                </Card.Body>
            </Card>
        </Link>
    );
};

export default NoteCard;

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
