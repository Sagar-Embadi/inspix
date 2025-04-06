import React, { useContext } from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { store } from "../../App";
import { Route, Routes } from "react-router";
import { MainNav } from "../../Pages/MainNav/MainNav";
import { Profile } from "../../Pages/Profile/Profile";
import { Home } from "../../Pages/Home/Home";
import { Search } from "../../Pages/Search/Search";
import { Messages } from "../../Pages/Messages/Messages";

const Dashboard = () => {
  const [loggedUser, setLoggedUser] = useState({});
  const [update] = useContext(store);
  useEffect(() => {
    let token = JSON.parse(localStorage.getItem("token"));
    axios
      .get("http://localhost:5000/api/loggeduser", {
        headers: {
          "x-token": token,
        },
      })
      .then((res) => {
        setLoggedUser(res.data);
        localStorage.setItem("loggedUser", JSON.stringify(res.data));
        // console.log(res.data)
      })
      .catch((err) => console.log(err));
  }, [update]);

  return (
    <div>
      <div style={{ display: "flex" }}>
        <MainNav loggedUser={loggedUser} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/profile/:id"
            element={<Profile loggedUser={loggedUser} />}
          />
          <Route path="/search" element={<Search />} />
          <Route path="/messages" element={<Messages />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
