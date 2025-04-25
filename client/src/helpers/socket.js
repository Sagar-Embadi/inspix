import { io } from "socket.io-client";

export const socket = io(import.meta.env.VITE_BACKEND_URL, {
  withCredentials: true,
  transports: ["websocket"],
  query:{
    userId: JSON.parse(localStorage.getItem("loggedUser"))?._id,
  }
});
