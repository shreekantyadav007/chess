import React, { useState, useEffect } from "react";
import ChessBoard from "./components/ChessBoard";
import Timer from "./components/Timer";
import MoveList from "./components/MoveList";
import { isLegalMove, getNotation } from "./utils/chessLogic";
import "./App.css";

const initialBoard = [
  "r",
  "n",
  "b",
  "q",
  "k",
  "b",
  "n",
  "r",
  "p",
  "p",
  "p",
  "p",
  "p",
  "p",
  "p",
  "p",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "P",
  "P",
  "P",
  "P",
  "P",
  "P",
  "P",
  "P",
  "R",
  "N",
  "B",
  "Q",
  "K",
  "B",
  "N",
  "R",
];

function App() {
  const [board, setBoard] = useState(initialBoard);
  const [turn, setTurn] = useState("white"); // 'white' or 'black'
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [moveList, setMoveList] = useState([]);
  const [timers, setTimers] = useState({ white: 600, black: 600 }); // 10 minutes each
  const [activeTimer, setActiveTimer] = useState("white");

  // Timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimers((prev) => ({
        ...prev,
        [activeTimer]: prev[activeTimer] > 0 ? prev[activeTimer] - 1 : 0,
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [activeTimer]);

  const handleSquareClick = (index) => {
    if (selectedSquare === null) {
      // Select a piece
      if (
        board[index] &&
        ((turn === "white" && board[index] === board[index].toUpperCase()) ||
          (turn === "black" && board[index] === board[index].toLowerCase()))
      ) {
        setSelectedSquare(index);
      }
    } else {
      // Attempt to move
      if (isLegalMove(board, selectedSquare, index, turn)) {
        const newBoard = [...board];
        newBoard[index] = newBoard[selectedSquare];
        newBoard[selectedSquare] = null;

        // Update state
        setBoard(newBoard);
        setMoveList([
          ...moveList,
          getNotation(selectedSquare, index, board[selectedSquare]),
        ]);

        setTurn(turn === "white" ? "black" : "white");
        setActiveTimer(turn === "white" ? "black" : "white");
        setSelectedSquare(null);
      } else {
        setSelectedSquare(null); // Deselect invalid moves
      }
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="app">
      <h1 style={{ textAlign: "center" }}>React Chess Game</h1>
      <div className="chess-container">
        <ChessBoard board={board} onMove={handleSquareClick} />
        <div className="info-panel">
          <Timer timers={timers} />
          {/* <MoveList moves={moveList} /> */}
        </div>
      </div>
    </div>
  );
}

export default App;
