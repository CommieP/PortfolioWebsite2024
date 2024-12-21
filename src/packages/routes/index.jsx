import { BrowserRouter, Route, Routes } from "react-router-dom";
import AboutPage from "../AboutPage";
import NavBar from "../NavBar";
import ThreeBlobBackground from "../ThreeBlobBackground";
import ProjectsPage from "../ProjectsPage";
import ExplorationPage from "../ExplorationsPage";

function RoutesHOC() {
  return (
    <BrowserRouter>
      <ThreeBlobBackground></ThreeBlobBackground>
      <NavBar />
      <Routes>
        <Route exact path="/about" element={<AboutPage />} />
        <Route exact path="/projects" element={<ProjectsPage />} />
        <Route exact path="/explorations" element={<ExplorationPage />} />
        <Route exact path="/" element={<AboutPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default RoutesHOC;
