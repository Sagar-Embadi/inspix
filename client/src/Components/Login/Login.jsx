import React, { useState, useContext } from "react";
import axios from "axios";
import "./Login.css";
import logo_wt from "../../Logo/logo_wt.jpeg";
import { store } from "../../App";
import { Navigate, useNavigate } from "react-router";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
const Login = () => {
  let navigate = useNavigate();
  const [token, setToken] = useContext(store);
  const [data, setData] = useState({
    email: "",
    password: "",
  });
//   const guest = ()=>{
//     setData({
//         email: "test@gmail.com",
//         password: "test@26",
//     })
//   }
  const changeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const submitHandler = (e) => {
    // console.log(data);
    e.preventDefault();
    axios
      .post("http://localhost:5000/api/login", data)
      .then((res) => {
        setToken(res.data.token);
        localStorage.setItem("token", JSON.stringify(res.data.token));
        alert("login Successfull");
      })
      .catch((err) => alert(err.message));
  };
  if (token) {
    return <Navigate to="/" />;
  }
  return (
    <div className="forms">
      <div className="login_form_box">
        <img src={logo_wt} alt="logo" />
        <form onSubmit={submitHandler} autoComplete="off">
          <TextField
            required
            type="email"
            onChange={changeHandler}
            name="email"
            label="Email"
          />
          <TextField
            required
            type="password"
            onChange={changeHandler}
            name="password"
            label="Password"
          />
          <Button type="submit" variant="contained">
            Log In
          </Button>
        </form>
      </div>
      <div className="navigate_box">
        <p> Don't have an Account yet?</p>
        <span onClick={() => navigate("/register")}>Create Acccount here</span>
      </div>
      {/* <div className="guest">
        <h1 onClick={()=>{
            guest()
            submitHandler()
        }}> Guest Login</h1>
      </div> */}
    </div>
  );
};

export default Login;
