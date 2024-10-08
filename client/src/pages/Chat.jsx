import React, { useEffect, useRef, useState } from "react";
import Navbar from "../Components/Navbar";
import ChatProfile from "../Components/ChatProfile";
import { MessageBox, MessageList, Input } from "react-chat-elements";
import "react-chat-elements/dist/main.css"; // Import CSS
import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useSocket } from "../socketContext";
import { HiOutlineVideoCamera } from "react-icons/hi2";
import { deployUrl } from "../deployment";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Spinner from "../Components/Spinner";
import toast, { Toaster } from 'react-hot-toast'
const Chat = () => {
  let { id } = useParams();
  const navigate = useNavigate();
  const socket = useSocket();
  const messageListRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [Account, setAccount] = useState([]);
  const [currentUser, setcurrentUser] = useState();
  const [OtherUser, setOtherUser] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const user = useSelector((state) => state.user.user);
  const decodeUser = jwtDecode(user.usertoken);

  useEffect(() => {
    if (decodeUser) {
      setcurrentUser(decodeUser);
    }

    const fetchUser = async () => {
      const response = await fetch(`${deployUrl}/user/getFriend`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${user.usertoken}`,
        },
      });

      if (response.status === 200) {
        const data = await response.json();

        setAccount(data);
      }
    };

    const fetchchat = async () => {
      try {
        const response = await fetch(
          `${deployUrl}/chat/message/${decodeUser?.id}/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${user.usertoken}`,
            },
          }
        );
        if (response.status === 200) {
          const data = await response.json();

          const formattedMessages = data.map((message) => {
            // Handle messages based on their type
            if (message.type === "post") {
              return {
                position:
                  message.sender._id === decodeUser.id ? "right" : "left",
                type: "photo",
                data: { uri: message.content.imageUrl },
                date: new Date(message.timestamp),
              };
            } else {
              return {
                position:
                  message.sender._id === decodeUser.id ? "right" : "left",
                type: "text",
                text: message.content,
                date: new Date(message.timestamp),
              };
            }
          });

          setMessages(formattedMessages);
        }
      } catch (error) {
        console.log(error);
      }
    };
    const fetchfriend = async () => {
      try {
        const response = await fetch(`${deployUrl}/user/userinfo/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${user.usertoken}`,
          },
        });
        if (response.status === 200) {
          const data = await response.json();
          setOtherUser(data.userinfo);
        }
      } catch (error) {
        console.log(error);
      }
    };
    const fetchData = async () => {
      setIsLoading(true); // Start loading
      await Promise.all([fetchUser(), fetchchat(), fetchfriend()]); // Wait for all functions to complete
      setIsLoading(false); // Set loading to false after all functions are done
    };
    fetchData();
  }, [id]);

  const scrollToBottom = () => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  };
  useEffect(() => {
    if (!isLoading) {
      scrollToBottom();
    }
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = () => {
    if (inputValue.trim()) {
      const newMessage = {
        position: "right",
        type: "text",
        text: inputValue,
        date: new Date(),
      };
      socket.emit("private_message", {
        senderId: currentUser.id,
        receiverId: id,
        content: inputValue,
      });
      setMessages([...messages, newMessage]);
      setInputValue("");
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on("new_message", (data) => {
        const newmessage = {
          position: "left",
          type: "text",
          text: data.content,
          date: new Date(data.timestamp),
        };
        setMessages((prevMessages) => [...prevMessages, newmessage]);
      });
    }
  }, [socket]);
  return (
    <div className=" flex bg-black h-screen">
      <Toaster />
      <div className="w-full bg-gray-100 smlg:w-[10%] fixed bottom-0 lap:w-[15%] ">
        <Navbar />
      </div>
      {isLoading ? (
        <div className="w-[100%] smlg:ml-[10%] lap:ml-[15%]  h-screen bg-black flex justify-center items-center">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="relative w-[25%] h-screen hidden border-r-2 border-[#19191A] text-white smlg:block bg-black smlg:w-[30%] smlg:ml-[10%] lap:w-[25%] lap:ml-[15%] overflow-y-scroll">
            {Account?.map((account) => (
              <ChatProfile key={account._id} data={account} />
            ))}
          </div>
          <div className="relative w-full mt-4 h-[92vh]  text-white bg-black smlg:h-screen smlg:mt-0 smlg:w-[90%] lap:w-[60%] ">
            <div className="bg-black h-[70px] border-b border-[#2c2c2d] flex justify-between items-center p-5">
              <div
                className="flex items-center cursor-pointer"
                onClick={() => navigate(`/user/${OtherUser._id}`)}
              >
                <img
                  src={OtherUser.photoUrl}
                  className="w-[55px] h-[55px] rounded-full"
                  alt=""
                />
                <h2 className="ml-3">{OtherUser.fullname}</h2>
              </div>
              <HiOutlineVideoCamera size={50} className="cursor-pointer"  onClick={()=>toast("Hang tight — this feature is almost ready to make its debut!",{duration: 1500,})}/>
            </div>

            <div
              className="h-[74vh] smlg:h-[75vh]  overflow-y-scroll pb-8 mt-3"
              ref={messageListRef}
            >
              <MessageList
                className="message-list relative text-black "
                lockable={true}
                toBottomHeight={"100%"}
                dataSource={messages}
              />
            </div>

            <div className="w-[100%] bottom-0 pt-1 absolute">
              <Input
                className=" bg-transparent w-full p-4 mr-4"
                placeholder="Type here..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") handleSend();
                }}
                rightButtons={
                  <button
                    onClick={handleSend}
                    className="bg-white text-black p-2 rounded-sm"
                  >
                    Send
                  </button>
                }
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Chat;
