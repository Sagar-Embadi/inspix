/* eslint-disable react-hooks/exhaustive-deps */
import "./Notifications.css";
import { store } from "@/App";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import { getEnv } from "@/helpers/getEnv";
// import { format } from "date-fns";
import moment from "moment";
import { NotificationSkeleton } from "@/Components/Skeletons/NotificationSkeleton";
const Notifications = () => {
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
  const [update] = useContext(store);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    document.title = "Notifications";
    axios
      .get(`${getEnv('VITE_BACKEND_URL')}/api/users/${loggedUser._id}/notifications/`)
      .then((res) => {
        // console.log(res.data);
        setNotifications(res.data.reverse());
      })
      .catch((err) => console.error(err));
  }, [update]);

  return (
    <div className="notifications_page">
      <h1>Notifications</h1>
      <div className="notifications_container">
        {notifications.length > 0 ? (
          notifications.map((notification, index) => {
            return (
              <div className="notification" key={index}>
                <Avatar
                  alt={notification.fromUser?.name}
                  src={notification.fromUser?.profilePicture}
                  sx={{ width: 56, height: 56 }}
                />
                <div className="notification_text">
                  <h5
                    onClick={() =>
                      navigate(`/profile/${notification.fromUser._id}`)
                    }
                  >
                    {notification.fromUser.username}
                  </h5>
                  <span>
                    {notification.type === "post" && "Post Uploaded"}
                    {notification.type === "like" && "Liked your post"}
                    {notification.type === "follow" && "started following you"}
                    {notification.type === "comment" &&
                      "Commented on your post"}
                    <span style={{ marginLeft: 10, color: "gray" }}>
                      {moment(notification.createdAt).fromNow()}
                    </span>
                  </span>
                </div>
                {notification.type === "post" ||
                notification.type === "comment" ||
                notification.type === "like" ? (
                  <Avatar
                    onClick={() => navigate(`/profile/${loggedUser._id}`)}
                    src={notification.postId.media}
                    sx={{
                      width: 56,
                      height: 56,
                      border: "1px solid #ccc",
                      marginLeft: "auto",
                    }}
                    variant="square"
                  />
                ) : (
                  <button className="notification_button" style={{ backgroundColor: notification.fromUser.followers.includes(loggedUser._id)
                    ? "grey"
                    : "#007bff" }} onClick={() => navigate(`/profile/${notification.fromUser._id}`)}>
                    {notification.fromUser.followers.includes(loggedUser._id)
                      ? "following"
                      : "follow back"}
                  </button>
                )}
              </div>
            );
          })
        ) : (
          <NotificationSkeleton/>
        )}
      </div>
    </div>
  );
};

export default Notifications;
