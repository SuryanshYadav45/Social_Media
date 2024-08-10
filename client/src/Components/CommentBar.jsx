import React from 'react'
import {formatTimeAgo} from "../helper/converttime.js"
const CommentBar = ({data}) => {
    const time=formatTimeAgo(data?.createdAt)
  return (
    <div className='flex m-3'>
        <div className='flex-[1]'>
            <img className='rounded-full w-[50px] h-[50px]' src={data?.userId.photoUrl} alt="" />
        </div>
        <div className='flex-[6] '>
            <h6>{data?.userId.username}     {time}</h6>
            <p>{data?.text}</p>
        </div>
    </div>
  )
}

export default CommentBar