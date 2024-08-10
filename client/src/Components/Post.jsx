import React, { useEffect, useState } from 'react'
import { BsThreeDots } from "react-icons/bs";
import { FaRegBookmark } from "react-icons/fa";
import { LuSendHorizonal } from "react-icons/lu";
import { FaRegComment } from "react-icons/fa6";
import { LuHeart } from "react-icons/lu";
import { useSelector } from 'react-redux';
import { FaHeart } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import {formatTimeAgo} from "../helper/converttime.js"
import { FaBookmark } from "react-icons/fa";
import { deployUrl } from '../deployment.js';
const Post = ({ data, currentuser }) => {
    const [isLikedByCurrentUser, setIsLikedByCurrentUser] = useState(data.likes.includes(currentuser?.id));
    const [comment, setcomment] = useState("")
    const [likecount,setlikecount]=useState(data.likes.length)
    const [commentcount,setcommentcount]=useState(data.comments.length)
    const [savedpost,setsavepost]=useState(false)
    const user = useSelector((state) => state.user.user)
    const navigate=useNavigate()
    

    
    const timeAgo = formatTimeAgo(data.createdAt);

    
    const likePost = async () => {
        try {
            
            const response = await fetch(`${deployUrl}/post/likepost`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `${user.usertoken}`
                },
                body: JSON.stringify({ "postid": data._id })

            })

            if (response.status === 200) {
                setIsLikedByCurrentUser(true);
                setlikecount(prevLikeCount => prevLikeCount + 1);
            }
        } catch (error) {
            console.log(error)
        }
    }
    const dislikePost=async()=>
    {
        try {
            const response = await fetch(`${deployUrl}/post/dislike`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `${user.usertoken}`
                },
                body: JSON.stringify({ "postid": data._id })

            })

            if (response.status === 200) {
                setIsLikedByCurrentUser(false);
                setlikecount(prevLikeCount => prevLikeCount - 1);
            }
        } catch (error) {
            console.log(error)
        }
    }
    
    const createComment=async()=>
    {
        try {
            const response=await fetch(`${deployUrl}/post/comment`,{
                method:"POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `${user.usertoken}`
                },
                body:JSON.stringify({
                    "postid":data._id,
                    "comment":comment
                })
            })

            if(response.status==201)
            {
                setcomment("")
                console.log("comment addded successfully")
                setcommentcount(prevcommentcount=> prevcommentcount + 1)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const savepost=async()=>
    {
        try {
            setsavepost(true)
            const response =await fetch(`${deployUrl}/post/savepost/${data._id}`,{
                method:"GET",
                headers:{
                    "Content-Type":"application/json",
                    'Authorization':`${user.usertoken}`
                }
            })
            
        } catch (error) {
            setsavepost(false)
        }
    }

    const unsavepost=async()=>
    {
        try {
            setsavepost(false)
            const response =await fetch(`${deployUrl}/post/unsavepost/${data._id}`,{
                method:"GET",
                headers:{
                    "Content-Type":"application/json",
                    'Authorization':`${user.usertoken}`
                }
            })
            if(response.status===200)
            {
                
                console.log(await response.json())
            }
        } catch (error) {
            setsavepost(true)
        } 
    }
    return (
        <div className='w-[370px] smlg:w-[450px] mt-5'>
            <div className='flex mb-3'>
                <div className='w-[45px] h-[45px]'>
                    <div className=' w-[45px] h-[45px] rounded-full inset-0 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 p-[2px]'>
                        <img className='rounded-full w-full h-full object-cover' src={data.userId.photoUrl} alt="Profile" />
                    </div>
                </div>

                <div className='flex justify-center items-center ml-2 text-white'>
                    <span>{data.userId.username} </span>
                    <span className='ml-1'>• {timeAgo}</span>
                </div>
                <div className='ml-auto flex justify-center items-center text-white'>
                    <BsThreeDots className='mt-2' size={25} />
                </div>
            </div>
            <div>
                <img className='w-full h-[500px]' src={data.imageurls[0]} alt="" />
            </div>
            <div className='flex justify-between h-[30px] mt-2 mb-2 text-white'>
                <div className='flex '>
                    {
                        isLikedByCurrentUser ?
                            <FaHeart onClick={dislikePost} className='text-red-600 cursor-pointer' size={30} /> :
                            <LuHeart onClick={likePost} className='cursor-pointer' size={30} />
                    }

                    <FaRegComment size={30} onClick={()=>navigate(`/p/${data._id}`)} className='ml-2 cursor-pointer ' />
                    <LuSendHorizonal size={30} className='ml-2 cursor-pointer' />
                </div>
                <div>
                    {
                        savedpost?
                        <FaBookmark onClick={unsavepost} className=' cursor-pointer' size={30} />:
                    <FaRegBookmark onClick={savepost} className='text-white cursor-pointer' size={30} />
                    }
                </div>
            </div>
            <h3 className='text-white'>{likecount != 0 ? likecount : 0} likes</h3>
            <p className='text-white'>{data.caption}</p>

            <h4 className='text-white cursor-pointer' onClick={()=>navigate(`/p/${data._id}`)}> {commentcount != 0 ? `View all ${commentcount} comments` : `No comments so far`} </h4>
            <div className='flex items-center'>
                <input
                    className="w-full mt-2 text-white bg-transparent outline-none"
                    type="text"
                    value={comment}
                    onChange={(e) => setcomment(e.target.value)}
                    placeholder='Add a comment'
                />
                {comment && (
                    <button
                        className='ml-2 mt-2 text-blue-500'
                         onClick={createComment}
                    >
                        Post
                    </button>
                )}
            </div>
        </div>
    )
}

export default Post