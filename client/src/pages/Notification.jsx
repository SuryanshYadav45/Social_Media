import React, { useEffect, useState } from 'react'
import Navbar from '../Components/Navbar'
import AddUser from '../Components/AddUser'
import { useDispatch, useSelector } from 'react-redux'
import { jwtDecode } from 'jwt-decode'
import { signOut } from '../redux/user/userSlice'
import NotificationBar from '../Components/NotificationBar'
import { useSocket } from '../socketContext'
import { useNavigate } from 'react-router-dom'
import { deployUrl } from '../deployment'

const Notification = () => {
  const socket=useSocket();
    const dispatch=useDispatch()
    const navigate=useNavigate()
    const user = useSelector((state) => state.user.user)
    const decodeUser = jwtDecode(user.usertoken)
    const [Account,setAccount]=useState([])
    const [currentUser, setcurrentUser] = useState();
    const[notification,setNotification]=useState([])
  
    useEffect(() => {
      if (socket) {
        
  
        socket.on('disconnect', (reason) => {
          console.log('Disconnected:', reason);
        });
  
        socket.on('postLiked', (data) => {
          console.log("socket message",data)
          setNotification((prevCount) => prevCount + 1);
        });
        socket.on('friendrequest',(data)=>
        {
          console.log("socket message",data);
        })
  
        return () => {
          socket.off('connect');
          socket.off('disconnect');
          socket.off('notification');
        };
      }
    }, [socket, currentUser]);


    useEffect(() => {
        if (decodeUser) {
          setcurrentUser(decodeUser);
        }
        if(user.usertoken===null)
        {
          navigate('/login')
        }
    
        const fetchUser=async()=>
        {
          const response=await fetch(`${deployUrl}/user/getusers`,{
            method:"GET",
            headers:{
              "Content-Type": "application/json",
              "Authorization":`${user.usertoken}`
            }
          })
    
          if(response.status===200)
          {
            const data= await response.json()
            
            setAccount(data)
           
          }
        }
    fetchUser()
        
    const fetchNotification=async()=>
      {
        const response=await fetch(`${deployUrl}/notification/getnotification`,{
          method:"GET",
          headers:{
            "Content-Type": "application/json",
            "Authorization":`${user.usertoken}`
          }
        })
  
        if(response.status===200)
        {
          const data= await response.json()
          
          setNotification(data)
         
        }
      }
      fetchNotification()
      
      }, []);

      console.log(notification)
      const logout = async () => {
        dispatch(signOut());
        navigate('/login')
      }

  return (
    <div className=" flex bg-black ">
            <div className="w-full bg-gray-100 smlg:w-[10%] fixed bottom-0 lap:w-[18%] ">
                <Navbar />
            </div>

            <div className="relative w-full min-h-screen  text-white bg-black smlg:w-[90%] smlg:ml-[10%] lap:w-[82%] lap:ml-[18%]">
              {
                notification.map((notification)=>
                (
                  <NotificationBar  data={notification}/> 
                ))
               }

               {/* <Notification comment={true}/>
               <Notification friendreq={true}/> */}
            </div>

            <div className="w-[30%] bg-black hidden border-l-0.5 pl-2 border-[#2c2c2d] lap:w-[32%] lap:block">
        <div className='flex items-center justify-between w-[250px] lap:w-[300px]  p-4 h-[60px] mt-5 bg-black text-white' >
          <div className='flex justify-center items-center'>
            <div className='w-[45px] h-[45px]'>
              <div className=' w-[45px] h-[45px] rounded-full inset-0 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 p-[2px]'>
                <img className='rounded-full w-full h-full object-cover' src={currentUser?.photoUrl} alt="Profile" />
              </div>
            </div>
            <p className='ml-2'>{currentUser?.username}</p>
          </div>
          <button onClick={logout} className='text-[#0095F6]'>Logout</button>
        </div>
        <div className='flex justify-between w-[250px] lap:w-[300px] mt-5'>
          <p className='text-white'>Suggestion for you</p>

          <a className='text-white font-bold mr-3' href="/">See All</a>
        </div>
        {
          Account.map((account)=>
          (
            <AddUser key={account._id} data={account}/>
          ))
        }
      </div>
        </div>
  )
}

export default Notification