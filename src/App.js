import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SignUp from "./SignUp";
import Login from "./Login";
import Ameerchatbox from "./Ameerchatbox";
import { UserProvider } from "./UserContext";
import "./styles.css";
import AuthCheck from "./AuthCheck";

export default function AppRouter() {
  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    return token != null;
  };

  return (
    <Router>
      <UserProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<Navigate to="/signup" />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<AuthCheck />}>
              <Route path="ameerchatbox" element={<Ameerchatbox />}></Route>
              <Route path="ameerchatbox/:id" element={<Ameerchatbox />}></Route>
            </Route>
            <Route path="*" element={<Navigate to="/signup" />} />
          </Routes>
        </div>
      </UserProvider>
    </Router>
  );
}
