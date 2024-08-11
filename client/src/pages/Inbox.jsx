import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import ChatProfile from "../Components/ChatProfile";
import { IoClose } from "react-icons/io5";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { Navigate, useNavigate, useNavigation } from "react-router-dom";
import { deployUrl } from "../deployment";
const Inbox = () => {
  const user = useSelector((state) => state.user.user);
  const [searchChat, setsearchChat] = useState(false);
  const [Account, setAccount] = useState([]);
  const [currentUser, setcurrentUser] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const decodeUser = jwtDecode(user.usertoken);
  const navigate=useNavigate()

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

    fetchUser();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm) {
        try {
          const response = await fetch(
            `${deployUrl}/user/searchuser?query=${searchTerm}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `${user.usertoken}`,
              },
            }
          );
          if (response.status == 200) {
            const data = await response.json();
            setResults(data);
          }
          if(response.status==404)
          {
            setResults([]);
          }
        } catch (error) {
          
          console.log(error);
        }
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <div className=" flex bg-black ">
      <div className="w-full bg-gray-100 smlg:w-[10%] z-50 fixed bottom-0 lap:w-[15%] ">
        <Navbar />
      </div>

      <div className="relative w-[18%] h-screen  text-white border-r-2 border-[#19191A] bg-black smlg:w-[90%] smlg:ml-[10%] lap:w-[25%] lap:ml-[15%] overflow-y-scroll">
        {Account?.map((account) => (
          <ChatProfile key={account._id} data={account} />
        ))}
      </div>
      <div className="relative w-full h-screen flex flex-col justify-center items-center text-white bg-black smlg:w-[90%] lap:w-[60%]">
        {searchChat ? (
          <div className=" w-[100%] smlg:w-[500px] p-5 rounded-lg text-white bg-[#19191A]">
            <div className="relative">
              <h3 className="text-[25px] text-center">New message</h3>
              <IoClose
                onClick={() => setsearchChat(false)}
                size={30}
                className="absolute cursor-pointer right-0 top-1"
              />
            </div>
            <div className="flex mt-4 h-[40px] justify-center items-center">
              To:{" "}
              <input
                type="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-full bg-transparent outline-none ml-2"
                name=""
                id=""
              />
            </div>
            <div>
              {results.length <= 0
                ? "No user found"
                : results.map((result) => <div key={result._id} onClick={()=>navigate(`/direct/${result._id}`)} className="flex rounded-md mt-1 mb-1 p-1 cursor-pointer hover:bg-[#2c2c2d]">
                  <img src={result.photoUrl} alt="" className="w-[50px] h-[50px] rounded-full"/>
                  <div className="ml-2">
                    <h6>{result.fullname}</h6>
                    <h6>{result.username}</h6>
                  </div>
                </div>)}
            </div>
            <button className="w-full bg-[#0095F6] text-white h-[35px] rounded-md mt-5 outline-none">
              chat
            </button>
          </div>
        ) : (
          <>
            <svg
              aria-label=""
              className="x1lliihq x1n2onr6 x5n08af mb-2"
              fill="currentColor"
              height="96"
              role="img"
              viewBox="0 0 96 96"
              width="96"
            >
              <title></title>
              <path d="M48 0C21.532 0 0 21.533 0 48s21.532 48 48 48 48-21.532 48-48S74.468 0 48 0Zm0 94C22.636 94 2 73.364 2 48S22.636 2 48 2s46 20.636 46 46-20.636 46-46 46Zm12.227-53.284-7.257 5.507c-.49.37-1.166.375-1.661.005l-5.373-4.031a3.453 3.453 0 0 0-4.989.921l-6.756 10.718c-.653 1.027.615 2.189 1.582 1.453l7.257-5.507a1.382 1.382 0 0 1 1.661-.005l5.373 4.031a3.453 3.453 0 0 0 4.989-.92l6.756-10.719c.653-1.027-.615-2.189-1.582-1.453ZM48 25c-12.958 0-23 9.492-23 22.31 0 6.706 2.749 12.5 7.224 16.503.375.338.602.806.62 1.31l.125 4.091a1.845 1.845 0 0 0 2.582 1.629l4.563-2.013a1.844 1.844 0 0 1 1.227-.093c2.096.579 4.331.884 6.659.884 12.958 0 23-9.491 23-22.31S60.958 25 48 25Zm0 42.621c-2.114 0-4.175-.273-6.133-.813a3.834 3.834 0 0 0-2.56.192l-4.346 1.917-.118-3.867a3.833 3.833 0 0 0-1.286-2.727C29.33 58.54 27 53.209 27 47.31 27 35.73 36.028 27 48 27s21 8.73 21 20.31-9.028 20.31-21 20.31Z"></path>
            </svg>
            <h2 className="mb-2">Your Message</h2>
            <p>Send a message to start a chat.</p>
            <button
              onClick={() => setsearchChat(true)}
              className="w-[130px] bg-[#0095F6] text-white h-[35px] rounded-md mt-5 outline-none"
            >
              Send message
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Inbox;
