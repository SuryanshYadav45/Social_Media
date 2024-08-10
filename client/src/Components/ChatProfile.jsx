import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatProfile = ({ data }) => {
//   console.log(data.latestMessage.content);
  const [message, setmessage] = useState("");
  useEffect(() => {
    if (data?.latestMessage?.content != null) {
      setmessage(data.latestMessage.content);
    } else {
      setmessage("Start Conversation!!");
    }
  }, [data]);
  const navigate = useNavigate();
  return (
    <div
      className="bg-black w-full text-white flex mt-2 h-[70px] p-2 cursor-pointer"
      onClick={() => navigate(`/direct/${data?._id}`)}
    >
      <div className="w-[60px] h-[60px]">
        <img
          className="w-full h-full rounded-full"
          src={data?.photoUrl}
          alt=""
        />
      </div>
      <div className="ml-[10px]">
        <h6>{data?.username}</h6>
        <p>{message }</p>
      </div>
    </div>
  );
};

export default ChatProfile;
