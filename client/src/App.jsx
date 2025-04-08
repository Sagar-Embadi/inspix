/* eslint-disable react-refresh/only-export-components */
import React, { useState, createContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import DashBoard from "./Components/Dashboard/Dashboard";
import Register from "./Components/Register/Register";
import Login from "./Components/Login/Login";
import { Profile } from './Pages/Profile/Profile';
import { Home } from "./Pages/Home/Home";
import { Search } from "./Pages/Search/Search";
import { Messages } from './Pages/Messages/Messages';
import Notifications from "./Pages/Notifications/Notifications";

export const store = createContext();

const App = () => {
  const [token, setToken] = useState(null);
  const [update, setUpdate] = useState(0);
  return (
    <store.Provider value={[update, setUpdate, token, setToken]}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" Component={Register} />
        <Route path="/" element={
            localStorage.getItem("token") ? ( <DashBoard /> ) : ( <Navigate to="/login" replace /> )
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="search" element={<Search />} />
          <Route path="messages" element={<Messages/>} />
          <Route path="notifications" element={<Notifications/>} />
          <Route path="profile/:id" element={<Profile/>} />
        </Route>
      </Routes>
    </store.Provider>
  );
};

export default App;
