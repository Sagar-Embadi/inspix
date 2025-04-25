import { create } from "zustand";
import axios from "axios";
// import { axiosInstance } from "../lib/axios.js";
import { showToastify } from "@/helpers/showToastify";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axios.get("/auth/check");

      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axios.post("/auth/signup", data);
      set({ authUser: res.data });
        showToastify("success", "Account created successfully");
    //   toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
        showToastify("error", error.response.data.message);
    //   toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axios.post("/auth/login", data);
      set({ authUser: res.data });
      showToastify("success", "Logged in successfully");
      // toast.success("Logged in successfully");

      get().connectSocket();
    } catch (error) {
      showToastify("error", error.response.data.message);
      // toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axios.post("/auth/logout");
      set({ authUser: null });
      showToastify("success", "Logged out successfully");
      // toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      showToastify("error", error.response.data.message);
      // toast.error(error.response.data.message);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axios.put("/auth/update-profile", data);
      set({ authUser: res.data });
      showToastify("success", "Profile updated successfully");
      // toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      showToastify("error", error.response.data.message);
      // toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));