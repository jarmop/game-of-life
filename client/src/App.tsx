import { useEffect, useState } from "react";
import "./App.css";

const cellSize = 4;
const cellsX = 200;
const cellsY = 200;
const startX = 10;
const startY = 10;

function getDeadCells() {
  const deadCells: number[][] = [];
  for (let x = 0; x < cellsX; x++) {
    deadCells[x] = [];
    for (let y = 0; y < cellsY; y++) {
      deadCells[x][y] = 0;
    }
  }

  return deadCells;
}

// Beehive
// const seed: [number, number[]][] = [
//   [0, [1]],
//   [1, [0, 2]],
//   [2, [0, 2]],
//   [3, [1]],
// ];

// Glider
// const seed: [number, number[]][] = [
//   [0, [2]],
//   [1, [0, 2]],
//   [2, [1, 2]],
// ];

// Gosper glider gun
const seed: [number, number[]][] = [
  [0, [5, 6]],
  [1, [5, 6]],
  [10, [5, 6, 7]],
  [11, [4, 8]],
  [12, [3, 9]],
  [13, [3, 9]],
  [14, [6]],
  [15, [4, 8]],
  [16, [5, 6, 7]],
  [17, [6]],
  [20, [3, 4, 5]],
  [21, [3, 4, 5]],
  [22, [2, 6]],
  [24, [1, 2, 6, 7]],
  [34, [3, 4]],
  [35, [3, 4]],
];

const initialCells = getDeadCells();
// seed.forEach(([x, y]) => initialCells[startX + x][startY + y] = 1);
seed.forEach(([x, ys]) => {
  ys.forEach((y) => {
    initialCells[startX + x][startY + y] = 1;
  });
});

function App() {
  const [step, setStep] = useState(0);
  const [play, setPlay] = useState(false);
  const [cells, setCells] = useState(initialCells);

  useEffect(() => {
    const canvas = document.getElementById("canvas") as
      | HTMLCanvasElement
      | null;

    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "black";
        cells.forEach((column, x) => {
          column.forEach((cellAlive, y) => {
            if (cellAlive) {
              ctx.fillRect(
                x * cellSize - 1,
                y * cellSize - 1,
                cellSize,
                cellSize,
              );
            }
          });
        });
      }
    }
  }, [step]);

  useEffect(() => {
    if (play) {
      setTimeout(() => {
        takeStep();
      }, 50);
    }
  }, [play, step]);

  function takeStep() {
    const newCells = getDeadCells();

    cells.forEach((column, x) => {
      column.forEach((cellAlive, y) => {
        const neighbors = [
          cells[x - 1]?.[y - 1] || 0,
          cells[x][y - 1] || 0,
          cells[x + 1]?.[y - 1] || 0,
          cells[x - 1]?.[y] || 0,
          cells[x + 1]?.[y] || 0,
          cells[x - 1]?.[y + 1] || 0,
          cells[x][y + 1] || 0,
          cells[x + 1]?.[y + 1] || 0,
        ];

        const neighborCount = neighbors.reduce((acc, curr) => acc + curr, 0);

        if (cellAlive) {
          // cell is alive
          if (neighborCount < 2) {
            // cell dies by underpopulation
            newCells[x][y] = 0;
          } else if (neighborCount < 4) {
            // cell lives on to the next generation
            newCells[x][y] = 1;
          } else {
            // cell dies by overpopulation
            newCells[x][y] = 0;
          }
        } else {
          // cell is dead
          if (neighborCount === 3) {
            // new cell is born
            newCells[x][y] = 1;
          } else {
            // cell stays dead
            newCells[x][y] = 0;
          }
        }
      });
    });

    setCells(newCells);
    setStep(step + 1);
  }

  return (
    <>
      <button type="button" onClick={takeStep}>step</button>
      <button type="button" onClick={() => setPlay(!play)}>
        {play ? "stop" : "play"}
      </button>
      <div>
        <canvas
          id="canvas"
          width={cellsX * cellSize}
          height={cellsY * cellSize}
          style={{
            border: "1px solid black",
          }}
        >
        </canvas>
      </div>
    </>
  );
}

export default App;
