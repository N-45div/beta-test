import { Routes, Route } from "react-router";
import HomePage from "../Pages/HomePage";
import LevelOneQuizPage from "../Pages/LevelOneQuizPage";
import Level2 from "../Pages/LevelTwo";
import LevelTwoPart_Two from "../Pages/Level2_PartTwo";
import MatchingExercise from "../components/MatchingExercise";
import { matchingData } from "../data/matchingData";
import LevelOneDesign from "../Pages/Level1_newDesign";
import Level3_Quiz from "../Pages/Level3Quiz";
import Questionnaire_Level3 from "../Pages/Questionnaire_Level3";
import Calculations from "../Pages/Calculations";
import Calculations_2 from "../Pages/Calculations_2";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/Level-One-Quiz" element={<LevelOneQuizPage />} />
      <Route path="/Level-Two" element={<Level2 />} />
      <Route path="/Matching-Exercise" element={<MatchingExercise data={matchingData} />} /> {/* Add new route */}
      <Route path="Level-Two-Part-Two" element={<LevelTwoPart_Two />} />
      <Route path="Level-One-Design" element={<LevelOneDesign />} />
      <Route path="/Level-Three-Quiz" element={<Level3_Quiz />} />
      <Route path="/Questionnaire_Level3" element={<Questionnaire_Level3 />} />
      <Route path="/Calculations" element={<Calculations />} />
      <Route path="/Calculations_2" element={<Calculations_2 />} />
    </Routes>
  );
};

export default AppRoutes;
