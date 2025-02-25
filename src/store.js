import { create } from "zustand";

// Create BroadcastChannel for syncing state across tabs
const channel = new BroadcastChannel("score_store_channel");

export const useScoreStore = create((set) => ({
  matchDetails: {
    tournament: "ISTAF Sepaktakraw World Cup 2025, Bihar, India",
    date: "20 March 2025, Thursday",
    time: "1000 HRS",
    match: "MQ 1",
    category: "Men Quadrant",
    round: "Preliminary",
    court: "Court 1",
  },
  currentSet: JSON.parse(localStorage.getItem("currentSet")) || 0,
  teams: JSON.parse(localStorage.getItem("teams")) ?? {
    team1: { name: "Thailand", score: 0, flag: "thailand.png" },
    team2: { name: "Myanmar", score: 0, flag: "myanmar.png" },
  },
  sets: JSON.parse(localStorage.getItem("sets")) ?? [
    { team1: 0, team2: 0 },
    { team1: 0, team2: 0 },
    { team1: 0, team2: 0 },
  ],
  serveTimer: null,
  timeoutTimer: null,
  scoreActive: JSON.parse(localStorage.getItem("scoreActive")) ?? "team1",

  updateScore: (team, change = 1) =>
    set((state) => {
      const newScore = Math.max(0, state.teams[team].score + change); // Prevent negative scores

      const updatedTeams = {
        ...state.teams,
        [team]: { ...state.teams[team], score: newScore },
      };
      const updateScoreActive =team === "team1" ? "team1" : "team2";

      // Save to localStorage
      setTimeout(() => {
        localStorage.setItem("teams", JSON.stringify(updatedTeams));
        localStorage.setItem("scoreActive", JSON.stringify(updateScoreActive));
      }, 0);

      // Broadcast state change
      channel.postMessage({
        type: "UPDATE_SCORE",
        teams: updatedTeams,
        scoreActive: team,
      });

      return { teams: updatedTeams, scoreActive: updateScoreActive };
    }),

  changeSide: () =>
    set((state) => {
      const validSetIndex = Math.min(state.currentSet, state.sets.length - 1);

      // 🛑 Stop updating if the last set is already filled
      if (
        validSetIndex === state.sets.length - 1 &&
        state.sets[validSetIndex].team1 !== 0 &&
        state.sets[validSetIndex].team2 !== 0
      ) {
        console.log("⚠️ Match completed! No more updates allowed.");
        return {}; // No state change
      }

      const updatedSets = state.sets.map((set, index) =>
        index === validSetIndex
          ? {
              team1: state.teams.team1.score,
              team2: state.teams.team2.score,
            }
          : set
      );

      // Prevent incrementing beyond 3rd set
      const nextSet =
        validSetIndex + 1 < state.sets.length
          ? validSetIndex + 1
          : validSetIndex;

      // Reset scores only if the next set is valid
      const updatedTeams =
        nextSet !== validSetIndex
          ? {
              team1: { ...state.teams.team1, score: 0 },
              team2: { ...state.teams.team2, score: 0 },
            }
          : state.teams; // Keep same teams if no new set is available

      // Save updated data to localStorage
      localStorage.setItem("sets", JSON.stringify(updatedSets));
      localStorage.setItem("teams", JSON.stringify(updatedTeams));
      localStorage.setItem("currentSet", JSON.stringify(nextSet));

      // Broadcast the update
      channel.postMessage({
        type: "CHANGE_SIDE",
        sets: updatedSets,
        teams: updatedTeams,
        currentSet: nextSet,
      });

      return {
        sets: updatedSets,
        teams: updatedTeams,
        currentSet: nextSet,
      };
    }),

  startServeTimer: () => {
    let interval;
    set(() => ({ serveTimer: 15 }));

    interval = setInterval(() => {
      set((state) => {
        if (state.serveTimer <= 1) {
          clearInterval(interval);
          return { serveTimer: null };
        }
        return { serveTimer: state.serveTimer - 1 };
      });
    }, 1000);
  },

  startTimeoutTimer: () => {
    let interval;
    set(() => ({ timeoutTimer: 120 }));

    interval = setInterval(() => {
      set((state) => {
        if (state.timeoutTimer <= 1) {
          clearInterval(interval);
          return { timeoutTimer: null };
        }
        return { timeoutTimer: state.timeoutTimer - 1 };
      });
    }, 1000);
  },
}));

// 🟢 Listen for messages from other tabs
channel.onmessage = (event) => {
  console.log("Broadcast received:", event.data);

  switch (event.data.type) {
    case "UPDATE_SCORE":
      useScoreStore.setState({ teams: event.data.teams, scoreActive: event.data.scoreActive  });
      break;
    case "CHANGE_SIDE":
      useScoreStore.setState({
        sets: event.data.sets,
        teams: event.data.teams,
        currentSet: event.data.currentSet,
      });
      break;
    case "RESET_SCORES":
      useScoreStore.setState({
        teams: event.data.teams,
        sets: event.data.sets,
      });
      break;
    default:
      console.warn("Unknown message type:", event.data.type);
  }
  useScoreStore.setState((state) => ({ ...state }));
};
