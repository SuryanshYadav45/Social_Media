import { jwtDecode } from 'jwt-decode'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { json } from 'react-router-dom'
import { deployUrl } from '../deployment'
const AddUser = ({data}) => {

  const user = useSelector((state) => state.user.user)
  const decodeUser=jwtDecode(user.usertoken);
  const [IsSent, setIsSent] = useState(false)


  const handlefollow= async()=>
  {
    console.log(data)
    try {
      const response=await fetch(`${deployUrl}/user/sendrequest`,{
        method:"POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${user.usertoken}`
        },
        body:JSON.stringify({
          "senderId":decodeUser.id,
          "receiverId":data._id
         })
        })
       
       if(response.status===201)
        {
          console.log("request sent")
          setIsSent(true)
        } 
      
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='flex items-center justify-between w-[250px] lap:w-[300px] p-4 h-[60px] bg-black text-white' >
        <div className='flex justify-center items-center'>
        <div className='w-[45px] h-[45px]'>
                    <div className=' w-[45px] h-[45px] rounded-full inset-0 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 p-[2px]'>
                        <img className='rounded-full w-full h-full object-cover' src={data.photoUrl} alt="Profile" />
                    </div>
                </div>
         <p className='ml-2'>{data.username}</p>       
        </div>
        <button onClick={handlefollow} className='text-[#0095F6]'>{IsSent?"Sent":"Follow"}</button>
    </div>
  )
}

export default AddUser