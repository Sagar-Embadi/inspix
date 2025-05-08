/* eslint-disable no-unused-vars */
import "./MainNav.css";
import logo from "../../Logo/inspix logo.png";
import textLogo from "../../Logo/inspix text logo.png"
import logoIcon from "../../Logo/inspix_icon.png";
import { Link, useNavigate } from "react-router-dom";
import { TiHome, TiHomeOutline, TiThMenu } from "react-icons/ti";
import { IoSearch, IoSearchOutline } from "react-icons/io5";
import { BiMessageRoundedDetail, BiSolidMessageRoundedDetail } from "react-icons/bi";
import { FiPlusSquare } from "react-icons/fi";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";
import { store } from "../../App";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import Badge from '@mui/material/Badge';
import LogoutIcon from '@mui/icons-material/Logout';
import { TbMessageReport } from "react-icons/tb";
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
import { showToastify } from "@/helpers/showToastify";
import { getEnv } from "@/helpers/getEnv";
import { Avatar } from "@mui/material";
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useChatStore } from "@/store/useChatStore";
import SidebarSkeleton from "@/components/Skeletons/SidebarSkeleton";
import { ArrowBack } from "@mui/icons-material";

export function MainNav({ loggedUser }) {
  let navigate = useNavigate();
  const [update, setUpdate] = useContext(store);
  const [show, setShow] = useState(false);
  const [users, setUsers] = useState([]);
  const {selectedUser, setSelectedUser } = useChatStore();
  const [ active, setActive ] = useState("home")
  useEffect(() => {
    let loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
    axios.get(`${getEnv('VITE_BACKEND_URL')}/api/users`).then((res) => {
      // console.log(res.data.filter((user)=>user._id !== loggedUser._id));
      setUsers(res.data.filter((user) => user._id !== loggedUser._id));
      // setUsers(res.data);
    })
  },[])
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
        // console.log(res.data.url);
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
        .post(`${getEnv('VITE_BACKEND_URL')}/api/posts/`, post)
        .then((res) => {
          // showToastify("success", "post uploaded");
          setUpdate(update + 1);
          axios.post(`${getEnv('VITE_BACKEND_URL')}/api/users/${loggedUser._id}/notifications`, {
            type: "post",
            postId: res.data._id,
            fromUserId: loggedUser._id,
          }).then(() => showToastify("success", "post uploaded")).catch(err=> console.error(err));
        })
        .catch((err) => console.error(err));
    } else alert("Cann't Post at This Moment");
  };
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  const DrawerList = (
    <Box  className="drawer_box" role="presentation" onClick={toggleDrawer(false)}>
        <div className="drawer_header flex align-items-center gap-2 px-2 pt-2 border-bottom-1px border-gray-300">
          <ArrowBack/>
          <h4 onClick={()=>{
            navigate(`/profile/${loggedUser._id}`)
          }}>{loggedUser.username}</h4>
        </div>
      <List>
        {users.length != 0? users.map((user, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton onClick={()=>{
              setSelectedUser(user)
              localStorage.setItem("selectedUser",JSON.stringify(user))
              setUpdate(update+1)
            }}>
              <ListItemIcon>
              <Avatar src={user.profilePicture}/>
              </ListItemIcon>
              <ListItemText primary={user.username} />
            </ListItemButton>
          </ListItem>
        )):<SidebarSkeleton/>}
      </List>
    </Box>
  );
  return (
    <>
      <div className="drawers">
      <div style={{position:'relative'}}>
        <Drawer open={open} onClose={toggleDrawer(false)}>
          {DrawerList}
        </Drawer>
      </div>
      </div>

      <div className="top_nav">
        <div className="flex gap-2" onClick={()=>navigate('/')}><img src={logoIcon} style={{height:40}} />
        <img src={textLogo} style={{height:40}}/></div>
        <div>
          <Link className="link" to="notifications">
            <Badge color="secondary" badgeContent={loggedUser.notifications?loggedUser.notifications.length:0} showZero variant="dot">
            <FaRegHeart className="icon" />
            </Badge>
          </Link>
          <Link className="link" to="messages">
            <Badge color="secondary" badgeContent={0} showZero variant="dot" onClick={()=>{
              localStorage.removeItem("selectedUser")
              setOpen(true)
            }}>
              <BiSolidMessageRoundedDetail className="icon" />
            </Badge>
          </Link>
        </div>
      </div>
      <div className="main_nav">
        <img src={logoIcon} alt="" className="logoIcon" onClick={()=>navigate('/')}/>
        <img src={logo} alt="" className="logo" onClick={()=>navigate('/')}/>
        <div className="nav_links">
          <Link className="link" to="/" onClick={()=>setActive('home')}>
            {active == "home" ? <TiHome className="icon" /> :<TiHomeOutline className="icon"/>}
            <span style={{fontWeight:active=='home'?'bold':'lighter'}}>Home</span>
          </Link>
          <Link className="link" to="search" onClick={()=>{setActive('search')}}>
            {active == 'search' ? <IoSearch className="icon"/>:<IoSearchOutline/>}
            <span style={{fontWeight:active=='search'?'bold':'lighter'}}>Search</span>
          </Link>
          <Link className="link message" to="messages" onClick={()=>{
            localStorage.removeItem("selectedUser")
            setActive('messages')
            setOpen(true)
          }}>
            {active == 'messages' ?<BiSolidMessageRoundedDetail className="icon" />:<BiMessageRoundedDetail className="icon"/>}{" "}
            <span style={{fontWeight:active=='messages'?'bold':'lighter'}}>Messages</span>
          </Link>
          <Link className="link notifications" to="notifications" onClick={()=>setActive('notifications')}>
            {active == 'notifications' ? <FaHeart className="icon" />:<FaRegHeart className="icon"/>}{" "}
            <span style={{fontWeight:active=='notifications'?'bold':'lighter'}}>Notifications</span>
          </Link>
          <Link className="link" onClick={()=>{
            handleShow()
            setActive('post')}}>
            <FiPlusSquare className="icon" />
            <span style={{fontWeight:active=='post'?'bold':'lighter'}}>Post</span>
          </Link>
          <Link
            className="link"
            to={`profile/${loggedUser._id}`}
            onClick={() => {setUpdate(update + 1);setActive('profile')}}
          >
            <img
              src={loggedUser?.profilePicture || "https://th.bing.com/th/id/OIP.Icb6-bPoeUmXadkNJbDP4QHaHa"}
              alt=""
              className="profilePic"
            />{" "}
            <span style={{fontWeight:active=='profile'?'bold':'normal'}}>Profile</span>
          </Link>
        </div>
        <div className="menu ">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="link " onClick={()=>setActive('menu')}>
                <TiThMenu className="icon" />
                <span style={{fontWeight:'lighter'}}>Menu</span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Menu</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <div style={{display:'flex',alignItems:'center',gap:'10px',paddingLeft:'10px'}}>
                <span style={{fontSize:14}}> Switch Appearance </span>
                <Switch/>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem> Report Problem <TbMessageReport style={{color:'red'}}/> </DropdownMenuItem>
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
