import React from "react";
import { Routes, Route } from "react-router-dom";
import MainPage from "./page/MainPage";
import EnrollPage from "./page/EnrollPage";
import LoginPage from "./page/LoginPage";
import CreateAccountPage from "./page/CreateAccount";
import NoteContent from "./part/NoteContent";


function App() {
  return (
    <Routes>
      <Route element={<NoteContent></NoteContent>}>
        <Route path="/" element={<MainPage></MainPage>} exact={true} />
        <Route path="/login" element={<LoginPage></LoginPage>} />
        <Route path="/create-account" element={<CreateAccountPage></CreateAccountPage>} />
      </Route>
      
      <Route path="/enroll" element={<EnrollPage></EnrollPage>} />
      
    </Routes>
  );
}

export default App;
