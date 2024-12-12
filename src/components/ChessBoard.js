import React, { useState } from "react";
import "./ChessBoard.css";
import {
  PIECE_SYMBOLS,
  isLegalMove,
  isKingInCheck,
  isCheckmate,
  isWhitePiece,
} from "../utils/chessLogic";

const ChessBoard = () => {
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

  const [board, setBoard] = useState(initialBoard);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [currentPlayerIsWhite, setCurrentPlayerIsWhite] = useState(true); // White starts the game
  const [message, setMessage] = useState("");

  const handleSquareClick = (index) => {
    if (selectedSquare === null) {
      // Try to select a piece
      if (board[index] && isWhitePiece(board[index]) === currentPlayerIsWhite) {
        setSelectedSquare(index);
      } else {
        setMessage("Please select a valid piece.");
      }
    } else {
      // Attempt to move the selected piece
      if (isLegalMove(board, selectedSquare, index, currentPlayerIsWhite)) {
        const newBoard = [...board];
        newBoard[index] = newBoard[selectedSquare]; // Move the piece
        newBoard[selectedSquare] = ""; // Clear the original square
        setBoard(newBoard); // Update the board state

        // Check for special conditions
        if (isKingInCheck(newBoard, !currentPlayerIsWhite)) {
          setMessage("Check!");
        }
        if (isCheckmate(newBoard, !currentPlayerIsWhite)) {
          setMessage("Checkmate!");
        }

        setCurrentPlayerIsWhite(!currentPlayerIsWhite); // Switch turn
      } else {
        setMessage("Illegal move.");
      }
      setSelectedSquare(null); // Deselect the square
    }
  };

  const renderSquare = (index) => {
    const isSelected = selectedSquare === index;

    return (
      <div
        className={`square ${isSelected ? "selected" : ""}`}
        onClick={() => handleSquareClick(index)}
      >
        {board[index] ? PIECE_SYMBOLS[board[index]] : ""}
      </div>
    );
  };

  return (
    <div>
      
      <div className="board">
        {board.map((_, index) => renderSquare(index))}
      </div>
      <div className="info">
        <p>{message}</p>
        <p>Turn: {currentPlayerIsWhite ? "White ♔" : "Black ♚"}</p>
      </div>
    </div>
  );
};

export default ChessBoard;
