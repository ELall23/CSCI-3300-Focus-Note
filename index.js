import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './style.css';  // Make sure style.css is in the src folder

function App() {
  const [text, setText] = useState('');
  const [isBold, setIsBold] = useState(false);

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const toggleBold = () => {
    setIsBold(!isBold);
  };

  return (
    <div className="App">
      <h1>Simple Text Editor</h1>
      <button onClick={toggleBold}>
        {isBold ? 'Remove Bold' : 'Make Bold'}
      </button>
      <textarea
        style={{ fontWeight: isBold ? 'bold' : 'normal' }}
        value={text}
        onChange={handleChange}
        placeholder="Start typing here..."
        rows="10"
        cols="50"
      />
      <div className="output">
        <h2>Preview:</h2>
        <p>{text}</p>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
