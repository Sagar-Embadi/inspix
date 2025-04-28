/* eslint-disable react-hooks/exhaustive-deps */
import "./Messages.css";
// import { Avatar } from "@mui/material";
import MessageSkeleton from "@/components/Skeletons/MessageSkeleton";
import MessageInput from "@/components/MessageInput";
import ChatHeader from "@/components/ChatHeader";

import { useChatStore } from "@/store/useChatStore";
import NoChatSelected from "@/components/NoChatSelected";
import { useContext, useEffect, useRef, useState } from "react";
import { store } from "@/App";
import { socket } from "@/helpers/socket";

export function Messages() {
  // const[selectedUser,setSelectedUser] = useState(null)
  const [loggedInUser] = useState(
    JSON.parse(localStorage.getItem("loggedUser"))
  );
  const [update] = useContext(store);
  const messageEndRef = useRef(null);
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    setSelectedUser,
    // loggedInUser,
    // subscribeToMessages,
    // unsubscribeFromMessages,
  } = useChatStore();
  const isUserNearBottom = () => {
    if (!messageEndRef.current) return false;
    const container = messageEndRef.current.parentElement;
    return container.scrollHeight - container.scrollTop - container.clientHeight < 200;
  };
  
  useEffect(() => {
    setSelectedUser(JSON.parse(localStorage.getItem("selectedUser")));
    // setLoggedInUser(JSON.parse(localStorage.getItem("loggedInUser")))
    getMessages(loggedInUser._id);

    if (messages && messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
    window.scrollTo(0, 0);
    
    socket.emit('register', loggedInUser._id);
    socket.on('receive_message', () => {
      getMessages(loggedInUser._id);
    });
    return () => {
      socket.off('receive_message');
    }

  }, [ update]);

  useEffect(() => {
    const container = messageEndRef.current?.parentElement;
    if (!container) return;
  
    if (isUserNearBottom()) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  

  if (isMessagesLoading) {
    return (
      <div className="messages_page">
        <div className="flex-1 flex flex-col overflow-auto">
          <ChatHeader />
          <MessageSkeleton />
          <MessageInput />
        </div>
      </div>
    );
  }

  return (
    <div className="messages_page">
      {!selectedUser ? (
        <NoChatSelected />
      ) : (
        <>
          <div className="message_header">
            <ChatHeader />
          </div>
          <div className="message_body">
              <div className="message_body_container" style={{ height: "calc(99vh - 128px)", overflowY: "scroll", scrollbarWidth:'none' }}>
                {messages.map((message) => (
                  <div
                    key={message._id}
                    className={`chat ${
                      message.sender._id === loggedInUser._id
                        ? "chat-end"
                        : "chat-start"
                    }`}
                  >
                    <div className=" chat-image avatar">
                      <div className="size-10 rounded-full border">
                        <img
                          src={
                            message.sender._id === loggedInUser._id
                              ? loggedInUser.profilePicture || "/avatar.png"
                              : selectedUser.profilePicture || "/avatar.png"
                          }
                          alt="profile pic"
                        />
                      </div>
                    </div>
                    <div className="chat-header mb-1">
                      <time className="text-xs opacity-50 ml-1">
                        {new Date(message.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </time>
                    </div>
                    <div className="chat-bubble flex flex-col p-2 max-w-[70%]">
                      {message.image && (
                        <img
                          src={message.image}
                          alt="Attachment"
                          className="sm:max-w-[200px] rounded-md mb-2"
                        />
                      )}
                      {message.text && <span>{message.text}</span>}
                      {message.url && <a href={message.url}>{message.postId.media ? <img
                          src={message.postId.media}
                          alt="Attachment"
                          className="sm:max-w-[200px] rounded-md mb-2"
                        />:message.url}</a>}
                    </div>
                  </div>
                ))}
                <div ref={messageEndRef} />
              </div>
          </div>
          <div className="message_input">
            <MessageInput />
          </div>
        </>
      )}
    </div>
  );
}