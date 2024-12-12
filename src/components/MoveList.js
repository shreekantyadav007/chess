import React from "react";

function MoveList({ moves }) {
  console.log(moves);
  
  return (
    <div className="move-list">
      <h3>Move List</h3>
      <ol>
        {moves.map((move, index) => (
          <li key={index}>{move}</li>
        ))}
      </ol>
    </div>
  );
}

export default MoveList;
