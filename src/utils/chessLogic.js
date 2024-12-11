const isWhitePiece = (piece) => piece === piece.toUpperCase();
const isBlackPiece = (piece) => piece === piece.toLowerCase();
const isOpponentPiece = (piece, turn) =>
  (turn === "white" && isBlackPiece(piece)) ||
  (turn === "black" && isWhitePiece(piece));

const getPieceMoves = (board, position, turn) => {
  const piece = board[position];
  if (!piece) return [];

  const isWhite = isWhitePiece(piece);
  const moves = [];
  const row = Math.floor(position / 8);
  const col = position % 8;

  // Pawn moves
  if (piece.toLowerCase() === "p") {
    const direction = isWhite ? -1 : 1;
    const startRow = isWhite ? 6 : 1;

    // Forward move
    const forwardOne = position + 8 * direction;
    if (!board[forwardOne]) moves.push(forwardOne);

    // Double move from starting position
    const forwardTwo = position + 16 * direction;
    if (row === startRow && !board[forwardOne] && !board[forwardTwo]) {
      moves.push(forwardTwo);
    }

    // Captures
    const captures = [
      position + 8 * direction - 1,
      position + 8 * direction + 1,
    ];
    captures.forEach((target) => {
      if (board[target] && isOpponentPiece(board[target], turn))
        moves.push(target);
    });
  }

  // Knight moves
  if (piece.toLowerCase() === "n") {
    const knightMoves = [
      [row + 2, col + 1],
      [row + 2, col - 1],
      [row - 2, col + 1],
      [row - 2, col - 1],
      [row + 1, col + 2],
      [row + 1, col - 2],
      [row - 1, col + 2],
      [row - 1, col - 2],
    ];
    knightMoves.forEach(([r, c]) => {
      const target = r * 8 + c;
      if (
        r >= 0 &&
        r < 8 &&
        c >= 0 &&
        c < 8 &&
        (!board[target] || isOpponentPiece(board[target], turn))
      ) {
        moves.push(target);
      }
    });
  }

  // King moves
  if (piece.toLowerCase() === "k") {
    const kingMoves = [
      [row + 1, col],
      [row - 1, col],
      [row, col + 1],
      [row, col - 1],
      [row + 1, col + 1],
      [row + 1, col - 1],
      [row - 1, col + 1],
      [row - 1, col - 1],
    ];
    kingMoves.forEach(([r, c]) => {
      const target = r * 8 + c;
      if (
        r >= 0 &&
        r < 8 &&
        c >= 0 &&
        c < 8 &&
        (!board[target] || isOpponentPiece(board[target], turn))
      ) {
        moves.push(target);
      }
    });
  }

  // Rook, bishop, queen moves (handled with helper)
  if (
    piece.toLowerCase() === "r" ||
    piece.toLowerCase() === "b" ||
    piece.toLowerCase() === "q"
  ) {
    moves.push(...getSlidingMoves(board, position, turn, piece.toLowerCase()));
  }

  return moves;
};

const getSlidingMoves = (board, position, turn, piece) => {
  const moves = [];
  const directions = {
    r: [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ], // Rook: straight lines
    b: [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ], // Bishop: diagonals
    q: [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ], // Queen: rook + bishop
  }[piece];

  const row = Math.floor(position / 8);
  const col = position % 8;

  directions.forEach(([dr, dc]) => {
    for (let step = 1; step < 8; step++) {
      const r = row + dr * step;
      const c = col + dc * step;
      if (r < 0 || r >= 8 || c < 0 || c >= 8) break;

      const target = r * 8 + c;
      if (board[target]) {
        if (isOpponentPiece(board[target], turn)) moves.push(target);
        break;
      }
      moves.push(target);
    }
  });

  return moves;
};

const isKingInCheck = (board, turn) => {
  const kingPosition = board.findIndex(
    (piece) =>
      piece &&
      piece.toLowerCase() === "k" &&
      ((turn === "white" && isWhitePiece(piece)) ||
        (turn === "black" && isBlackPiece(piece)))
  );

  return board.some((piece, index) => {
    if (
      !piece ||
      (turn === "white" && isWhitePiece(piece)) ||
      (turn === "black" && isBlackPiece(piece))
    ) {
      return false;
    }

    return getPieceMoves(
      board,
      index,
      turn === "white" ? "black" : "white"
    ).includes(kingPosition);
  });
};

const isCheckmate = (board, turn) => {
  return !board.some((piece, index) => {
    if (
      !piece ||
      (turn === "white" && isBlackPiece(piece)) ||
      (turn === "black" && isWhitePiece(piece))
    ) {
      return false;
    }

    const moves = getPieceMoves(board, index, turn);
    return moves.some((move) => {
      const newBoard = [...board];
      newBoard[move] = newBoard[index];
      newBoard[index] = null;

      return !isKingInCheck(newBoard, turn);
    });
  });
};

export const isLegalMove = (board, from, to, turn) => {
  const piece = board[from];
  if (
    !piece ||
    (turn === "white" && isBlackPiece(piece)) ||
    (turn === "black" && isWhitePiece(piece))
  ) {
    return false;
  }

  const moves = getPieceMoves(board, from, turn);
  const legalMoves = moves.filter((move) => {
    const newBoard = [...board];
    newBoard[move] = newBoard[from];
    newBoard[from] = null;

    return !isKingInCheck(newBoard, turn);
  });

  return legalMoves.includes(to);
};

export const getNotation = (from, to, piece) => {
  const colFrom = String.fromCharCode(97 + (from % 8));
  const rowFrom = 8 - Math.floor(from / 8);
  const colTo = String.fromCharCode(97 + (to % 8));
  const rowTo = 8 - Math.floor(to / 8);
  return `${piece.toUpperCase()}${colFrom}${rowFrom}-${colTo}${rowTo}`;
};
