import { useRef, useState } from 'react';
import { Form, Row, Col, Stack, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import CreatableReactSelect from 'react-select/creatable';
import { v4 as uuidv4 } from 'uuid';

 const NoteForm = ({ onSubmit, onAddTag, availableTags, title = "", markdown = "", tags = [] }) => {
    const titleRef = useRef(null);
    const markdownRef = useRef(null);
    const [selectedTags, setSelectedTags] = useState(tags);
    const [validated, setValidated] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
        } else {
            onSubmit({
                title: titleRef.current.value,
                markdown: markdownRef.current.value,
                tags: selectedTags
            });
            navigate('..');
        }
        setValidated(true);
    };

    return (
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Stack gap={4}>
                <Row>
                    <Col>
                        <Form.Group controlId='title'>
                            <Form.Label>Title</Form.Label>
                            <Form.Control ref={titleRef} required type='text' placeholder='Title' defaultValue={title} />
                            <Form.Control.Feedback type="invalid">
                                Please provide a title.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId='tags'>
                            <Form.Label>Tags</Form.Label>
                            <CreatableReactSelect
                                styles={{
                                    control: (provided) => ({
                                        ...provided,
                                        backgroundColor: '#fff8e6',
                                    }),
                                }}
                                onCreateOption={(label) => {
                                    const newTag = {
                                        id: uuidv4(),
                                        name: label
                                    };
                                    onAddTag(newTag);
                                    setSelectedTags([...selectedTags, newTag]);
                                }}
                                value={selectedTags.map(tag => ({
                                    value: tag.id,
                                    label: tag.name
                                }))}
                                options={availableTags.map(tag => ({
                                    value: tag.id,
                                    label: tag.name
                                }))}
                                onChange={(tags) => {
                                    setSelectedTags(tags.map(tag => ({
                                        id: tag.value,
                                        name: tag.label
                                    })));
                                }} isMulti />
                        </Form.Group>
                    </Col>
                </Row>
                <Form.Group controlId='markdown'>
                    <Form.Label>Content</Form.Label>
                    <Form.Control ref={markdownRef} required as="textarea" rows={15} placeholder='Content' defaultValue={markdown} />
                    <Form.Control.Feedback type="invalid">
                        Please provide a content.
                    </Form.Control.Feedback>
                </Form.Group>
            </Stack>
            <Stack direction='horizontal' gap={2} className='mt-4 justify-content-end'>
                <Button type="submit" variant='primary'>Save</Button>
                <Link to='..'>
                    <Button type="button" variant='outline-secondary'>Cancel</Button>
                </Link>
            </Stack>
        </Form>
    );
};
export default NoteForm;