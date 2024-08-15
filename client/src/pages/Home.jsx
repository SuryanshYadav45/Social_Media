import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import StatusCarousel from "../Components/StatusCarousel";
import Post from "../Components/Post";
import AddUser from "../Components/AddUser";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { signOut } from "../redux/user/userSlice";
import { Navigate, useNavigate } from "react-router-dom";
import { deployUrl } from "../deployment";
import Spinner from "../Components/Spinner";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentUser, setcurrentUser] = useState();
  const user = useSelector((state) => state.user.user);
  const [IsLoading, setIsLoading] = useState(true);

  const decodeUser = jwtDecode(user.usertoken);

  const [post, setPost] = useState([]);
  const [Account, setAccount] = useState([]);

  useEffect(() => {
    if (decodeUser) {
      setcurrentUser(decodeUser);
    }

    const fetchUser = async () => {
      const response = await fetch(`${deployUrl}/user/getusers`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${user.usertoken}`,
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        setAccount(data);
      } else if (response.status === 401) {
        logout();
      }
    };

    const fetchpost = async () => {
      const response = await fetch(`${deployUrl}/post/getallpost`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${user.usertoken}`,
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        setPost(data.posts);
      }
    };

    const fetchData = async () => {
      setIsLoading(true); // Start loading
      await Promise.all([fetchUser(), fetchpost()]); // Wait for all functions to complete
      setIsLoading(false); // Set loading to false after all functions are done
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (user.usertoken == null) {
      navigate("/login");
    }
  }, []);

  const logout = async () => {
    dispatch(signOut());
    navigate("/login");
  };
  return (
    <div className=" flex bg-black ">
      <div className="w-full bg-gray-100 z-50 smlg:w-[10%] fixed bottom-0 lap:w-[18%] ">
        <Navbar />
      </div>
      {IsLoading ? (
        <div className="w-[100%] smlg:ml-[10%] lap:ml-[20%]  h-screen bg-black flex justify-center items-center">
          <Spinner />
        </div>
      ) : (
        <>
          <div className="w-[100%]  bg-black smlg:w-[90%] smlg:ml-[10%] lap:w-[50%] lap:ml-[20%]">
            <div className="ml-4 mr-2 lap:ml-15 lap:mr-15">
              <StatusCarousel />
            </div>

            <div className="flex flex-col justify-center smlg:mb-5 items-center mb-16 mt-3">
              {post.map((post) => (
                <Post key={post._id} data={post} currentuser={currentUser} />
              ))}
            </div>
          </div>
          <div className="w-[30%] bg-black hidden border-l-0.5 pl-2 border-[#2c2c2d] lap:w-[32%] lap:block">
            <div className="flex items-center justify-between w-[250px] lap:w-[300px]  p-4 h-[60px] mt-5 bg-black text-white">
              <div className="flex justify-center items-center">
                <div className="w-[45px] h-[45px]">
                  <div className=" w-[45px] h-[45px] rounded-full inset-0 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 p-[2px]">
                    <img
                      className="rounded-full w-full h-full object-cover"
                      src={currentUser?.photoUrl}
                      alt="Profile"
                    />
                  </div>
                </div>
                <p className="ml-2">{currentUser?.username}</p>
              </div>
              <button onClick={logout} className="text-[#0095F6]">
                Logout
              </button>
            </div>
            <div className="flex justify-between w-[250px] lap:w-[300px] mt-5">
              <p className="text-white">Suggestion for you</p>

              <a className="text-white font-bold mr-3" href="/">
                See All
              </a>
            </div>
            {Account.map((account) => (
              <AddUser key={account._id} data={account} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
