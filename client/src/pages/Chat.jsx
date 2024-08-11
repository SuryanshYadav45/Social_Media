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
          console.log(data);
          const formattedMessages = data.map((message) => ({
            position: message?.sender?._id === decodeUser.id ? "right" : "left",
            type: "text",
            text: message?.content,
            date: new Date(message.timestamp),
          }));

          console.log(formattedMessages);
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
    //  fetchfriend();
    // fetchchat();
    // fetchUser();
  }, [id]);

  console.log(messages);

  const scrollToBottom = () => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  };
  useEffect(() => {
    // Scroll to the bottom whenever messages change
    scrollToBottom();
  }, [messages]);

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
        console.log("message", data);
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
      <div className="w-full bg-gray-100 smlg:w-[10%] fixed bottom-0 lap:w-[15%] ">
        <Navbar />
      </div>

      <div className="relative w-[25%] h-screen hidden border-r-2 border-[#19191A] text-white smlg:block bg-black smlg:w-[30%] smlg:ml-[10%] lap:w-[25%] lap:ml-[15%] overflow-y-scroll">
        {isLoading ? (
          <Skeleton
            count={5}
            height={60}
            baseColor="#d3d3d3"
            highlightColor="#c0c0c0"
          />
        ) : (
          Account?.map((account) => (
            <ChatProfile key={account._id} data={account} />
          ))
        )}
      </div>
      <div className="relative w-full mt-4 h-[92vh]  text-white bg-black smlg:h-screen smlg:mt-0 smlg:w-[90%] lap:w-[60%] ">
        {isLoading ? (
          <div className="flex items-center ml-3 space-x-4">
          {/* Left Circle */}
          <Skeleton  height={60} className="rounded-full" width={60} baseColor="#d3d3d3" highlightColor="#c0c0c0" />
    
          {/* Placeholder for Paragraph */}
          <div className="flex-1">
            <Skeleton height={20} width={80} baseColor="#d3d3d3" highlightColor="#c0c0c0" />
          </div>
    
          {/* Right Circle */}
          <Skeleton className="mr-3 rounded-full"   height={60} width={60} baseColor="#d3d3d3" highlightColor="#c0c0c0" />
        </div>
        ) : (
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
            <HiOutlineVideoCamera size={50} />
          </div>
        )}

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

        {
          isLoading?(
            <div className="flex items-center ml-3 space-x-4">
            
      
            <div className="flex-1">
              <Skeleton height={40}  className="w-full p-4 " baseColor="#d3d3d3 " highlightColor="#c0c0c0" />

            </div>
      
            
            <Skeleton className="ml-[-10px] mb-[4px] mr-5"  height={40} width={45} baseColor="#d3d3d3" highlightColor="#c0c0c0" />
          </div>
          ):<div className="w-[100%] bottom-0 pt-1 absolute">
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

        }

        
      </div>
    </div>
  );
};

export default Chat;
