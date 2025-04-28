/* eslint-disable react-hooks/exhaustive-deps */
import { store } from "@/App";
import { X } from "lucide-react";
// import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useContext, useEffect, } from "react";

const ChatHeader = () => {
  const {selectedUser, setSelectedUser } = useChatStore()
  const [update, setUpdate] = useContext(store)
  // const { onlineUsers } = useAuthStore();
  useEffect(()=>{
    const storedUser = JSON.parse(localStorage.getItem("selectedUser"));
    setSelectedUser(storedUser);
  },[update])

  return (
    <div className="p-3 border-b border-base-300 position-sticky top-0 bg-base-100 z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={selectedUser?.profilePicture || "https://th.bing.com/th/id/OIP.Icb6-bPoeUmXadkNJbDP4QHaHa?pid=ImgDet&w=184&h=184&c=7&dpr=1.3"} alt={selectedUser?.fullName} />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser?.username || "User Name"}</h3>
            <p className="text-sm text-base-content/70">
              {/* {onlineUsers.includes(selectedUser?._id) ? "Online" : "Offline"} */}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button className="border-0" onClick={() => {
          setSelectedUser(null)
          localStorage.removeItem("selectedUser")
          setUpdate(update+1)
          }}>
          <X />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;