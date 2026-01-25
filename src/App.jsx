import React from "react";
import HomePage from "./components/NavigationPage";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import NavigationPage from "./components/NavigationPage";
import ForManisha from "./components/ForManisha";
import CandleBlow from "./components/CandleBlow";
import VideoCollage from "./components/VideoCollage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ForManisha />} />
        <Route path="/candleBlow" element={<CandleBlow />} />

        <Route path="*" element={<HomePage />} />
        <Route path="/video" element={<VideoCollage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
