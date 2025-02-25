import React, { useState, useEffect } from "react";
import { useScoreStore } from "./store";

function Controls() {
  const {
    updateScore,
    resetScores,
    serveTimer,
    timeoutTimer,
    startServeTimer,
    startTimeoutTimer,
    changeSide,
  } = useScoreStore();

  return (
    <div className="controls-container">
      <div className="button-row">
        <button className="btn timeout" onClick={startTimeoutTimer}>
          TIMEOUT
        </button>
        <div className="timer">
          TIMEOUT TIMER {timeoutTimer !== null ? `${timeoutTimer} SEC` : ""}
        </div>
        <button className="btn timeout" onClick={startTimeoutTimer}>
          TIMEOUT
        </button>
      </div>
      {/* <button className="btn cancel-timeout" onClick={cancelTimeout}>
        CANCEL TIMEOUT
      </button> */}
      <div className="button-row">
        <button className="btn serve" onClick={startServeTimer}>
          SERVE
        </button>
        <div className="timer">
          SERVE TIMER {serveTimer !== null ? `${serveTimer} SEC` : ""}
        </div>
        <button className="btn serve" onClick={startServeTimer}>
          SERVE
        </button>
      </div>
      <button className="btn edit-score">EDIT SCORE</button>
      <div className="score-controls">
        <div className="team-controls">
          <button className="btn add" onClick={() => updateScore("team1", 1)}>
            +1
          </button>
          <button
            className="btn subtract"
            onClick={() => updateScore("team1", -1)}
          >
            -1
          </button>
        </div>
        <div className="team-controls">
          <button className="btn add" onClick={() => updateScore("team2", 1)}>
            +1
          </button>
          <button
            className="btn subtract"
            onClick={() => updateScore("team2", -1)}
          >
            -1
          </button>
        </div>
      </div>
      <button className="btn change-side" onClick={changeSide}>
        CHANGE SIDE
      </button>
      {/* <button className="btn reset" onClick={resetScores}>
        RESET
      </button> */}
    </div>
  );
}

export default Controls;
