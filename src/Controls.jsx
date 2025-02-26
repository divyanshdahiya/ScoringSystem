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
    scoreActive,
    teams,
    sets,
    servingTeam,
    changeServe,
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
      <button className="btn change-side" onClick={changeServe}>
        CHANGE SERVE
      </button>

      <div className="score-box">
        <div className={scoreActive === "team1" ? "score-active" : ""}>
          {servingTeam === "team1" && <span className="ball-emoji">🏐</span>}
          <h1>{teams.team1.score}</h1>
        </div>
        <h1>-</h1>
        <div className={scoreActive === "team2" ? "score-active" : ""}>
          <h1>{teams.team2.score}</h1>
          {servingTeam === "team2" && <span className="ball-emoji">🏐</span>}
        </div>
      </div>

      <div>
        <table className="sets">
          <tbody>
            {sets.map((set, index) => (
              <tr key={index}>
                <td>{set.team1}</td>
                <td>Set {index + 1}</td>
                <td>{set.team2}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Controls;
