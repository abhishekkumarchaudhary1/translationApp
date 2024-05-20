# Full walkthrough for creating the translation app using REACT, NODE and EXPRESS
# A PROJECT BY ABHISHEK KUMAR CHAUDHARY


## Table of Contents

- [gcp_config](#gcp_config)
- [file_explorer_config](#file_explorer_config)
- [backend_config](#backend_config)
- [frontend_config](#frontend_config)
- [proxy_config](#proxy_config)
- [github_push_config](#proxy_push_config)


## gcp_config

To setup the project, do the following configurations in your GCP account:

* Go to Console
* Select a project-new Project-set name and copy the PROJECTID
* From the left bar menu, select APIs and services
* Go to create service account-Enter details-role(Actions Admin)-CREATE
* Go to manage services and add key
* Download your 'credentials.json' file or rename it.
* Again from the left bar menu, go to APIs and services and enable the cloud translate API.


## file_explorer_config

Perform the following steps in your file explorer

* Create a root folder named 'translationApp'
* Inside the 'translationApp' folder, create two folders 'frontend' & 'backend'
* Copy the 'credentials.json' file to the backend folder
* Open the 'translationApp' folder in vs code & make separate terminals for frontend and backend.

## backend_config

* To initialise the node project:
```
npm init
```
* Installing the necessary packages:
```
npm i dotenv express body-parser @google-cloud/translate
```
* Create an 'index.js' file and set the 'start' dependency as 'node index.js'

* Create a '.env' file and put your PROJECTID as well as PORT name there.

* Code snippet for 'index.js':
```
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
```
* Start your backend server:
```
npm run start
```

## frontend_config

* Create a vite app:
```
npm create vite@latest
```
* Install the node modules:
```
npm i
```
* Installing the axios package:
```
npm i axios
```
* Clean your code by deleting the 'assets' folder and everything except 'main.jsx' from the 'src' folder.

* Make a folder named 'translation' in the 'src' folder and create 'TranslationApp.jsx' as well as 'TranslationApp.css' inside it.

* Import 'TranslationApp.css' in 'TranslationApp.jsx'

* Inside 'main.jsx', import the 'TranslationApp' component

* 'TranslationApp.jsx' code snippet:
```
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
```

* 'TranslationApp.css' code snippet:
```
* {
    padding: 0;
    margin: 0;
    border: none;
    list-style: none;
    text-decoration: none;
    box-sizing: border-box;
    font-family: 'Montserrat',sans-serif;
}

html,body{
    width: 100%;
    height: 100%;
}
#mainDiv{
    width: 70%;
    max-width: 400px;
    margin: 10px auto;
    padding: 5px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    box-shadow: 3px 3px 2px #2121216e;
    border: 1px solid #2121216e;
    border-radius: 4px;
}
h3{
    text-align: center;
}
#mainDiv>textarea{
    max-width: 95%;
    border: 1px solid #212121;
    display: block; 
    margin: 10px 0;
    padding: 10px;
}
#translateBtn{
    background-color: rgb(0, 166, 255);
    color: white;
    margin: 10px auto;
    padding: 10px 20px;
    width: 60%;
    height: 40px;
    cursor: pointer;
    border-radius: 4px;
    box-shadow: 2px 2px 2px #212121;
}
#translateBtn:hover{
    opacity: 0.8;
}
#author{
    background-color: #212121;
    padding: 3px;
    color: yellow;
    border-radius: 4px;
}
#translatedOutDiv{
    background-color: #212121;
    color: powderblue;
    margin: 10px auto;
    padding: 10px;
    text-align: center;
    border-radius: 4px;
}
```
## proxy_config

For configuring CORS in our project, we need to add the following code to our 'vite.config.js' file after the 'plugins' key:
```
server:{
    proxy:{
        '/api': 'http://localhost:3000'
    },
},
```
## github_push_config

* In gitbash, initialise git into the root directory (translationApp):
```
git init
```
* Add a '.gitignore' file in the root directory and copy the following code snippet:
```
# Node modules
frontEnd/node_modules/
backEnd/node_modules/

# Logs
logs
*.log
npm-debug.log*

# Environment variables
backEnd/.env
backEnd/credentials.json

# Build directories
frontEnd/dist/
backEnd/build/

# Mac and Windows files
.DS_Store
Thumbs.db

# Vite and other build tools
.vite

```

* Stage the root directory by running the following command:
```
git add .
```

* run your initial commit:
```
git commit -m 'Initial Commit'
```

* Add remote origin of your github repo:
```
git remote add origin .....
```
* Push your code to the repo:
```
git push -u origin main
```










