import { useEffect, useState } from "react";
import "./Search.css";
import { Form } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Box, Dialog } from "@mui/material";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { FaSearch } from "react-icons/fa";
import Skeleton from "@mui/material/Skeleton";
import { getEnv } from "@/helpers/getEnv";
import { HiDotsVertical } from "react-icons/hi";
export function Search() {
  const [search, setSearch] = useState([]);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [term, setTerm] = useState("");
  const handleClose = () => setOpen(false);
  const [modalPost, setModalPost] = useState({})
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Search";
    axios
      .get(`${getEnv('VITE_BACKEND_URL')}/api/users/`)
      .then((res) => setUsers(res.data))
      .catch((err) => console.log(err));
    axios
      .get(`${getEnv('VITE_BACKEND_URL')}/api/posts/`)
      .then((res) => {
        // console.log(res.data);
        setPosts(res.data);
      })
      .catch((err) => console.error(err));
  }, []);
  let handleSearch = (e) => {
    let termw = e.target.value;
    setTerm(termw);
    if (termw) {
      let resUsers = users.filter((x) =>
        x.username.toLowerCase().includes(termw.toLowerCase())
      );
      setSearch(resUsers);
    }
  };
  return (
    <div className="search">
      <Form>
        <Form.Group className="form_input">
          <Form.Label>
            <FaSearch />
          </Form.Label>
          <input
            className="input"
            type="text"
            placeholder="search"
            onChange={handleSearch}
            name="search"
          ></input>
        </Form.Group>
      </Form>
      {term && (
        <div className="searched_user">
          {search.map((x, index) => {
            return (
              <div
                className="likesModel"
                key={index}
                onClick={() => {
                  navigate(`/profile/${x._id}`);
                }}
              >
                <img src={x.profilePicture} alt="Profile_Pic" />
                <h2>{x.username}</h2>
              </div>
            );
          })}
        </div>
      )}
      {term.length === 0 && (
        <div className="posts">
          <Box
            sx={{
              width: "100%",
              height: "100%",
              overflowY: "scroll",
              scrollbarWidth: "none",
            }}
          >
            {posts.length > 0 ? (
              <ImageList variant="masonry" cols={3} gap={2}>
                {posts.map((item, index) => (
                  <ImageListItem key={index} >
                    <img
                      srcSet={`https${item.media.slice(
                        4
                      )}?w=248&fit=crop&auto=format&dpr=2 2x`}
                      src={`https${item.media.slice(
                        4
                      )}?w=248&fit=crop&auto=format`}
                      alt={item.title}
                      loading="eager"
                      onClick={()=>{
                        setModalPost(item)
                        setOpen(true)
                      }}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  gap: "1px",
                  flexWrap: "wrap",
                }}
              >
                <Skeleton
                  sx={{ bgcolor: "grey.700" }}
                  variant="rectangular"
                  width="33%"
                  height="25vw"
                />
                <Skeleton
                  sx={{ bgcolor: "grey.700" }}
                  variant="rectangular"
                  width="33%"
                  height="25vw"
                />
                <Skeleton
                  sx={{ bgcolor: "grey.700" }}
                  variant="rectangular"
                  width="33%"
                  height="25vw"
                />
                <Skeleton
                  sx={{ bgcolor: "grey.700" }}
                  variant="rectangular"
                  width="33%"
                  height="25vw"
                />
                <Skeleton
                  sx={{ bgcolor: "grey.700" }}
                  variant="rectangular"
                  width="33%"
                  height="25vw"
                />
                <Skeleton
                  sx={{ bgcolor: "grey.700" }}
                  variant="rectangular"
                  width="33%"
                  height="25vw"
                />
              </div>
            )}
          </Box>
        </div>
      )}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <div className="flex flex-col md:flex-row bg-white w-full h-[85vh] rounded-md overflow-hidden">
              <div className="w-full md:w-1/2 bg-black flex justify-center items-center">
                <img
                  src={modalPost.media} // Update with actual path
                  alt="Post"
                  className="object-contain max-h-full max-w-full"
                />
              </div>
      
              <div className="w-full md:w-1/2 p-2 comments_div">
                <div className="border-b-2 flex items-center" style={{justifyContent:'space-between',height:'50px'}}>
                  <h2>{modalPost.author?.username}</h2>
                  <HiDotsVertical style={{fontSize:25}}/>
                </div>
                {open && <div style={{height: '420px', overflowY:'scroll'}}>
                
                 {modalPost.comments.length == 0 ? <div style={{textAlign:'center'}}>
                   <h4>No Comments</h4>
                   <span>Be the first one to comment</span>
                 </div> : modalPost.comments.map((comment, index) => (
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
                  
                </div>}
              </div>
              
            </div>
          </Dialog>
    </div>
  );
}
