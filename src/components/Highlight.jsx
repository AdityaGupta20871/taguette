import React, { useState, useEffect, useRef } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function Highlight({ text, onSubmit }) {
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
    const [selectedText, setSelectedText] = useState('');
    const [highlights, setHighlights] = useState([]); // Store highlights
    const contextMenuRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedHighlights = localStorage.getItem('highlights');
        if (storedHighlights) {
            setHighlights(JSON.parse(storedHighlights));
        }
    }, []);

    const handleMouseUp = () => {
        const selection = window.getSelection();
        if (selection.toString().trim()) {
            setSelectedText(selection.toString());
            const selectionRect = selection.getRangeAt(0).getBoundingClientRect();
            setContextMenuPosition({ x: selectionRect.left, y: selectionRect.top + window.pageYOffset });
            setShowContextMenu(true);
        }
    };

    const handleClickOutside = (event) => {
        if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
            setShowContextMenu(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const addHighlight = (color) => {
        if (!selectedText) return;
        setHighlights([...highlights, { text: selectedText, color }]);
        setShowContextMenu(false);
    };

    const clearHighlight = () => {
        setHighlights([]);
        setShowContextMenu(false);
    };

    const handleCreateNote = () => {
        onSubmit({ title: 'New Note', markdown: selectedText, tags: [] });
        setShowContextMenu(false);
        navigate('/new', { state: { markdown: selectedText } });
        localStorage.setItem('uploadedText', selectedText);
        localStorage.setItem('highlights', JSON.stringify(highlights));
    };

    const renderText = () => {
        let parts = [text]; // Start with the initial text as a single part
        highlights.forEach((highlight, index) => {
            let newParts = [];
            parts.forEach(part => {
                // Check if part is a string or a React element
                if (typeof part === 'string') {
                    // It's safe to call split on strings
                    const splitText = part.split(highlight.text);
                    const combined = [];
                    splitText.forEach((text, index) => {
                        combined.push(text);
                        if (index < splitText.length - 1) {
                            combined.push(
                                <span
                                    style={{ backgroundColor: highlight.color }}
                                    key={`${highlight.text}-${index}`}
                                >
                                    {highlight.text}
                                </span>
                            );
                        }
                    });
                    newParts = newParts.concat(combined);
                } else {
                    // If part is not a string (e.g., a React element), just push it as is
                    newParts.push(part);
                }
            });
            parts = newParts;
        });
        return parts.map((part, index) => (
            <React.Fragment key={index}>{part}</React.Fragment>
        ));
    };

    return (
        <div onMouseUp={handleMouseUp}>
            <div>{renderText()}</div>
            {showContextMenu && (
                <div
                    ref={contextMenuRef}
                    style={{ position: 'absolute', top: contextMenuPosition.y, left: contextMenuPosition.x }}
                >
                    <DropdownButton id="dropdown-basic-button" title="Options">
                        <Dropdown.Item onClick={() => addHighlight('yellow')}>Yellow</Dropdown.Item>
                        <Dropdown.Item onClick={() => addHighlight('red')}>Red</Dropdown.Item>
                        <Dropdown.Item onClick={() => addHighlight('green')}>Green</Dropdown.Item>
                        <Dropdown.Item onClick={clearHighlight}>Clear Highlight</Dropdown.Item>
                        <Dropdown.Item onClick={handleCreateNote}>Create Note</Dropdown.Item>
                    </DropdownButton>
                </div>
            )}
        </div>
    );
}
