import React from "react";
import {Routes,Route} from "react-router-dom";
import MainPage from "./page/MainPage";
import EnrollPage from "./page/EnrollPage";
import LoginPage from "./page/LoginPage";
import Tryapi from "./page/Tryapi";



function App() {
  return (
    <Routes>
        <Route path="/" element={<MainPage></MainPage>} exact={true}/>
        <Route path="/login" element={<LoginPage></LoginPage>}/>
        <Route path="/enroll" element={<EnrollPage></EnrollPage>}/>
        <Route path="/tryapi" element={<Tryapi></Tryapi>}/>
    </Routes>
  );
}

export default App;
