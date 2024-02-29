import React, { useState, useEffect, useRef } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { CirclePicker } from 'react-color';
import { useNavigate } from 'react-router-dom';

export default function Highlight({ text, onSubmit }) {
    const [highlights, setHighlights] = useState([]);
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
    const [selectedText, setSelectedText] = useState('');
    const [highlightColor, setHighlightColor] = useState('yellow');
    const contextMenuRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Reset highlights when text changes
        console.log('Text has changed, resetting highlights...');
        setHighlights([]);
    }, [text]);

    const handleContextMenu = (event) => {
        event.preventDefault();

        if (window.getSelection().toString()) {
            setSelectedText(window.getSelection().toString());
            setContextMenuPosition({ x: event.pageX, y: event.pageY });
            setShowContextMenu(true);
        }
    };

    const handleClickOutside = (event) => {
        if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
            console.log('Clicked outside, hiding context menu...');
            setShowContextMenu(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            console.log('Removing event listener...');
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleHighlight = () => {
        const newHighlight = { id: Date.now(), text: selectedText, color: highlightColor };
        console.log('Creating new highlight:', newHighlight);
        setHighlights([...highlights, newHighlight]);
        onSubmit({ title: 'New Note', markdown: selectedText, tags: [] });
        setShowContextMenu(false);
        navigate('/new', { state: { markdown: selectedText } });
    };

    const handleColorChange = (color) => {
        console.log('Color changed to:', color.hex);
        setHighlightColor(color.hex);
        handleHighlight()
    };

    return (
        <div onContextMenu={handleContextMenu}>
            {text.split(' ').map((word, index) => {
                const highlight = highlights.find(highlight => highlight.text.includes(word));
                return (
                    <span 
                        key={index} 
                        style={{ backgroundColor: highlight ? highlight.color : 'transparent' }}
                        onClick={() => setSelectedText(word)}
                    >
                        {word + ' '}
                    </span>
                );
            })}
            {showContextMenu && (
                <div ref={contextMenuRef} style={{ position: 'absolute', top: contextMenuPosition.y, left: contextMenuPosition.x }}>
                    <DropdownButton id="dropdown-basic-button" title="Options">
                        <Dropdown.Item onClick={handleHighlight}>Create Note</Dropdown.Item>
                    </DropdownButton>
                    <CirclePicker onChange={handleColorChange} />
                </div>
            )}
        </div>
    );
}
