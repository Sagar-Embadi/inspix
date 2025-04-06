import React, { useState } from "react";
import axios from "axios";
import logo_wt from "../../Logo/logo_wt.jpeg";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
const Register = () => {
  let navigate = useNavigate();
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
    confirmpassword: "",
  });
  const changeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const submitHandler = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/api/users/", data)
      .then((res) => {
        alert(res.data);
        setData({
          username: "",
          email: "",
          password: "",
          confirmpassword: "",
        });
        navigate("/login");
      })
      .catch((err) => {
        alert(err.response.data);
        console.error(err);
      });
  };
  return (
    <div className="forms">
      <div className="form_box">
        <img src={logo_wt} alt="logo" />
        <form onSubmit={submitHandler} autoComplete="off">
          <TextField
            className="inputs"
            required
            label="Username"
            name="username"
            onChange={changeHandler}
            variant="outlined"
          />
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
          <TextField
            required
            type="password"
            onChange={changeHandler}
            name="confirmpassword"
            label="Confirm Password"
          />
          <Button type="submit" variant="contained">Register</Button>
        </form>
      </div>
      <div className="navigate_login">
        <p>Already have an Account ?</p>
        <span onClick={() => navigate("/login")}>Log in here </span>
      </div>
    </div>
  );
};

export default Register;
