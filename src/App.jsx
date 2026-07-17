import React from "react";
import HomePage from "./components/NavigationPage";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import NavigationPage from "./components/NavigationPage";
import ForManisha from "./components/ForManisha";
import EnvelopeComponent from "./components/Envelope.jsx";
import CandleBlow from "./components/CandleBlow";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ForManisha />} />
        <Route path="/candleBlow" element={<CandleBlow />} />

        <Route path="*" element={<HomePage />} />
        <Route path="/env" element={<EnvelopeComponent />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
