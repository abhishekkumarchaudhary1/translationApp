// TranslationApp.jsx

import React, { useState } from 'react';
import axios from 'axios';
import './TranslationApp.css'

const TranslationApp = () => {
  const [inputText, setInputText] = useState('');
  const [translations, setTranslations] = useState({});
  const [error, setError] = useState('');

  const translateText = async () => {
    try {
      const response = await axios.post('/api/translate', { text: inputText });
      setTranslations(response.data.translations);
      setError('');
    } catch (error) {
      console.error('Translation error:', error);
      setError('Translation error. Please try again later.');
    }
  };

  return (
    <div id='mainDiv'>
      <h3>Hello, Type your English Text to translate it into multiple languages</h3>
      <textarea value={inputText} onChange={(e) => setInputText(e.target.value)} />
      <button id='translateBtn' onClick={translateText}>Translate</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {Object.keys(translations).length > 0 && (
        <div id='translatedOutDiv'>
          <h4>Translated Text:</h4>
          <ul>
            {Object.keys(translations).map((language) => (
              <li key={language}>
                <strong>{language}:</strong> {translations[language]}
              </li>
            ))}
          </ul>
        </div>
      )}
      <h4>An app by <span id='author'>ABHISHEK</span></h4>
    </div>
  );
};

export default TranslationApp;