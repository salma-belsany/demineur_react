/*import React from 'react';
import Game from './game.js';
import './game.css';


function App() {
  return (
    <div className="App">
      <Game />
    </div>
  );
}

export default App;*/
import React from 'react';
import Jeu from './game.js';// Renommé de App.css à app.css
import './game.css';


function App() {
  return (
    <div className="App">
      <Jeu />
    </div>
  );
}


export default App;
/*import React, { useState } from 'react';
import './App.css';
import DifficultySelector from './Components/DifficultySelector';
import Game from './Game';

function App() {
  const [difficulty, setDifficulty] = useState(null);

  const handleDifficultySelect = (difficulty) => {
    setDifficulty(difficulty);
  };

  return (
    <div className="App">
      {!difficulty && <DifficultySelector onSelect={handleDifficultySelect} />}
      {difficulty && <Game difficulty={difficulty} />}
    </div>
  );
}

export default App;*/

