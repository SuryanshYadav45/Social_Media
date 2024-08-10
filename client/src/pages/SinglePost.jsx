import React, { useEffect, useRef, useState } from "react";
import Navbar from "../Components/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import CommentBar from "../Components/CommentBar";
import { RiCloseLargeFill } from "react-icons/ri";
import { LuHeart, LuSendHorizonal } from "react-icons/lu";
import { FaHeart, FaRegComment } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import { deployUrl } from "../deployment";

const SinglePost = () => {
  const navigate = useNavigate();
  const [comment, setcomment] = useState("");
  const user = useSelector((state) => state.user.user);
  const decoded = jwtDecode(user.usertoken);
  const [post, setpost] = useState();
  const [isLikedByCurrentUser, setIsLikedByCurrentUser] = useState();
  const [likecount, setlikecount] = useState();
  const [postComment, setpostComment] = useState([]);
  const { postid } = useParams();
  useEffect(() => {
    const fetchpost = async () => {
      try {
        const response = await fetch(`${deployUrl}/post/getpost/${postid}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${user.usertoken}`,
          },
        });
        if (response.status === 200) {
          const data = await response.json();
          setpost(data.post[0]);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchpost();
  }, [postid]);

  useEffect(() => {
    const userLiked = post?.likes?.some((like) => {
      if (like._id === decoded.id) {
        return true;
      }
      return false;
    });
    setIsLikedByCurrentUser(userLiked);
    setlikecount(post?.likes.length);
    setpostComment(post?.comments);
  }, [post]);

  useEffect(() => {
    console.log(postComment);
  }, [postComment]);

  const likePost = async () => {
    try {
      const response = await fetch(`${deployUrl}/post/likepost`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${user.usertoken}`,
        },
        body: JSON.stringify({ postid: post._id }),
      });

      if (response.status === 200) {
        setIsLikedByCurrentUser(true);
        setlikecount((prevLikeCount) => prevLikeCount + 1);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const dislikePost = async () => {
    try {
      const response = await fetch(`${deployUrl}/post/dislike`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${user.usertoken}`,
        },
        body: JSON.stringify({ postid: post._id }),
      });

      if (response.status === 200) {
        setIsLikedByCurrentUser(false);
        setlikecount((prevLikeCount) => prevLikeCount - 1);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const createComment = async () => {
    try {
      const response = await fetch(`${deployUrl}/post/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${user.usertoken}`,
        },
        body: JSON.stringify({
          postid: post._id,
          comment: comment,
        }),
      });

      if (response.status == 201) {
        setcomment("");
        const data = await response.json();
        const commentobj = {
          createdAt: data.comment.createdAt,
          text: comment,
          userId: {
            username: decoded.username,
            photoUrl: decoded.photoUrl,
          },
          _id: data.comment._id,
        };
        setpostComment((prevComments) => [commentobj, ...prevComments]);
        console.log(commentobj);
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log(post);
  return (
    <div className=" flex bg-black ">
      <div className="w-full z-50 bg-gray-100 smlg:w-[10%] fixed bottom-0 lap:w-[18%] ">
        <Navbar />
      </div>

      <div className="relative w-full h-screen flex justify-center items-center  text-white bg-black smlg:w-[90%] smlg:ml-[10%] lap:w-[82%] lap:ml-[18%]">
        <div className="absolute inset-0 bg-black opacity-50"></div>
       
        <div className="relative flex-col mt-[-70px]  bg-[#19191A] smlg:flex-row flex w-[80%] h-[85vh] items-center  z-10 border border-[#282626]">
          <div className="flex-[3] w-full h-[30%] smlg:h-full">
            <img src={post?.imageurls[0]} className="w-full h-full" alt="" />
          </div>
          <div className="flex-[2] w-full relative  h-[70%] smlg:h-full">
            <div className="mt-2 flex items-center border-b relative border-[#282626] p-2">
              <img
                className="rounded-full ml-3  object-cover w-[45px] h-[45px]"
                src={post?.userId.photoUrl}
                alt="Profile"
              />
              <span className="ml-3">{post?.userId.username} </span>
              <button className="w-[90px]  bg-[#0095F6] text-white h-[28px] absolute  rounded-md mr-4 right-0 ">
                follow
              </button>
            </div>
            <div className="overflow-y-scroll h-[62%] smlg:h-[68%]">
              {postComment?.map((comment) => (
                <CommentBar key={comment._id} data={comment} />
              ))}
            </div>
            <div className="border-t bottom-0 border-[#282626] p-2">
              <div className="flex ">
                {isLikedByCurrentUser ? (
                  <FaHeart
                    onClick={dislikePost}
                    className="text-red-600 cursor-pointer"
                    size={30}
                  />
                ) : (
                  <LuHeart
                    onClick={likePost}
                    className="cursor-pointer"
                    size={30}
                  />
                )}
                <FaRegComment size={30} className="ml-2" />
                <LuSendHorizonal size={30} className="ml-2" />
              </div>
              <p>{likecount} likes</p>
              <div className="flex items-center mt-1">
                <img
                  className="w-[40px] h-[40px] rounded-full mr-2 "
                  src={decoded?.photoUrl}
                  alt=""
                />

                <input
                  className="w-[80%] mt-1 text-white bg-transparent outline-none"
                  type="text"
                  value={comment}
                  onChange={(e) => setcomment(e.target.value)}
                  placeholder="Add a comment"
                />
                {comment && (
                  <button
                    className=" mt-1 text-blue-500"
                    onClick={createComment}
                  >
                    Post
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePost;
