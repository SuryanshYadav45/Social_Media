import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatProfile = ({ data }) => {
//   console.log(data.latestMessage.content);
  const [message, setmessage] = useState("");
  const truncateMessage = (message, maxWords) => {
    const words = message.split(' ');
    if (words.length <= maxWords) {
        return message; // Return the message as is if it's within the limit
    }
    return words.slice(0, maxWords).join(' ') + ' ...'; // Truncate and append ellipsis
};
  useEffect(() => {
    if (data?.latestMessage?.content != null && data?.latestMessage?.content?.imageUrl) {
      setmessage("Shared a Post");
    } else if (data?.latestMessage?.content != null ) {
      setmessage(truncateMessage(data.latestMessage.content,7));
      
    }
    else{
      setmessage("Start Conversation!!");
    }
  }, [data]);
  const navigate = useNavigate();
  return (
    <div
      className="bg-black w-full text-white flex mt-2 h-[70px] p-2 cursor-pointer"
      onClick={() => navigate(`/direct/${data?._id}`)}
    >
      <div className="w-[40px] h-[40px] smlg:w-[60px] smlg:h-[60px]">
        <img
          className="w-full h-full rounded-full"
          src={data?.photoUrl}
          alt=""
        />
      </div>
      <div className="ml-[10px] hidden smlg:block">
        <h6>{data?.username}</h6>
        <p className="">{message}</p>
      </div>
    </div>
  );
};

export default ChatProfile;
