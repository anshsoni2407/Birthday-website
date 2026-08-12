import React, { Suspense, lazy } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { MusicProvider } from "./context/MusicContext";
import ImageSlider1 from "./components/ImageSlider1";
import DateLocker from "./components/DateLocker.jsx";

const NavigationPage = lazy(() => import("./components/NavigationPage"));
const EnvelopeComponent = lazy(() => import("./components/Envelope.jsx"));
const CandleBlow = lazy(() => import("./components/CandleBlow"));

const App = () => {
  return (
    <BrowserRouter>
      <MusicProvider>
        <Suspense
          fallback={
            <div
              style={{
                minHeight: "100vh",
                backgroundColor: "#000",
              }}
            />
          }
        >
          <Routes>
            <Route path="/" element={<ImageSlider1 />} />
            <Route path="/candleBlow" element={<CandleBlow />} />
            <Route path="*" element={<NavigationPage />} />
            <Route path="/date-lock" element={<DateLocker />} />
           
            <Route path="/env" element={<EnvelopeComponent />} />
          </Routes>
        </Suspense>
      </MusicProvider>
    </BrowserRouter>
  );
};

export default App;
