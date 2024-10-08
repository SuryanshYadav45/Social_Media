import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { deployUrl } from '../deployment'

const NotificationBar = ({data}) => {
  const user=useSelector((state)=>state.user.user)
  const navigate=useNavigate()
  const acceptRequest= async()=>
  {
    try {
      const response=await fetch(`${deployUrl}/user/adduser/${data.senderid}/${data._id}`,{
        method:"GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${user.usertoken}`,
      },
      })
      if(response.status===200)
      {
        settext("Following")
        // console.log("friend added successfully")
      }
    } catch (error) {
      console.log(error)
    }
  }
  // console.log(data)
  return (<>
    <div className='bg-black border-t mt-3 border-b border-[#5e5e6455] h-[60px] flex items-center justify-center cursor-pointer'  onClick={()=>navigate(`/p/${data.post}`)}>
        <img className='rounded-full w-[50px] h-[50px] object-cover' src={data.senderphoto} alt="Profile" />
        <p className='ml-3'>{data.message}</p>
        {(data.notificationType==="friendRequest" &&data.reqStatus!=="friend")&&
        <button onClick={acceptRequest} className='w-[80px] bg-[#0095F6] text-white h-[30px] rounded-md ml-2'>Accept</button>
      }
    </div>
    
    </>
  )
}

export default NotificationBar