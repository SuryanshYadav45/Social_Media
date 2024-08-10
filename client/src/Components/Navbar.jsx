import React, { useEffect, useState } from 'react'
import { GoHomeFill } from "react-icons/go";
import { FiSearch } from "react-icons/fi";
import { FaFacebookMessenger } from "react-icons/fa";
import { RiNotification2Fill } from "react-icons/ri";
import { MdAddCircle } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { useSocket } from '../socketContext';

const Navbar = ({ user }) => {
    const navigate = useNavigate()
    const socket=useSocket();
    const [currentUser, setcurrentUser] = useState();
    const userdata = useSelector((state) => state.user.user)
    const decodeUser = jwtDecode(userdata.usertoken)
    const[notification,setNotification]=useState(0)
    useEffect(() => {
        if (decodeUser) {
            setcurrentUser(decodeUser);
        }
    }, []);

    useEffect(() => {
        if (socket) {
        
    
          socket.on('disconnect', (reason) => {
            console.log('Disconnected:', reason);
          });
    
          socket.on('postLiked', (data) => {
            console.log("socket message",data)
            setNotification((prevCount) => prevCount + 1);
          });
    
          return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('notification');
          };
        }
      }, [socket, currentUser]);

    return (
        <>
            <div className='w-full bg-black min-h-[100vh] hidden smlg:block text-white  border-r-0.5 border-[#2c2c2d]'>
                <h3 className='pt-10 ml-7 text-[30px] italic hidden lap:block'>Instagram</h3>
                <h3 className='pt-10 ml-7 text-[30px] italic lap:hidden'>I</h3>
                <div className=' h-[50px] flex items-center ml-3 mt-10 cursor-pointer hover:bg-[#161617] rounded-md' onClick={()=>navigate('/')}>
                    <GoHomeFill className='ml-3' size={32} />
                    <span className='text-[20px] ml-4 hidden lap:block'>Home</span>
                </div>

                <div className=' h-[50px] flex items-center ml-3 mt-7 cursor-pointer hover:bg-[#161617] rounded-md'>
                    <FiSearch className='ml-3' size={32} />
                    <span className='text-[20px] ml-4 hidden lap:block'>Search</span>
                </div>
                <div className=' h-[50px] flex items-center ml-3 mt-7 cursor-pointer hover:bg-[#161617] rounded-md' onClick={()=>navigate('/inbox')}>
                    <FaFacebookMessenger className='ml-3' size={32} />
                    <span className='text-[20px] ml-4 hidden lap:block'>Message</span>
                </div>
                <div className=' h-[50px] flex items-center ml-3 mt-7 cursor-pointer hover:bg-[#161617] rounded-md' onClick={()=>navigate('/notification')}>
                    <RiNotification2Fill className='ml-3' size={32} />
                    <span className='text-[20px] ml-4 hidden lap:block'>Notification{notification!=0?notification:null}</span>
                </div>
                <div className=' h-[50px] flex items-center ml-3 mt-7 cursor-pointer hover:bg-[#161617] rounded-md' onClick={() => navigate('/createpost')}>
                    <MdAddCircle className='ml-3' size={32} />
                    <span className='text-[20px] ml-4 hidden lap:block'>Create</span>
                </div>
                <div className=' h-[50px] flex items-center ml-3 mt-7 cursor-pointer  hover:bg-[#161617] rounded-md' onClick={()=>navigate(`/user/${currentUser?.id}`)}>
                    <div className='w-[40px] h-[40px] ml-2  overflow-hidden'>

                        <img className='rounded-full w-full h-full object-cover' src={currentUser?.photoUrl} alt="Profile" />

                    </div>
                    <span className='text-[20px] ml-3 hidden lap:block'>Profile</span>
                </div>
            </div>

            <div className='w-full bg-black h-[50px] smlg:hidden text-white border-t-0.5 border-[#2c2c2d] flex justify-evenly items-center'>

                <div className=' h-[40px] flex items-center ' onClick={()=>navigate('/')}>
                    <GoHomeFill className='' size={32} />
                </div>

                <div className=' h-[40px] flex items-center '>
                    <FiSearch className='' size={32} />
                </div>
                <div className=' h-[40px] flex items-center ' onClick={()=>navigate('/inbox')}>
                    <FaFacebookMessenger className='' size={32} />
                </div>
                <div className=' h-[40px] flex items-center  ' onClick={()=>navigate('/notification')}>
                    <RiNotification2Fill className='' size={32}  />
                </div>
                <div className=' h-[40px] flex items-center ' onClick={() => navigate('/createpost')}>
                    <MdAddCircle className='' size={32} />
                </div>
                <div className=' h-[40px] flex items-center ' onClick={()=>navigate(`/user/${currentUser?.id}`)}>
                    <div className='w-[40px] h-[40px]  overflow-hidden'>

                        <img className='rounded-full w-full h-full object-cover' src={currentUser?.photoUrl} alt="Profile" />

                    </div>
                </div>
            </div>

        </>
    )
}

export default Navbar