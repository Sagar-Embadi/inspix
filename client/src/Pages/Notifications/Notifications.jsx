/* eslint-disable react-hooks/exhaustive-deps */
import { store } from "@/App";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
  const [update] = useContext(store)
  // const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    axios
      .get(
        `https://inspix-backend.onrender.com/api/users/${loggedUser._id}/notifications/`
      )
      .then((res) => {
        console.log(res.data);
        setNotifications(res.data);
      })
      .catch((err) => console.error(err));
  }, [update]);

  const handleRead = (notification) => {
    axios
      .delete(
        `https://inspix-backend.onrender.com/api/users/${loggedUser._id}/notifications/${notification._id}`,
        { read: true }
      )
      .then(() => {
        alert("Notification marked as read");
      })
      .catch((err) => console.error(err));
  }
  return (
    <div>
      <h1>Notifications</h1>
      <div className="notifications">
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <div key={index} className="notification">
              <p>
                {notification.type === "post" && "Post Uploaded "}
                {notification.type === "like" && "Liked your post"}
                {notification.type === "follow" && "Followed you"}
                {notification.type === "comment" && "Commented on your post"}
              </p>
              <span>{new Date(notification.createdAt).toLocaleString()}</span>
              <span onClick={()=>handleRead(notification)}>Mark as Read</span>              
              {/* <img src={notification.fromUser.profilePicture} alt="" /> */}
              {/* <p>{notification.type === "post" ? `${notification.fromUser.name} liked your post` : `${notification.fromUser.name} followed you`}</p> */}
            </div>
          ))
        ) : (
          <p>No notifications</p>
        )}
      </div>
    </div>
  );
};

export default Notifications;
