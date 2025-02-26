import React from "react";
import { useScoreStore } from "./store";

function Scorecard() {
  const {
    matchDetails,
    teams,
    sets,
    scoreActive,
    timeoutTimer,
    serveTimer,
    servingTeam,
  } = useScoreStore();
  if (!teams?.team1 || !teams?.team2) {
    return <p>Loading scores... Please wait.</p>;
  }
  return (
    <div className="scorecard">
      <div className="score-header">
        <div className="score-header-logo">
          <img
            src="https://media.discordapp.net/attachments/1061730494175256616/1342873096398311547/image.png?ex=67c07d87&is=67bf2c07&hm=8c5ebb44b153f9c788cee7e43e45ba07f9ab597078817a87dab383920f7e2c37&=&format=webp&quality=lossless&width=311&height=453"
            alt="LOGO"
          />
        </div>
        <div className="score-header-title">
          <h1>{matchDetails.tournament}</h1>
          <h2>{matchDetails.date}</h2>
        </div>
      </div>

      <p className="score-match-details">
        {matchDetails.time} : {matchDetails.match} : {matchDetails.category} :{" "}
        {matchDetails.round} : {matchDetails.court}
      </p>

      <div>
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
      </div>
      <div className="vs-banner">
        <div>
          <img
            src="data:image/jpeg;base64,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"
            alt="Thailand Flag"
            className="vs-flag"
          />
        </div>

        <div className="vs-teams">
          <h2 className="team-name">{teams.team1.name}</h2>
          <div className="vs-container">
            <span className="vs-box">
              <h3>VS</h3>
            </span>
          </div>
          <h2 className="team-name">{teams.team2.name}</h2>
        </div>
        <div className="s">
          <img
            src="data:image/jpeg;base64,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"
            alt="Myanmar Flag"
            className="vs-flag"
          />
        </div>
      </div>

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
      <div>
        timeout -{/* Timeout Timer Display */}
        {timeoutTimer !== null && (
          <div className="timeout-timer">
            <h2>Timeout: {timeoutTimer}</h2>
          </div>
        )}
      </div>
      <div>
        serve -{/* Serve Timer Display */}
        {serveTimer !== null && (
          <div className="serve-timer">
            <h2>Serve: {serveTimer}</h2>
          </div>
        )}
      </div>
    </div>
  );
}

export default Scorecard;
