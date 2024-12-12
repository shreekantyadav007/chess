// utils/chessLogic.js

export const PIECE_SYMBOLS = {
  K: "♔", // White King
  Q: "♕", // White Queen
  R: "♖", // White Rook
  B: "♗", // White Bishop
  N: "♘", // White Knight
  P: "♙", // White Pawn
  k: "♚", // Black King
  q: "♛", // Black Queen
  r: "♜", // Black Rook
  b: "♝", // Black Bishop
  n: "♞", // Black Knight
  p: "♟", // Black Pawn
};

// Check if a piece belongs to white
export const isWhitePiece = (piece) => {
  if (!piece) return false; // Handle null/undefined
  return piece === piece.toUpperCase();
};

// Check if a piece belongs to black
export const isBlackPiece = (piece) => {
  if (!piece) return false; // Handle null/undefined
  return piece === piece.toLowerCase();
};

// Check if a piece is an opponent's piece
export const isOpponentPiece = (piece, currentPlayerIsWhite) => {
  if (!piece) return false; // Handle null/undefined
  return currentPlayerIsWhite ? isBlackPiece(piece) : isWhitePiece(piece);
};

export const getPieceMoves = (board, fromIndex, currentPlayerIsWhite) => {
  const piece = board[fromIndex];
  if (!piece) return []; // Handle empty square

  const moves = [];
  const row = Math.floor(fromIndex / 8);
  const col = fromIndex % 8;

  if (isWhitePiece(piece) !== currentPlayerIsWhite) return []; // Ensure the correct player moves

  // Pawn moves
  if (piece.toLowerCase() === "p") {
    const direction = currentPlayerIsWhite ? -1 : 1;
    const forwardIndex = fromIndex + direction * 8;

    // Move forward
    if (board[forwardIndex] === "") {
      moves.push(forwardIndex);
    }

    // Capture diagonally
    const captureLeft = fromIndex + direction * 8 - 1;
    const captureRight = fromIndex + direction * 8 + 1;
    if (col > 0 && isOpponentPiece(board[captureLeft], currentPlayerIsWhite)) {
      moves.push(captureLeft);
    }
    if (col < 7 && isOpponentPiece(board[captureRight], currentPlayerIsWhite)) {
      moves.push(captureRight);
    }
  }

  // Rook moves
  if (piece.toLowerCase() === "r") {
    for (let i = 1; i < 8; i++) {
      const forward = fromIndex - i * 8;
      const backward = fromIndex + i * 8;
      const left = fromIndex - i;
      const right = fromIndex + i;

      if (forward >= 0 && board[forward] === "") moves.push(forward);
      if (backward < 64 && board[backward] === "") moves.push(backward);
      if (col - i >= 0 && board[left] === "") moves.push(left);
      if (col + i < 8 && board[right] === "") moves.push(right);
    }
  }

  // Knight moves
  if (piece.toLowerCase() === "n") {
    const knightMoves = [
      [-2, -1],
      [-2, 1],
      [-1, -2],
      [-1, 2],
      [1, -2],
      [1, 2],
      [2, -1],
      [2, 1],
    ];

    for (const move of knightMoves) {
      const knightIndex = fromIndex + move[0] * 8 + move[1];
      if (knightIndex >= 0 && knightIndex < 64 && (board[knightIndex] === "" || isOpponentPiece(board[knightIndex], currentPlayerIsWhite))) {
        moves.push(knightIndex);
      }
    }
  }

  // Bishop moves
  if (piece.toLowerCase() === "b") {
    const bishopMoves = [
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1],
    ];

    for (const move of bishopMoves) {
      let bishopIndex = fromIndex + move[0] * 8 + move[1];
      while (bishopIndex >= 0 && bishopIndex < 64) {
        if (board[bishopIndex] === "") {
          moves.push(bishopIndex);
          bishopIndex += move[0] * 8 + move[1];
        } else if (isOpponentPiece(board[bishopIndex], currentPlayerIsWhite)) {
          moves.push(bishopIndex);
          break;
        } else {
          break;
        }
      }
    }
  }

  // Queen moves
  if (piece.toLowerCase() === "q") {
    const queenMoves = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];

    for (const move of queenMoves) {
      let queenIndex = fromIndex + move[0] * 8 + move[1];
      while (queenIndex >= 0 && queenIndex < 64) {
        if (board[queenIndex] === "") {
          moves.push(queenIndex);
          queenIndex += move[0] * 8 + move[1];
        } else if (isOpponentPiece(board[queenIndex], currentPlayerIsWhite)) {
          moves.push(queenIndex);
          break;
        } else {
          break;
        }
      }
    }
  }

  // King moves
  if (piece.toLowerCase() === "k") {
    const kingMoves = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];

    for (const move of kingMoves) {
      const kingIndex = fromIndex + move[0] * 8 + move[1];
      if (kingIndex >= 0 && kingIndex < 64 && (board[kingIndex] === "" || isOpponentPiece(board[kingIndex], currentPlayerIsWhite))) {
        moves.push(kingIndex);
      }
    }
  }

  return moves;
};

export const isLegalMove = (
  board,
  fromIndex,
  toIndex,
  currentPlayerIsWhite
) => {
  if (fromIndex === toIndex) return false; // Can't move to the same square

  const piece = board[fromIndex];
  if (!piece) return false; // No piece on source square
  if (isWhitePiece(piece) !== currentPlayerIsWhite) return false; // Ensure turn validity
  if (
    board[toIndex] !== "" &&
    isWhitePiece(board[toIndex]) === currentPlayerIsWhite
  ) {
    return false; // Can't capture own piece
  }

  const moves = getPieceMoves(board, fromIndex, currentPlayerIsWhite);
  return moves.includes(toIndex);
};

// Check if a king is in check
export const isKingInCheck = (board, currentPlayerIsWhite) => {
  const kingSymbol = currentPlayerIsWhite ? "K" : "k";
  const kingPosition = board.indexOf(kingSymbol);

  if (kingPosition === -1) return false; // No king found (edge case)

  for (let i = 0; i < board.length; i++) {
    if (isOpponentPiece(board[i], currentPlayerIsWhite)) {
      const opponentMoves = getPieceMoves(board, i, !currentPlayerIsWhite);
      if (opponentMoves.includes(kingPosition)) {
        return true;
      }
    }
  }

  return false;
};

// Check if it's checkmate
export const isCheckmate = (board, currentPlayerIsWhite) => {
  if (!isKingInCheck(board, currentPlayerIsWhite)) return false;

  for (let fromIndex = 0; fromIndex < board.length; fromIndex++) {
    if (isWhitePiece(board[fromIndex]) === currentPlayerIsWhite) {
      const moves = getPieceMoves(board, fromIndex, currentPlayerIsWhite);
      for (let toIndex of moves) {
        const testBoard = [...board];
        testBoard[toIndex] = testBoard[fromIndex];
        testBoard[fromIndex] = "";
        if (!isKingInCheck(testBoard, currentPlayerIsWhite)) {
          return false; // If any move removes check, it's not checkmate
        }
      }
    }
  }

  return true; // No legal moves that remove check
};

export const getNotation = (from, to, piece) => {
  const colFrom = String.fromCharCode(97 + (from % 8));
  const rowFrom = 8 - Math.floor(from / 8);
  const colTo = String.fromCharCode(97 + (to % 8));
  const rowTo = 8 - Math.floor(to / 8);
  return `${piece.toUpperCase()}${colFrom}${rowFrom}-${colTo}${rowTo}`;
};