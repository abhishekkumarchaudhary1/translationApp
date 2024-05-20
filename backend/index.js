require('dotenv').config();
const express = require('express');


const app = express();
const port = process.env.PORT || 3000;

const bodyParser = require('body-parser');
const { Translate } = require('@google-cloud/translate').v2;



// Initialize Google Cloud Translation client
const translate = new Translate({
  projectId: process.env.PROJECTID, // Replace with your Google Cloud project ID
  keyFilename: './credentials.json', // Path to your service account credentials JSON file
});

// Array of language codes and their full names
const languages = [
  { code: 'hi', name: 'Hindi' },
  { code: 'mr', name: 'Marathi' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'es', name: 'Spanish' }
];

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

app.post('/api/translate', async (req, res) => {
  const { text } = req.body;
  
  try {
    // Translate text using Google Cloud Translation API
    
    const translations = {};
 
    for (const lang of languages) {
      const [translation] = await translate.translate(text, lang.code);
      translations[lang.name] = translation;
    }

    res.json({ translations });

  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ error: 'Translation error' });
  }
});


app.get('/',(req,res)=>{
  res.send('<h1>Welcome to the translator app</h1>')
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});