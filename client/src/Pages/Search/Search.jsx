import { useEffect, useState } from "react";
import "./Search.css";
import { Form } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { FaSearch } from "react-icons/fa";
export function Search() {
  const [search, setSearch] = useState([]);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [term, setTerm] = useState("");

  const navigate = useNavigate();
  useEffect(() => {
    document.title="Search"
    axios
      .get("https://inspix-backend.onrender.com/api/users/")
      .then((res) => setUsers(res.data))
      .catch((err) => console.log(err));
    axios
      .get("https://inspix-backend.onrender.com/api/posts/")
      .then((res) => {
        // console.log(res.data);
        setPosts(res.data);
      })
      .catch((err) => console.error(err));
  }, []);
  let handleSearch = (e) => {
      let termw = e.target.value
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
          <Form.Label><FaSearch/></Form.Label>
          <input className="input"
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
                <div className="likesModel" key={index} onClick={() => {
                    navigate(`/profile/${x._id}`);
                  }}>
                <img src={x.profilePicture} alt="Profile_Pic"/>
                <h2>{x.username}</h2>
              </div>
            );
          })}
        </div>
      )}
      {term.length === 0 && (
        <div className="posts">
          <Box sx={{ width: "100%", height: "100%", overflowY: "scroll",scrollbarWidth: "none" }}>
            <ImageList variant="masonry" cols={3} gap={2}>
              {posts.map((item) => (
                <ImageListItem key={item.img}>
                  <img
                    srcSet={`${item.media}?w=248&fit=crop&auto=format&dpr=2 2x`}
                    src={`${item.media}?w=248&fit=crop&auto=format`}
                    alt={item.title}
                    loading="lazy"
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </Box>
        </div>
      )}
    </div>
  );
}
