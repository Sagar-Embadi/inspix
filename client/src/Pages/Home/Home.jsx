import { useEffect, useState } from "react";
import "./Home.css";
import { FaRegHeart, FaRegComment, FaHeart } from "react-icons/fa";
import { TiArrowForwardOutline } from "react-icons/ti";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import axios from "axios";
import { format } from "date-fns";
import { store } from "../../App";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Skeleton from "@mui/material/Skeleton";
import {
  Button,
  Form,
  FormGroup,
  Modal,
  ModalHeader,
  ModalTitle,
} from "react-bootstrap";
export function Home() {
  const [loggedUser, setLoggedUser] = useState(
    JSON.parse(localStorage.getItem("loggedUser"))
  );
  const [update, setUpdate] = useState(store);
  const [data, setData] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [modalType, setModalType] = useState("");
  const [commentForm, setCommentForm] = useState({
    user: "",
    text: "",
  });

  const openModal = (post, type) => {
    setSelectedPost(post);
    setModalType(type);
    console.log(modalType);
  };

  useEffect(() => {
    document.title = "Home";
    axios
      .get("https://inspix-backend.onrender.com/api/posts/")
      .then((res) => {
        // console.log(res.data);
        setData(res.data);
      })
      .catch((err) => console.error(err));
    let token = JSON.parse(localStorage.getItem("token"));
    axios
      .get("https://inspix-backend.onrender.com/api/loggeduser", {
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

  let handleLike = (x, index) => {
    let likes = x.likes;
    let userLiked = likes.filter((x) => x._id === loggedUser._id);
    if (userLiked.length <= 0) {
      likes.push(loggedUser._id);
    } else {
      likes = likes.filter((x) => x._id !== loggedUser._id);
    }
    axios
      .patch(`https://inspix-backend.onrender.com/api/posts/${x._id}`, {
        likes,
      })
      .then(() => {
        setUpdate(update + 1);
        let dd = document.querySelectorAll(".heart");
        dd[index].style.display = "block";
        setTimeout(() => {
          dd[index].style.display = "none";
        }, 500);
        axios.post(`https://inspix-backend.onrender.com/api/users/${x.usersId}/notifications`, {
          type: "like",
          postId: x._id,
          fromUserId: loggedUser._id,
        }).catch(err=> console.error(err));
      })
      .catch((err) => console.log(err));
  };
  const addComment = () => {
    // console.log(selectedPost)
    let comments = selectedPost.comments;
    commentForm.user = loggedUser._id;
    comments.push(commentForm);
    console.log(comments);

    axios
      .patch(
        `https://inspix-backend.onrender.com/api/posts/${selectedPost._id}`,
        { comments }
      )
      .then(() => {
        setUpdate(update - 1)
        axios.post(`https://inspix-backend.onrender.com/api/users/${selectedPost.usersId}/notifications`, {
          type: "comment",
          postId: selectedPost._id,
          fromUserId: loggedUser._id,
        }).catch(err=> console.error(err));
      })
      .catch((err) => console.log(err));
  };
  const handleSave = (x) => {
    let saved = loggedUser.saved;
    if (loggedUser.saved.includes(x._id)) {
      saved = saved.filter((post) => post !== x._id);
    } else {
      // saved =saved.filter(post=>post !== x._id)
      saved.push(x._id);
    }
    localStorage.setItem("loggedUser", JSON.stringify(loggedUser));
    // console.log(x,saved);
    axios
      .patch(
        `https://inspix-backend.onrender.com/api/users/${loggedUser._id}`,
        { saved }
      )
      .then(() => {
        // console.log(res.data)
        setUpdate(update + 1);
      })
      .catch((err) => console.error(err));
  };
  return (
    <>
      {localStorage.getItem("loggedUser") && (
        <div className="home">
          {data.length ? (
            <>
              <div className="home_posts">
                {data.map((x, index) => {
                  let date = format(new Date(x.createdAt), "MMM d");
                  return (
                      <div className="post-card" key={index}>
                        <div className="post-header">
                          <img
                            src={x.author.profilePicture}
                            alt="Profile_Picture"
                            className="profile-pic"
                          />
                          <div>
                            <span className="username">
                              {x.author.username}
                            </span>
                            <span className="location">{x.location}</span>
                          </div>
                        </div>
                        <div className="post-media">
                          <img
                            src={x.media}
                            alt="Post content"
                            className="post-image"
                            onDoubleClick={() => handleLike(x, index)}
                          />
                          <div className="heart animate__flash">
                            <FaHeart
                              style={{
                                color: "white",
                                fontSize: 80,
                                display: "block",
                              }}
                            />
                          </div>
                        </div>
                        <div className="post-actions">
                          <div className="like-btn" title="Like">
                            <span onClick={() => handleLike(x, index)}>
                              {x.likes.filter((x) => x._id === loggedUser._id)
                                .length !== 0 ? (
                                <FaHeart style={{ color: "red" }} />
                              ) : (
                                <FaRegHeart />
                              )}
                            </span>
                            <span
                              className="count"
                              onClick={() => openModal(x, "likes")}
                            >
                              {x.likes.length}
                            </span>
                          </div>
                          <div
                            className="comment-btn"
                            title="Comment"
                            onClick={() => openModal(x, "comments")}
                          >
                            <FaRegComment />{" "}
                            <span className="count">{x.comments.length}</span>
                          </div>
                          <div className="share-btn" title="Share">
                            <TiArrowForwardOutline />
                          </div>
                          <div
                            className="save-btn"
                            title="Save"
                            onClick={() => handleSave(x, index)}
                          >
                            {loggedUser.saved.includes(x._id) ? (
                              <FaBookmark />
                            ) : (
                              <FaRegBookmark />
                            )}
                          </div>
                        </div>

                        <div className="post-details">
                          <div className="caption">
                            <span className="caption-username">
                              {x.author.username}
                            </span>
                            <span className="caption-text">{x.title}</span>
                          </div>
                          <div className="timestamp">{date}</div>
                        </div>
                      </div>
                  );
                })}
              </div>
              {selectedPost && (
                <Modal show={selectedPost}>
                  <ModalHeader
                    closeButton
                    onClick={() => setSelectedPost(null)}
                  >
                    <ModalTitle>
                      {modalType === "likes" ? "Liked by" : "Comments"}
                    </ModalTitle>
                  </ModalHeader>
                  <div className="p-4">
                    {modalType === "likes"
                      ? selectedPost.likes.map((like, index) => (
                          <div className="likesModel" key={index}>
                            <img src={like.profilePicture} alt="Profile_Pic" />
                            <h2>{like.username}</h2>
                          </div>
                        ))
                      : selectedPost.comments.map((comment, index) => (
                          <div className="commentsModal" key={index}>
                            <img
                              src={comment.user.profilePicture}
                              alt="Profile_Pic"
                            />
                            <div>
                              <h4>{comment.user.username}</h4>
                              <p>{comment.text}</p>
                            </div>
                          </div>
                        ))}
                  </div>
                  <div className="modalFooter">
                    {modalType === "comments" && (
                      <Form>
                        <FormGroup className="commentForm">
                          <img src={loggedUser.profilePicture} alt="" />
                          <Form.Control
                            type="text"
                            placeholder="Add a comment"
                            onChange={(e) =>
                              setCommentForm({
                                ...commentForm,
                                text: e.target.value,
                              })
                            }
                          />
                          <Button
                            disabled={!commentForm.text}
                            onClick={() => {
                              addComment(selectedPost);
                            }}
                          >
                            Send
                          </Button>
                        </FormGroup>
                      </Form>
                    )}
                  </div>
                </Modal>
              )}
            </>
          ) : (
            <div className="loading_effect" key={1}>
              <Card sx={{ maxWidth: "100%", m: 2 }}>
                <CardHeader
                  avatar={
                    <Skeleton
                      animation="wave"
                      variant="circular"
                      width={40}
                      height={40}
                    />
                  }
                  action={
                    <IconButton aria-label="settings">
                      <MoreVertIcon />
                    </IconButton>
                  }
                  title={
                    <Skeleton
                      animation="wave"
                      height={10}
                      width="80%"
                      style={{ marginBottom: 6 }}
                    />
                  }
                  subheader={
                    <Skeleton animation="wave" height={10} width="40%" />
                  }
                />
                <Skeleton
                  sx={{ height: 390 }}
                  animation="wave"
                  variant="rectangular"
                />
                <CardContent>
                  <>
                    <Skeleton
                      animation="wave"
                      height={10}
                      style={{ marginBottom: 6 }}
                    />
                    <Skeleton animation="wave" height={10} width="80%" />
                  </>
                </CardContent>
              </Card>
              <Card sx={{ maxWidth: "100%", m: 2 }}>
                <CardHeader
                  avatar={
                    <Skeleton
                      animation="wave"
                      variant="circular"
                      width={40}
                      height={40}
                    />
                  }
                  action={
                    <IconButton aria-label="settings">
                      <MoreVertIcon />
                    </IconButton>
                  }
                  title={
                    <Skeleton
                      animation="wave"
                      height={10}
                      width="80%"
                      style={{ marginBottom: 6 }}
                    />
                  }
                  subheader={
                    <Skeleton animation="wave" height={10} width="40%" />
                  }
                />
                <Skeleton
                  sx={{ height: 390 }}
                  animation="wave"
                  variant="rectangular"
                />
                <CardContent>
                  <>
                    <Skeleton
                      animation="wave"
                      height={10}
                      style={{ marginBottom: 6 }}
                    />
                    <Skeleton animation="wave" height={10} width="80%" />
                  </>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}
    </>
  );
}
