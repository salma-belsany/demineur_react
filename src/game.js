/*import React, { useState, useEffect } from "react";


const levels = [  {    rows: 9,    columns: 9,    bombs: 10,  },  {    rows: 16,    columns: 16,    bombs: 40,  },  {    rows: 22,    columns: 22,    bombs: 110,  },  {    rows: 30,    columns: 30,    bombs: 150,  },];

const initialGrid = (level) => {
  const { rows, columns } = level;
  const grid = [];
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < columns; j++) {
      row.push({
        x: i,
        y: j,
        isRevealed: false,
        hasFlag: false,
        hasBomb: false,
      });
    }
    grid.push(row);
  }
  return grid;
};

const placeBombs = (level, grid) => {
  const { bombs } = level;
  const { rows } = level;
  const { columns } = level;
  let placedBombs = 0;
  while (placedBombs < bombs) {
    const randomRowIndex = Math.floor(Math.random() * rows);
    const randomColumnIndex = Math.floor(Math.random() * columns);
    if (!grid[randomRowIndex][randomColumnIndex].hasBomb) {
      grid[randomRowIndex][randomColumnIndex].hasBomb = true;
      placedBombs++;
    }
  }
  return grid;
};

const revealEmptyCells = (level, grid, row, column) => {
  const { rows } = level;
  const { columns } = level;
  if (
    row >= 0 &&
    row < rows &&
    column >= 0 &&
    column < columns &&
    !grid[row][column].hasBomb &&
    !grid[row][column].isRevealed
  ) {
    grid[row][column].isRevealed = true;
    const adjacentCells = [      [row - 1, column - 1],
      [row - 1, column],
      [row - 1, column + 1],
      [row, column - 1],
      [row, column + 1],
      [row + 1, column - 1],
      [row + 1, column],
      [row + 1, column + 1],
    ];
    adjacentCells.forEach(([r, c]) => {
      revealEmptyCells(level, grid, r, c);
    });
  }
};
export const countAdjacentBombs = (level, grid, row, column) => {
  const adjacentCells = [
    [row - 1, column - 1],
    [row - 1, column],
    [row - 1, column + 1],
    [row, column - 1],
    [row, column + 1],
    [row + 1, column - 1],
    [row + 1, column],
    [row + 1, column + 1],
  ];

  const validCells = adjacentCells.filter(
    ([row, column]) => row >= 0 && row < grid.length && column >= 0 && column < grid[0].length
  );

  const bombCount = validCells.reduce(
    (count, [row, column]) => count + (grid[row][column].hasBomb ? 1 : 0),
    0
  );

  return bombCount;
};


const Jeu = () => {
  const [level, setLevel] = useState(0);
  const [grid, setGrid] = useState(initialGrid(levels[level]));
  const [gameOver, setGameOver] = useState(false);
  const [time, setTime] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [scoreBoard, setScoreBoard] = useState([]);

  const handleLevelChange = (newLevel) => {
    setLevel(newLevel);
    setGrid(initialGrid(levels[newLevel]));
  };

  useEffect(() => {
    setGrid(placeBombs(levels[level], grid));
  }, [level]);

  const handleCellClick = (row, column) => {
    if (grid[row][column].hasFlag) return;
    const newGrid = [...grid];
    if (newGrid[row][column].hasBomb) {
      // le joueur a cliqué sur une bombe, le jeu est terminé
      setGameOver(true);
      clearInterval(intervalId);
      revealAllCells(grid);
    } else {
      // le joueur a cliqué sur une cellule vide, révélez les cellules adjacentes vides
      revealEmptyCells(level, newGrid, row, column);
      setGrid(newGrid);
    }
  };
  
// Function to check if the selected cell has a bomb or not
const checkCell = (row, column) => {
  if (grid[row][column].hasBomb) {
  // Player loses the game
  setGameOver(true);
  clearInterval(intervalId);
  revealAllCells(grid);
  } else if (!grid[row][column].isRevealed) {
  // Check for adjacent cells if the selected cell is empty
  revealEmptyCells(level, grid, row, column);
  setGrid([...grid]);
  }
  };
  
  // Function to reveal all cells at the end of the game
  const revealAllCells = (grid) => {
  const newGrid = [...grid];
  newGrid.forEach((row) =>
  row.forEach((cell) => {
  if (cell.hasBomb) {
  cell.isRevealed = true;
  }
  })
  );
  setGrid(newGrid);
  };
  
  // Function to handle right click on a cell
  const handleCellRightClick = (event, row, column) => {
  event.preventDefault();
  const newGrid = [...grid];
  newGrid[row][column].hasFlag = !newGrid[row][column].hasFlag;
  setGrid(newGrid);
  };
  
  // Function to handle start of the game
  const startGame = () => {
  setGrid(placeBombs(levels[level], initialGrid(levels[level])));
  setGameOver(false);
  setTime(0);
  clearInterval(intervalId);
  setIntervalId(setInterval(() => setTime((prevTime) => prevTime + 1), 1000));
  };
  
  // Function to handle end of the game and save score
  const endGame = (result) => {
  clearInterval(intervalId);
  const playerName = prompt("You ${result}! Enter your name to save your score:");
  if (playerName) {
  const newScore = {
  name: playerName,
  time: time,
  level: level,
  };
  setScoreBoard([...scoreBoard, newScore]);
  localStorage.setItem('scoreBoard', JSON.stringify([...scoreBoard, newScore]));
  }
  };
  
  // Check if player has won the game
  useEffect(() => {
  const flattenedGrid = grid.flat();
  const totalCells = flattenedGrid.length;
  const totalNonBombCells = flattenedGrid.filter((cell) => !cell.hasBomb).length;
  const totalRevealedNonBombCells = flattenedGrid.filter((cell) => !cell.hasBomb && cell.isRevealed).length;
  if (totalNonBombCells === totalRevealedNonBombCells) {
  // Player wins the game
  setGameOver(true);
  endGame('won');
  }
  }, [grid]);
  
  

 return (
    <div>
      <header className="header"></header>
      <h1 className="title">Démineur</h1>
     
      <div>
        <label htmlFor="level-select">Level:</label>
        <select id="level-select" value={level} onChange={handleLevelChange}>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
     <span>{`Timer: ${time}`}</span>
    <table style={{ borderCollapse: 'collapse', margin: '20px auto 0', border: '2px solid black' }}>
      <tbody>
        {grid.map((rows, rowIndex) => (
          <tr key={rowIndex}>
            {rows.map((cell, columnIndex) => (
              <td
                key={`${rowIndex}-${columnIndex}`}
                style={{
                  width: '50px', 
                  height: '50px', 
                  textAlign: 'center', 
                  verticalAlign: 'middle', 
                  border: '1px solid black', 
                  backgroundColor: 'rgb(255, 0, 111)',
                  transition: 'all 0.3s ease',
                  backgroundColor: cell.isRevealed ? '#ccc' : '#eee'
                }}
                onClick={() => handleCellClick(rowIndex, columnIndex)}
                onContextMenu={(event) => handleCellRightClick(event, rowIndex, columnIndex)}
              >
                {cell.hasFlag && <span>🚩</span>}
                {cell.isRevealed && cell.hasBomb && <span>💣</span>}
                {cell.isRevealed && !cell.hasBomb && (
                  <span>{countAdjacentBombs(level, grid, rowIndex, columnIndex)}</span>
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
};

export default Jeu;*/
import React, { useState, useEffect } from "react";
const levels = [
  {
    rows: 9,
    columns: 9,
    bombs: 10,
  },
  {
    rows: 16,
    columns: 16,
    bombs: 40,
  },
  {
    rows: 22,
    columns: 22,
    bombs: 110,
  },
  {
    rows: 30,
    columns: 30,
    bombs: 150,
  }
];

