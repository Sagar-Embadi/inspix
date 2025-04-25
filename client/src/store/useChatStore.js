import { create } from "zustand";
import { showToastify } from "@/helpers/showToastify";
// import { useAuthStore } from "./useAuthStore";
import axios from "axios";
import { getEnv } from "@/helpers/getEnv";
import { socket } from "@/helpers/socket";

export const useChatStore = create((set, get) => ({
  setLoggedInUser: (user) => set({ loggedInUser: user }),
  loggedInUser: null,
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: true,
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axios.get(`${getEnv("VITE_BACKEND_URL")}/api/users`);
      set({ users: res.data });
    } catch (error) {
      console.log("Error in getUsers from useChatStore: ", error);
      showToastify("error", error);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (loggedInUserId) => {
    const { selectedUser } = get();
    set({ isMessagesLoading: true });
    try {
      axios.get(`${getEnv("VITE_BACKEND_URL")}/api/conversation/${loggedInUserId}/${selectedUser._id}`).then((res)=>{
        // console.log("Messages: ", res.data);
        set({ messages: res.data});
      })
      socket.on("newMessage", (newMessage) => {
        const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
        if (!isMessageSentFromSelectedUser) return;

        set({
          messages: [...get().messages, newMessage],
        });
      });
    } catch (error) {
      // console.error("Error in getMessages from useChatStore: ", error.data);
      showToastify("error", error);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { messages } = get();
    const { text, image, senderId, receiverId } = messageData;
    try {
      const res = await axios.post(`${getEnv('VITE_BACKEND_URL')}/api/messages/send`, messageData)
      socket.emit('send_message',{
        senderId: senderId,
        receiverId: receiverId,
        text: text,
        image: image,
        createdAt: new Date().toISOString(),
      })
      // console.log("Message sent: ", res.data);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      // console.log("Error in sendMessage from useChatStore: ", error);
      showToastify("error", error.response.statusText);
    }
  },

  // subscribeToMessages: () => {
  //   const { selectedUser } = get();
  //   if (!selectedUser) return;

  //   const socket = useAuthStore.getState().socket;

  //   socket.on("newMessage", (newMessage) => {
  //     const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
  //     if (!isMessageSentFromSelectedUser) return;

  //     set({
  //       messages: [...get().messages, newMessage],
  //     });
  //   });
  // },

  // unsubscribeFromMessages: () => {
  //   const socket = useAuthStore.getState().socket;
  //   socket.off("newMessage");
  // },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
