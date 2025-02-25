import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Scorecard from "./Scorecard";
import Controls from "./Controls";


function App() {
  return (
  <>
  <Router>
      <Routes>
        <Route path="/" element={<Scorecard/>}/>
        <Route path="/controls" element={<Controls/>}/>
      </Routes>
    </Router>
  </>
  );
}

export default App;
