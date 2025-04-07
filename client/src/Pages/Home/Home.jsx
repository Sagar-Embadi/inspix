import { useEffect, useState } from "react";
import "./Home.css";
import { FaRegHeart, FaRegComment, FaHeart } from "react-icons/fa";
import { TiArrowForwardOutline } from "react-icons/ti";
import { FaBookmark,FaRegBookmark } from "react-icons/fa";
import axios from "axios";
import { format } from "date-fns";
import { store } from "../../App";
import { Button, Form, FormGroup, Modal, ModalHeader, ModalTitle } from "react-bootstrap";
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
export function Home() {
  const [loggedUser,setLoggedUser] = useState({});
  const [update, setUpdate] = useState(store);
  const [data, setData] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [modalType, setModalType] = useState("");
  const [commentForm,setCommentForm] = useState({
    user:"",
    text:""
  })

  const openModal = (post, type) => {
    setSelectedPost(post);
    setModalType(type);
    console.log(modalType);
    
  };

  useEffect(() => {
    document.title="Home"
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
      .patch(`https://inspix-backend.onrender.com/api/posts/${x._id}`, { likes })
      .then(() => {
        setUpdate(update + 1);
        let dd = document.querySelectorAll(".heart");
        dd[index].style.display = "block";
        setTimeout(() => {
          dd[index].style.display = "none";
        }, 500);
      })
      .catch((err) => console.log(err));
  };
  const addComment = ()=>{
    // console.log(selectedPost)
    let comments = selectedPost.comments
    commentForm.user = loggedUser._id
    comments.push(commentForm)
    console.log(comments);
    
    axios.patch(`https://inspix-backend.onrender.com/api/posts/${selectedPost._id}`, { comments }).then(()=>setUpdate(update-1)).catch(err=>console.log(err))
    
  }
  const handleSave = (x) =>{
    let saved = loggedUser.saved
    if(loggedUser.saved.includes(x._id)){
      saved = saved.filter(post=>post !== x._id)
    }else{
      // saved =saved.filter(post=>post !== x._id)
      saved.push(x._id)
    }
    localStorage.setItem("loggedUser",JSON.stringify(loggedUser))
    console.log(x,saved);
    axios
      .patch(`https://inspix-backend.onrender.com/api/users/${loggedUser._id}`, {saved})
      .then(() => {
        // console.log(res.data)
        setUpdate(update + 1);
      })
      .catch((err) => console.error(err));
  }
  return (
    <>
      {localStorage.getItem("loggedUser") &&<div className="home">
        {data.length ? (
          <>
          <div className="home_posts">
            {data.map((x, index) => {
              let date = format(new Date(x.createdAt), "MMM d");
              return (
                <>
                  <div className="post-card" key={x._id}>
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
                    <div className="post-media" >
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
                      <div className="save-btn" title="Save" onClick={()=>handleSave(x,index)}>
                        {localStorage.getItem('loggedUser')&&(loggedUser.saved).includes(x._id)?<FaBookmark /> :<FaRegBookmark/>}
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
                </>
              );
            })}
          </div>
          {selectedPost && (
        <Modal show={selectedPost} >
          
            <ModalHeader closeButton onClick={()=>setSelectedPost(null)}>
              <ModalTitle>{modalType === "likes" ? "Liked by" : "Comments"}</ModalTitle>
            </ModalHeader>
            <div className="p-4">
              {modalType === "likes"
                ? selectedPost.likes.map((like, index) => <div className="likesModel" key={index}>
                  <img src={like.profilePicture} alt="Profile_Pic"/>
                  <h2>{like.username}</h2>
                </div>)
                : selectedPost.comments.map((comment, index) => <div className="commentsModal" key={index}>
                  <img src={comment.user.profilePicture} alt="Profile_Pic"/>
                  <div>
                    <h4>{comment.user.username}</h4>
                    <p>{comment.text}</p>
                  </div>
                </div>)}
            </div>
            <div className="modalFooter">
              {modalType === "comments" && <Form>
                <FormGroup className="commentForm" >
                  <img src={loggedUser.profilePicture} alt=""/>
                  <Form.Control type="text" placeholder="Add a comment" onChange={(e)=>setCommentForm({...commentForm,text:e.target.value})}/>
                  <Button disabled={!commentForm.text } onClick={()=>{
                    addComment(selectedPost)
                    }}>Send</Button>
                </FormGroup>
                </Form>}
            </div>
        </Modal>
      )}
          </>
        ) : (
          <div style={{display:'flex',justifyContent:'center'}}>
            <Stack spacing={1}>
            {/* For variant="text", adjust the height via font-size */}
            <Skeleton variant="text" sx={{ fontSize: '3rem',width:'90vw' }} />
            {/* For other variants, adjust the size with `width` and `height` */}
            <Skeleton variant="circular" width={"30vw"} height={"30vw"} />
            <Skeleton variant="rectangular" width={"90vw"} height={80} />
            <Skeleton variant="rounded" width={"90vw"} height={80} />
          </Stack>
          </div>
        )}
      </div>}
    </>
  );
}
