import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import FacebokLogin from '../Components/FacebokLogin';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';


const Login = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    })
    const dispatch=useDispatch();

    const handlechange = async (e) => {
        const { name, value } = e.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
    }

    const login = async () => {
        const response = await fetch('http://localhost:4000/auth/login',
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            }
        )

        if (response.status === 200) {
            const data = await response.json()
            
            dispatch(signInSuccess(data))
            navigate('/')
        }

    }

    return (
        <div className='w-full h-[100vh] flex justify-center items-center '>
            <div>
                <div className='w-[350px] tabl:w-[450px] border p-4'>
                    <h1 className='text-center text-[30px] tabl:text-[40px]'>Instagram</h1>
                    <input type="text" name="username" onChange={handlechange} placeholder='Enter your username' className='w-[99%] mt-4 mb-2 p-2 h-[40px] outline-none border' />
                    <input type="password" name='password' onChange={handlechange} placeholder='Password' className='w-[99%] mt-2 p-2 h-[40px] outline-none border' />
                    <button className='w-full bg-[#0095F6] text-white h-[40px] rounded-md mt-5' onClick={login}>Log in</button>



                </div>
                <div className='w-[350px] tabl:w-[450px] border mt-4 p-4 flex justify-center items-center'>
                    <p>Don't have an account ? <Link to="/signup" className='text-[#0095F6]'>Sign up</Link> </p>
                </div>
            </div>
        </div>
    )
}

export default Login