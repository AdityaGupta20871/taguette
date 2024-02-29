// TextFileUpload.jsx
import React from 'react';

function TextFileUpload({ onFileLoad }) {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      onFileLoad(text); // Pass the text content up to the parent component
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <input type="file" accept=".txt" onChange={handleFileChange} />
    </div>
  );
}

export default TextFileUpload;
