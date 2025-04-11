/* eslint-disable no-unused-vars */
import "./MainNav.css";
import logo from "../../Logo/logo_wt.jpeg";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { TiHome, TiThMenu } from "react-icons/ti";
import { IoSearch } from "react-icons/io5";
import { BiSolidMessageRoundedDetail } from "react-icons/bi";
import { FiPlusSquare } from "react-icons/fi";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useContext, useState } from "react";
import { store } from "../../App";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import Badge from '@mui/material/Badge';
import LogoutIcon from '@mui/icons-material/Logout';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Switch from '@mui/material/Switch';

export function MainNav({ loggedUser }) {
  let navigate = useNavigate();
  const [update, setUpdate] = useContext(store);
  const [token, setToken] = useContext(store);
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
    document.title = "Inspix";
  };
  const handleShow = () => {
    setShow(true);
    document.title = "Post";
  };
  const [post, setPost] = useState({
    media: "",
    title: "",
    author: loggedUser._id,
    usersId: loggedUser._id,
    location: "",
  });
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    // console.log(file)

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "social_media");
    data.append("cloud_name", "dwkkcaveu");

    await axios
      .post("https://api.cloudinary.com/v1_1/dwkkcaveu/image/upload", data)
      .then((res) => {
        console.log(res.data.url);
        setPost({ ...post, [e.target.name]: res.data.url });
        // alert("Post Media Uploaded Successfully")
      })
      .catch((err) => console.error(err));
  };
  const handleChange = (e) => {
    e.preventDefault();
    setPost({ ...post, [e.target.name]: e.target.value });
  };
  const handleSubmitPost = () => {
    post.usersId = loggedUser._id;
    post.author = loggedUser._id;
    if (post.media && post.usersId) {
      console.log(post);
      axios
        .post("https://inspix-backend.onrender.com/api/posts/", post)
        .then((res) => {
          alert("Post Uploaded Succesfully");
          setUpdate(update + 1);
        })
        .catch((err) => console.error(err));
    } else alert("Cann't Post at This Moment");
  };
  return (
    <>
      <div className="top_nav">
        <h1>INSPIX</h1>
        <div>
          <Link className="link" to="notifications">
            <Badge color="secondary" badgeContent={loggedUser.notifications?loggedUser.notifications.length:0} showZero variant="dot">
            <FaRegHeart className="icon" />
            </Badge>
          </Link>
          <Link className="link" to="messages">
            <Badge color="secondary" badgeContent={0} showZero variant="dot">
              <BiSolidMessageRoundedDetail className="icon" />
            </Badge>
          </Link>
        </div>
      </div>
      <div className="main_nav">
        <img src={logo} alt="" />
        <div className="nav_links">
          <Link className="link" to="/">
            <TiHome className="icon" /> <span>Home</span>
          </Link>
          <Link className="link" to="search">
            <IoSearch className="icon" /> <span>Search</span>
          </Link>
          <Link className="link message" to="messages">
            <BiSolidMessageRoundedDetail className="icon" />{" "}
            <span>Messages</span>
          </Link>
          <Link className="link notifications" to="notifications">
            <FaRegHeart className="icon" /> <span>Notifications</span>
          </Link>
          <Link className="link" onClick={handleShow}>
            <FiPlusSquare className="icon" /> <span>Post</span>
          </Link>
          <Link
            className="link"
            to={`profile/${loggedUser._id}`}
            onClick={() => setUpdate(update + 1)}
          >
            <img
              src={loggedUser.profilePicture}
              alt=""
              className="profilePic"
            />{" "}
            <span>Profile</span>
          </Link>
        </div>
        <div className="menu ">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="link ">
                <TiThMenu />
                <span>Menu</span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Menu</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem> Switch Appearance 
                <DropdownMenuShortcut ><Switch/> </DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem> Report Problem </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={()=>{
                  localStorage.removeItem("token")
                  navigate("/login")
                }}> Log Out 
                <DropdownMenuShortcut ><LogoutIcon style={{color:'red'}}/> </DropdownMenuShortcut>
                </DropdownMenuItem>
                
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Modal show={show} centered onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitPost}>
            <Form.Group className="mb-3">
              <Form.Label>Media</Form.Label>
              <Form.Control
                type="file"
                onChange={handleFileUpload}
                name="media"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Caption</Form.Label>
              <Form.Control
                as="textarea"
                value={post.title}
                rows={4}
                name="title"
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              handleClose();
              handleSubmitPost();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
