/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import "./Profile.css";
import { RiSettings4Fill } from "react-icons/ri";
import { IoGrid } from "react-icons/io5";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Form, Modal } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import { store } from "../../App";
import { useParams } from "react-router-dom";
import { FaRegBookmark } from "react-icons/fa";
import { getEnv } from "@/helpers/getEnv";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../../Components/ui/dropdown-menu";
import Switch from '@mui/material/Switch';
import { TbMessageReport } from "react-icons/tb";
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from "react-router-dom";
import { Avatar } from "@mui/material";
export function Profile() {
  const { id } = useParams();
  const [loggedUser, setLoggedUser] = useState({});
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [editData, setEditData] = useState({});
  const [update, setUpdate] = useContext(store);
  const [posts, setPosts] = useState([]);
  const [displayPosts, setDisplayPosts] = useState([]);
  const navigate = useNavigate();
  const notification = {
    type: "follow",
    fromUserId: loggedUser._id,
  };

  useEffect(() => {
    // console.log(id)
    document.title = "Profile";
    axios
      .get(`${getEnv("VITE_BACKEND_URL")}/api/users/${id}`)
      .then((res) => {
        // console.log(res.data);
        setData(res.data);
        setEditData(res.data);
        document.title = `Profile-${res.data.username}`;
      })
      .catch((err) => console.error(err));
    axios.get(`${getEnv("VITE_BACKEND_URL")}/api/posts`).then((res) => {
      // console.log(res.data);
      // console.log(res.data.filter(x=>x.usersId === `67d3f1bed71908396f5c3030`))
      setPosts(res.data.filter((x) => x.usersId === id));
      setDisplayPosts(res.data.filter((x) => x.usersId === id));
      setLoggedUser(JSON.parse(localStorage.getItem("loggedUser")));
    });
  }, [update]);
  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    // console.log(file);

    if (!file) return;

    const fileData = new FormData();
    fileData.append("file", file);
    fileData.append("upload_preset", "social_media");
    fileData.append("cloud_name", "dwkkcaveu");

    await axios
      .post("https://api.cloudinary.com/v1_1/dwkkcaveu/image/upload", fileData)
      .then((res) => {
        // console.log(res.data.url)
        setEditData({ ...editData, [e.target.name]: res.data.url });
        // alert("Profile Photo Uploaded Successfully")
      })
      .catch((err) => console.error(err));
  };
  const handleEditDetails = async () => {
    await axios
      .patch(`${getEnv("VITE_BACKEND_URL")}/api/users/${data._id}`, editData)
      .then((res) => {
        // console.log(res.data)
        alert("updated successfully");
        setUpdate(update + 1);
      })
      .catch((err) => console.error(err));
  };
  const handleDelete = () => {
    axios
      .delete(`${getEnv("VITE_BACKEND_URL")}/api/users/${id}`)
      .then((deleted) => alert("deleted"));
  };
  const handleDeletePost = (x) => {
    axios
      .delete(`${getEnv("VITE_BACKEND_URL")}.com/api/posts/${x._id}`)
      .then((res) => {
        alert("post Deleted");
        setUpdate(update + 1);
      })
      .catch((err) => alert("conn't delete at this time"));
  };
  const handleFollow = (x) => {
    // console.log(data,"\n",loggedUser);
    let lgu = loggedUser.following;
    let su = data.followers;
    // console.log(lgu);
    // console.log((data.followers.filter(x=>x.id === loggedUser.id)).length);

    if (lgu.includes(id)) {
      lgu = lgu.filter((x) => x !== id);
      su = su.filter((x) => x._id !== loggedUser._id);
    } else {
      lgu = lgu.filter((x) => x !== id);
      lgu.push(id);
      // console.log(lgu);
      su = su.filter((x) => x._id !== loggedUser._id);
      su.push(loggedUser._id);
      notification.fromUserId = loggedUser._id;
      axios
        .post(
          `${getEnv("VITE_BACKEND_URL")}/api/users/${id}/notifications`,
          notification
        )
        .catch((err) => console.error(err));
    }
    try {
      axios.patch(`${getEnv("VITE_BACKEND_URL")}/api/users/${loggedUser._id}`, {
        following: lgu,
      });
      axios
        .patch(`${getEnv("VITE_BACKEND_URL")}/api/users/${id}`, {
          followers: su,
        })
        .then((res) => {
          // notification.fromUserId = loggedUser._id;
          // axios.post(`${getEnv('VITE_BACKEND_URL')}/api/users/${id}/notifications`, notification).catch(err => console.error(err));
          setUpdate(update + 1);
        });
    } catch (err) {
      console.log(err);
    }
  };
  const handlePosts = (x) => {
    if (x === "posts") {
      setDisplayPosts(posts);
    } else if (x === "saved") {
      setDisplayPosts(data.saved);
    }
  };
  return (
    <div className="profile">
      {Object.keys(data).length > 1 ? (
        <div>
          <div className="profile_details">
            <div className="profile_pic">
              <Avatar 
               src={data.profilePicture} alt="profile_photo" className="profile_img"/>
            </div>
            <div className="profile_following">
              <div className="username">
                <h1>{data.username}</h1>
                {loggedUser._id == id &&<button onClick={handleShow}>Edit Profile</button>}
                {/* <button onClick={handleDelete}>DELETE</button> */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <RiSettings4Fill className="setting_icon" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Menu</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          paddingLeft: "10px",
                        }}
                      >
                        <span style={{ fontSize: 14 }}>
                          {" "}
                          Switch Appearance{" "}
                        </span>
                        <Switch />
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        {" "}
                        Report Problem{" "}
                        <TbMessageReport style={{ color: "red" }} />{" "}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          localStorage.removeItem("token");
                          navigate("/login");
                        }}
                      >
                        {" "}
                        Log Out
                        <DropdownMenuShortcut>
                          <LogoutIcon style={{ color: "red" }} />{" "}
                        </DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="followers_following">
                <div className="posts">
                  <h2>{posts.length}</h2>
                  <p>Posts</p>
                </div>
                <div className="followers">
                  <h2>{data.followers.length}</h2>
                  <p>Followers</p>
                </div>
                <div className="following">
                  <h2>{data.following.length}</h2>
                  <p>Following</p>
                </div>
              </div>
              {loggedUser._id !== id && (
                <div className="follow_buttons">
                  <button
                    className="follow_unfollow"
                    onClick={() => handleFollow(data)}
                  >
                    {data.followers.filter((x) => x.id === loggedUser.id).length
                      ? "Un Follow"
                      : "Follow"}
                  </button>
                  <button className="message_btn">Message</button>
                </div>
              )}
              <div className="name_bio">
                <h2>{data.displayName}</h2>
                <p>{data.bio}</p>
                {/* <audio
                  src="https://github.com/nikki9381/SPOTIFY-PROJECT/raw/refs/heads/main/%5BiSongs.info%5D%2001%20-%20Adiga%20Adiga.mp3"
                  controls
                ></audio> */}
              </div>
            </div>
          </div>

          <div className="view_posts">
            <div className="select_posts">
              <h2 title="posts" onClick={() => handlePosts("posts")}>
                <IoGrid /> <span>POSTS</span>
              </h2>
              <h2 title="saved" onClick={() => handlePosts("saved")}>
                <FaRegBookmark />
                <span>SAVED</span>{" "}
              </h2>
            </div>
            <div className="post_section">
              {displayPosts.map((x, index) => {
                return (
                  <div className="post_card" key={index}>
                    <img src={x.media} alt={data.caption} />
                    {/* <p>Likes : {x.likes.length}</p>
                    <p>Comments : {x.comments.length}</p>
                    <Button
                      onClick={() => {
                        handleDeletePost(x);
                        setUpdate(update + 1);
                      }}
                    >
                      DELETE
                    </Button> */}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <h1>'loading...'</h1>
      )}
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditDetails}>
            <Form.Group className="mb-3">
              <Form.Label>User Name</Form.Label>
              <Form.Control
                type="text"
                autoFocus
                onChange={handleChange}
                name="username"
                value={editData.username}
                required={true}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Profile Photo</Form.Label>
              <Form.Control
                type="file"
                onChange={handleFileUpload}
                name="profilePicture"
                required={true}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                onChange={handleChange}
                name="email"
                value={editData.email}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Display Name</Form.Label>
              <Form.Control
                type="text"
                onChange={handleChange}
                name="displayName"
                value={editData.displayName}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Bio</Form.Label>
              <Form.Control
                type="text"
                onChange={handleChange}
                name="bio"
                value={editData.bio}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              handleEditDetails();
              handleClose();
            }}
            type="submit"
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
