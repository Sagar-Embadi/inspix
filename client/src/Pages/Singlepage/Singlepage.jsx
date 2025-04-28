/* eslint-disable react-hooks/exhaustive-deps */
import { store } from "@/App";
import { getEnv } from "@/helpers/getEnv";
import axios from "axios";
import { format } from "date-fns";
import { useContext, useEffect, useState } from "react";
import {
    Button,
    Form,
    FormGroup,
    Modal,
    ModalHeader,
    ModalTitle,
  } from "react-bootstrap";import { FaBookmark, FaHeart, FaRegBookmark, FaRegComment, FaRegHeart } from "react-icons/fa";
import { TiArrowForwardOutline } from "react-icons/ti";
import { useNavigate, useParams } from "react-router-dom";

export const Singlepage = () => {
  const { id } = useParams();
  const natigate = useNavigate();
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useContext(store);
  const [selectedPost, setSelectedPost] = useState(null);
  const [modalType, setModalType] = useState("");
  const [commentForm, setCommentForm] = useState({
    user: "",
    text: "",
  });

  useEffect(() => {
    axios.get(`${getEnv("VITE_BACKEND_URL")}/api/posts/${id}`).then((res) => {
    //   console.log(res.data);
      setPost(res.data);
      setLoading(false);
    });
  }, [update]);

  const openModal = (post, type) => {
    setSelectedPost(post);
    setModalType(type);
    console.log(modalType);
  };

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

  return (
    <div className="singlepage">
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="post-card">
          <div className="post-header">
            <img
              src={post.author.profilePicture}
              alt="Profile_Picture"
              className="profile-pic"
            />
            <div>
              <span className="username" onClick={()=>natigate(`/profile/${post.author._id}`)}>{post.author.username}</span>
              <span className="location">{post.location}</span>
            </div>
          </div>
          <div className="post-media">
            <img
              src={post.media}
              alt="Post content"
              className="post-image"
              onDoubleClick={() => handleLike(post)}
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
              <span onClick={() => handleLike(post)}>
                {post.likes.filter((x) => x._id === loggedUser._id).length !==
                0 ? (
                  <FaHeart style={{ color: "red" }} />
                ) : (
                  <FaRegHeart />
                )}
              </span>
              <span className="count" onClick={() => openModal(post, "likes")}>
                {post.likes.length}
              </span>
            </div>
            <div
              className="comment-btn"
              title="Comment"
              onClick={() => openModal(post, "comments")}
            >
              <FaRegComment />{" "}
              <span className="count">{post.comments.length}</span>
            </div>
            <div className="share-btn" title="Share">
              <TiArrowForwardOutline />
            </div>
            <div
              className="save-btn"
              title="Save"
              onClick={() => handleSave(post)}
            >
              {loggedUser.saved.includes(post._id) ? (
                <FaBookmark />
              ) : (
                <FaRegBookmark/>
              )}
            </div>
          </div>
          <div className="post-details">
            <div className="caption">
              <span className="caption-username">{post.author.username}</span>
              <span className="caption-text">{post.title}</span>
            </div>
            <div className="timestamp">
              {format(new Date(post.createdAt), "MMM d")}
            </div>
          </div>
          <div className="comments-section px-3">
            {post.comments.length > 0 ? (
              post.comments.map((comment, index) => (
                <div className="commentsModal py-2 border-b-2" key={index}>
                  <img src={comment.user.profilePicture} alt="Profile_Pic" />
                  <div>
                    <h4 onClick={()=>natigate(`/profile/${comment.user._id}`)}>{comment.user.username}</h4>
                    <span>{comment.text}</span>
                    <span className="timestamp ml-2 p-2">
                      {format(new Date(comment.createdAt), "MMM d")}
                    </span>
                  </div>
                </div>
              ))
                ) : (
                    <p>No comments yet</p>
                )}
          </div>
        </div>
      )}
      {selectedPost && (
        <Modal show={selectedPost}>
          <ModalHeader closeButton onClick={() => setSelectedPost(null)}>
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
                    <img src={comment.user.profilePicture} alt="Profile_Pic" />
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
    </div>
  );
};