const initialGrid = (level) => {
  const { rows, columns } = level;
  const grid = [];
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < columns; j++) {
      row.push({
        x: i,
        y: j,
        isRevealed: false,
        hasFlag: false,
        hasBomb: false,
      });
    }
    grid.push(row);
  }
  return grid;
};

const placeBombs = (level, grid) => {
  const { bombs } = level;
  const { rows } = level;
  const { columns } = level;
  let placedBombs = 0;
  while (placedBombs < bombs) {
    const randomRowIndex = Math.floor(Math.random() * rows);
    const randomColumnIndex = Math.floor(Math.random() * columns);
    if (!grid[randomRowIndex][randomColumnIndex].hasBomb) {
      grid[randomRowIndex][randomColumnIndex].hasBomb = true;
      placedBombs++;
    }
  }
  return grid;
};

const revealEmptyCells = (level, grid, row, column) => {
  const { rows } = level;
  const { columns } = level;
  if (
    row >= 0 &&
    row < rows &&
    column >= 0 &&
    column < columns &&
    !grid[row][column].hasBomb &&
    !grid[row][column].isRevealed
  ) {
    grid[row][column].isRevealed = true;
    const adjacentCells = [      [row - 1, column - 1],
      [row - 1, column],
      [row - 1, column + 1],
      [row, column - 1],
      [row, column + 1],
      [row + 1, column - 1],
      [row + 1, column],
      [row + 1, column + 1],
    ];
    adjacentCells.forEach(([r, c]) => {
      revealEmptyCells(level, grid, r, c);
    });
  }
};

