import React from "react";
import "./ChessBoard.css";

function ChessBoard({ board, onMove }) {
  const renderSquare = (piece, index) => {
    const isLightSquare = (Math.floor(index / 8) + (index % 8)) % 2 === 0; // Alternating light and dark squares
    const squareClass = isLightSquare ? "square light" : "square dark";

    return (
      <div key={index} className={squareClass} onClick={() => onMove(index)}>
        {piece}
      </div>
    );
  };

  return (
    <>
      
      <div className="chessboard">
        {board.map((piece, index) => renderSquare(piece, index))}
      </div>
    </>
  );
}

export default ChessBoard;
