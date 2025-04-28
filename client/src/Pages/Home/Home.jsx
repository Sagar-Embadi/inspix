/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import "./Home.css";
import { FaRegHeart, FaRegComment, FaHeart } from "react-icons/fa";
import { TiArrowForwardOutline } from "react-icons/ti";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import axios from "axios";
import { format } from "date-fns";
import { store } from "../../App";
import {
  Button,
  Form,
  FormGroup,
  Modal,
  ModalHeader,
  ModalTitle,
} from "react-bootstrap";
import { useChatStore } from "@/store/useChatStore";
import { getEnv } from "@/helpers/getEnv";
import { HomeSkeleton } from "@/components/Skeletons/HomeSkeleton";
import { showToastify } from "@/helpers/showToastify";
import { Avatar } from "@mui/material";
import { StorySkeleton } from "@/components/Skeletons/StorySkeleton";

export function Home() {
  const [loggedUser, setLoggedUser] = useState(
    JSON.parse(localStorage.getItem("loggedUser"))
  );
  const [update, setUpdate] = useState(store);
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const [stories, setStories] = useState([]);
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

  const { setLoggedInUser } = useChatStore();

  useEffect(() => {
    document.title = "Home";
    setLoggedInUser(JSON.parse(localStorage.getItem("loggedUser")));
    axios
      .get(`${getEnv("VITE_BACKEND_URL")}/api/posts`)
      .then((res) => {
        // console.log(res.data);
        setData(res.data);
      })
      .catch((err) => console.error(err));
    let token = JSON.parse(localStorage.getItem("token"));
    axios
      .get(`${getEnv("VITE_BACKEND_URL")}/api/loggeduser`, {
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
    axios
      .get(`${getEnv("VITE_BACKEND_URL")}/api/users`)
      .then((res) => {
        // console.log(res.data);
        setUsers(res.data.filter((user) => user._id !== loggedUser._id));
        setStories(res.data.filter((user) => user.story));
      })
      .catch((err) => console.error(err));
  }, [update]);

  let handleLike = (x, index) => {
    let likes = x.likes;
    let userLiked = likes.filter((x) => x._id === loggedUser._id);
    if (userLiked.length <= 0) {
      likes.push(loggedUser._id);
      let dd = document.querySelectorAll(".heart");
      dd[index].style.display = "block";
      setTimeout(() => {
        dd[index].style.display = "none";
      }, 500);
      axios
        .post(
          `${getEnv("VITE_BACKEND_URL")}/api/users/${x.usersId}/notifications`,
          {
            type: "like",
            postId: x._id,
            fromUserId: loggedUser._id,
          }
        )
        .catch((err) => console.error(err));
    } else {
      likes = likes.filter((x) => x._id !== loggedUser._id);
    }
    axios
      .patch(`${getEnv("VITE_BACKEND_URL")}/api/posts/${x._id}`, {
        likes,
      })
      .then(() => {
        setUpdate(update + 1);
      })
      .catch((err) => console.log(err));
  };
  const addComment = () => {
    // console.log(selectedPost)
    let comments = selectedPost.comments;
    commentForm.user = loggedUser._id;
    comments.push(commentForm);
    // console.log(comments);

    axios
      .patch(`${getEnv("VITE_BACKEND_URL")}/api/posts/${selectedPost._id}`, {
        comments,
      })
      .then(() => {
        setUpdate(update - 1);
        axios
          .post(
            `${getEnv("VITE_BACKEND_URL")}/api/users/${
              selectedPost.usersId
            }/notifications`,
            {
              type: "comment",
              postId: selectedPost._id,
              fromUserId: loggedUser._id,
            }
          )
          .catch((err) => console.error(err));
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
      .patch(`${getEnv("VITE_BACKEND_URL")}/api/users/${loggedUser._id}`, {
        saved,
      })
      .then(() => {
        // console.log(res.data)
        setUpdate(update + 1);
      })
      .catch((err) => console.error(err));
  };
  const handleShare = (x) => {
    let postUrl = `${window.location.origin}/post/${selectedPost._id}`;
    axios
      .post(`${getEnv("VITE_BACKEND_URL")}/api/messages/send`, {
        senderId: loggedUser._id,
        receiverId: x._id,
        url: postUrl,
        postId: selectedPost._id,
      })
      .then(() => {
        // console.log(res.data);
        showToastify("success", "Message Sent!");
      })
      .catch((err) => {
        showToastify("error", "Failed to send message!");
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <>
      {localStorage.getItem("loggedUser") && (
        <div className="home">
          {stories.length ? (
            <div className="w-full p-3 overflow-x-auto border-b-2 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
              <div className="flex gap-4">
                {stories.map((user) => (
                  <div
                    key={user.id}
                    className="flex flex-col items-center min-w-[60px]"
                  >
                    <div className="w-14 h-14 rounded-full border-2 border-emerald-500 overflow-hidden position-relative">
                      <img
                        src={user.profilePicture}
                        alt={user.username}
                        className="w-full h-full object-cover"
                      />
                      <span className="position-absloute z-index-99">sagarrrr</span>
                    </div>
                    <span className="text-xs mt-1">{user.username}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <StorySkeleton />
          )}
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
                          <span className="username">{x.author.username}</span>
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
                          <TiArrowForwardOutline
                            onClick={() => openModal(x, "share")}
                          />
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
                      {modalType === "likes"
                        ? "Liked by"
                        : modalType === "comments"
                        ? "Comments"
                        : "Share"}
                    </ModalTitle>
                  </ModalHeader>
                  <div className="p-4 overflow-y-scroll scrollbar-hide">
                    {modalType === "likes" ? (
                      selectedPost.likes.map((like, index) => (
                        <div className="likesModel" key={index}>
                          <img src={like.profilePicture} alt="Profile_Pic" />
                          <h2>{like.username}</h2>
                        </div>
                      ))
                    ) : modalType === "comments" ? (
                      selectedPost.comments.map((comment, index) => (
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
                      ))
                    ) : (
                      <div className="flex flex-col gap-3 border-base">
                        {users.map((user, index) => (
                          <div
                            className="shareModel flex gap-2 items-center"
                            key={index}
                          >
                            <Avatar
                              alt="Profile_Pic"
                              src={user.profilePicture}
                              sx={{ width: 56, height: 56 }}
                            />
                            <h3>{user.username}</h3>
                            <Button
                              variant="contained"
                              onClick={() => handleShare(user)}
                              className="shareBtn ml-auto"
                              style={{
                                backgroundColor: "#0095f6",
                                color: "white",
                                marginLeft: "auto",
                              }}
                            >
                              Share
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
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
            <HomeSkeleton />
          )}
        </div>
      )}
    </>
  );
}
