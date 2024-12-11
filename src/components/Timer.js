import React from "react";

function Timer({ timers }) {
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="timer">
      <h3>Timers</h3>
      <p>White: {formatTime(timers.white)}</p>
      <p>Black: {formatTime(timers.black)}</p>
    </div>
  );
}

export default Timer;
