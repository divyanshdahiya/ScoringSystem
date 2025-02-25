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
  teams: JSON.parse(localStorage.getItem("teams")) || {
    player1: { name: "Thailand", score: 0, flag: "thailand.png" },
    player2: { name: "Myanmar", score: 0, flag: "myanmar.png" },
  },
  sets: JSON.parse(localStorage.getItem("sets")) || [
    { player1: 0, player2: 0 },
    { player1: 0, player2: 0 },
    { player1: 0, player2: 0 },
  ],
  serveTimer: null,
  timeoutTimer: null,

  updateScore: (player, change = 1) =>
    set((state) => {
      const newScore = Math.max(0, state.teams[player].score + change); // Prevent negative scores
  
      const updatedTeams = {
        ...state.teams,
        [player]: { ...state.teams[player], score: newScore },
      };
        
      // Save to localStorage
      localStorage.setItem("teams", JSON.stringify(updatedTeams));
  
      // Broadcast state change
      channel.postMessage({ type: "UPDATE_SCORE", teams: updatedTeams });
  
      return { teams: updatedTeams };
    }),

    changeSide: () => set((state) => {
      const validSetIndex = Math.min(state.currentSet, state.sets.length - 1);
    
      // 🛑 Stop updating if the last set is already filled
      if (validSetIndex === state.sets.length - 1 && state.sets[validSetIndex].player1 !== 0 && state.sets[validSetIndex].player2 !== 0) {
        console.log("⚠️ Match completed! No more updates allowed.");
        return {}; // No state change
      }
    
      const updatedSets = [...state.sets];
      updatedSets[validSetIndex] = {
        player1: state.teams.player1.score,
        player2: state.teams.player2.score,
      };
    
      // Prevent incrementing beyond 3rd set
      const nextSet = validSetIndex + 1 < state.sets.length ? validSetIndex + 1 : validSetIndex;
    
      // Reset scores only if the next set is valid
      const updatedTeams = nextSet !== validSetIndex ? {
        player1: { ...state.teams.player1, score: 0 },
        player2: { ...state.teams.player2, score: 0 },
      } : state.teams; // Keep same teams if no new set is available
    
      // Save updated data to localStorage
      localStorage.setItem("sets", JSON.stringify(updatedSets));
      localStorage.setItem("teams", JSON.stringify(updatedTeams));
      localStorage.setItem("currentSet", JSON.stringify(nextSet));
    
      // Broadcast the update
      channel.postMessage({ 
        type: "CHANGE_SIDE", 
        sets: updatedSets, 
        teams: updatedTeams, 
        currentSet: nextSet 
      });
    
      return { sets: updatedSets, teams: updatedTeams, currentSet: nextSet };
    }),
  
  startServeTimer: () => {
    set(() => ({ serveTimer: 15 }));

    const interval = setInterval(() => {
      set((state) => {
        if (state.serveTimer <= 1) {
          clearInterval(interval);
          return { serveTimer: 15 };
        }
        return { serveTimer: state.serveTimer - 1 };
      });
    }, 1000);
  },

  startTimeoutTimer: () => {
    set(() => ({ timeoutTimer: 120 }));

    const interval = setInterval(() => {
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
  console.log("Broadcast received:", event.data); // Debugging
  if (event.data.type === "UPDATE_SCORE") {
    useScoreStore.setState({ teams: event.data.teams });
  }
  if (event.data.type === "CHANGE_SIDE") {
    useScoreStore.setState({
      sets: event.data.sets,
      teams: event.data.teams,
      currentSet: event.data.currentSet,
    });
  }
  if (event.data.type === "RESET_SCORES") {
    useScoreStore.setState({ teams: event.data.teams, sets: event.data.sets });
  }
};



// // working solution without local storage store.js (Zustand Store)
// import { create } from "zustand";

// export const useScoreStore = create((set) => ({
//   matchDetails: {
//     tournament: "ISTAF Sepaktakraw World Cup 2025, Bihar, India",
//     date: "20 March 2025, Thursday",
//     time: "1000 HRS",
//     match: "MQ 1",
//     category: "Men Quadrant",
//     round: "Preliminary",
//     court: "Court 1",
//   },
//   teams: {
//     player1: { name: "Thailand", score: 8, flag: "thailand.png" },
//     player2: { name: "Myanmar", score: 13, flag: "myanmar.png" },
//   },
//   sets: [
//     { player1: 5, player2: 15 },
//     { player1: 0, player2: 0 },
//     { player1: 0, player2: 0 },
//   ],
//   serveTimer: null,
//   timeoutTimer: null,
// updateScore: (player, change = 1) =>
//     set((state) => ({
//       teams: {
//         ...state.teams,
//         [player]: { 
//           ...state.teams[player], 
//           score: Math.max(0, state.teams[player].score + change) // Prevent negative scores
//         },
//       },
//     })),
// //   resetScores: () =>
// //     set(() => ({
// //       teams: {
// //         player1: { name: "Thailand", score: 0, flag: "thailand.png" },
// //         player2: { name: "Myanmar", score: 0, flag: "myanmar.png" },
// //       },
// //       sets: [
// //         { player1: 0, player2: 0 },
// //         { player1: 0, player2: 0 },
// //         { player1: 0, player2: 0 },
// //       ],
// //     })),



//   startServeTimer: () => {
//     set({ serveTimer: 15 });
//     const interval = setInterval(() => {
//       set((state) => {
//         if (state.serveTimer > 0) return { serveTimer: state.serveTimer - 1 };
//         clearInterval(interval);
//         return { serveTimer: 15 };
//       });
//     }, 1000);
//   },
//   startTimeoutTimer: () => {
//     set({ timeoutTimer: 60 });
//     const interval = setInterval(() => {
//       set((state) => {
//         if (state.timeoutTimer > 0) return { timeoutTimer: state.timeoutTimer - 1 };
//         clearInterval(interval);
//         return { timeoutTimer: 60 };
//       });
//     }, 1000);
//   },



// }));