const Jeu = () => {
  const [level, setLevel] = useState(0);
  const [grid, setGrid] = useState(initialGrid(levels[level]));
  const [gameOver, setGameOver] = useState(false);

  const handleLevelChange = (newLevel) => {
    setLevel(newLevel);
    setGrid(initialGrid(levels[newLevel]));
  };

  useEffect(() => {
    setGrid(placeBombs(levels[level], grid));
  }, [level]);

  const handleCellClick = (row, column) => {
    if (grid[row][column].hasFlag) return;
    const newGrid = [...grid];
    if (newGrid[row][column].hasBomb) {
      setGameOver(true);
      newGrid.forEach((row) => {
        row.forEach((cell) => {
          if (cell.hasBomb) {
            cell.isRevealed = true;
          }
        });
      });
    } else {
      revealEmptyCells(levels[level], newGrid, row, column);
    }
    setGrid(newGrid);
  };

  const handleCellRightClick = (e, row, column) => {
    e.preventDefault();
    const newGrid = [...grid];
    newGrid[row][column].hasFlag = !newGrid[row][column].hasFlag;
    setGrid(newGrid);
  };

  const gameStatus = () => {
    let revealed = 0;
    grid.forEach((row) => {
      row.forEach((cell) => {
        if (cell.isRevealed) {
          revealed++;
        }
      });
    });
    if (gameOver) return;
    if (revealed === levels[level].rows * levels[level].columns - levels[level].bombs) {
      setGameOver(true);
      clearInterval(intervalId);
      alert("You win!");
    }
  };

  useEffect(() => {
    gameStatus();
    return () => clearInterval(intervalId);
  }, [gameOver]);
  <div id="timer">00:00</div>

  let seconds = 0;
  let intervalId = setInterval(function() {
  seconds++;
  const minutes = Math.floor(seconds / 60);
  const formattedSeconds = seconds % 60;
  document.getElementById("timer").innerHTML = `${minutes}:${formattedSeconds}`;
}, 1000);

const adjacentBombs = (level, grid, row, column) => {
  const { rows } = level;
  const { columns } = level;
  let bombCount = 0;
  const adjacentCells = [      [row - 1, column - 1],
    [row - 1, column],
    [row - 1, column + 1],
    [row, column - 1],
    [row, column + 1],
    [row + 1, column - 1],
    [row + 1, column],
    [row + 1, column + 1],
  ];
  adjacentCells.forEach(([r, c]) => {
    if (
      r >= 0 &&
      r < rows &&
      c >= 0 &&
      c < columns &&
      grid[r][c].hasBomb
    ) {
      bombCount++;
    }
  });
  return bombCount;
};

return (
  <div>
    <header class="header"></header>
    <h1 class="title">Démineur</h1>
    <div class="timer">Temps : <span id="timer" style={{ fontSize: '2rem', fontWeight: 'bold', letterSpacing: '2px' }}>00:00</span></div>
    <table style={{ borderCollapse: 'collapse', margin: '20px auto 0', border: '2px solid black' }}>
      <tbody>
        {grid.map((rows, rowIndex) => (
          <tr key={rowIndex}>
            {rows.map((cell, cellIndex) => (
              <td
                key={`${rowIndex}-${cellIndex}`}
                style={{
                  width: '50px', 
                  height: '50px', 
                  textAlign: 'center', 
                  verticalAlign: 'middle', 
                  border: '1px solid black', 
                  backgroundColor: 'rgb(255, 0, 111)',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => handleCellClick(rowIndex, cellIndex)}
                onContextMenu={(e) =>
                  handleCellRightClick(e, rowIndex, cellIndex)
                }
              > {cell.hasFlag && <span>🚩</span>}
                {cell.isRevealed && cell.hasBomb && <span style={{ color: 'red', fontSize: '2rem', fontWeight: 'bold' }}>💣</span>}
                {cell.isRevealed && !cell.hasBomb && (
                  <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>{adjacentBombs(levels[level], grid, rowIndex, cellIndex)}</span>
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
    <div class="controls" style={{ marginTop: '2rem', display: 'flex', alignItems: 'center' }}>
      <button style={{ fontSize: '1.2rem', fontWeight: 'bold', letterSpacing: '2px', marginRight: '1rem' }} onClick={() => handleLevelChange(0)}>Débutant</button>
      <button style={{ fontSize: '1.2rem', fontWeight: 'bold', letterSpacing: '2px', marginRight: '1rem' }} onClick={() => handleLevelChange(1)}>Intermédiaire</button>
      <button style={{ fontSize: '1.2rem', fontWeight: 'bold', letterSpacing: '2px', marginRight: '1rem' }} onClick={() => handleLevelChange(2)}>Expert</button>
      <button style={{ fontSize: '1.2rem', fontWeight: 'bold', letterSpacing: '2px' }} onClick={() => handleLevelChange(3)}>Maitre</button>
    </div>
  </div>
);
};

export default Jeu;