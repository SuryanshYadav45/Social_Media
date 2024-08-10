import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FacebokLogin from "../Components/FacebokLogin";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { deployUrl } from "../deployment";
import toast, { Toaster } from 'react-hot-toast'

const Login = () => {
  const navigate = useNavigate();
  const [loading, setloading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const dispatch = useDispatch();

  const handlechange = async (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const login = async () => {
    try {
      setloading(true);
      const response = await fetch(`${deployUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 200) {
        const data = await response.json();
        setloading(false);
        dispatch(signInSuccess(data));
        navigate("/");
      }
      else if(response.status===401){
        setloading(false)
        const data = await response.json();
        toast.error(data.message)
      }
      else if(response.status===404)
      {
        setloading(false)
        const data = await response.json();
        toast.error(data.message)
      }
    } catch (error) {
      setloading(false);
    }
  };
  

  return (
    <div className="w-full h-[100vh] flex justify-center items-center ">
        <Toaster />
        
      <div>
        <div className="w-[350px] tabl:w-[450px] border p-4">
          <h1 className="text-center text-[30px] tabl:text-[40px]">
            Instagram
          </h1>
          <input
            type="text"
            name="username"
            onChange={handlechange}
            placeholder="Enter your username"
            className="w-[99%] mt-4 mb-2 p-2 h-[40px] outline-none border"
          />
          <input
            type="password"
            name="password"
            onChange={handlechange}
            placeholder="Password"
            className="w-[99%] mt-2 p-2 h-[40px] outline-none border"
          />
          <button
            className="w-full bg-[#0095F6] text-white flex justify-center items-center h-[40px] rounded-md mt-5"
            onClick={login}
          >
            {loading ? (
              <svg class="animate-spin h-5 w-5 mr-3 ..." viewBox="0 0 24 24">
                <circle
                  className="opacity-[0]"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke-width="4"
                ></circle>
                <path
                  className="opacity-100"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.416A7.96 7.96 0 014 12H0c0 6.627 5.373 12 12 12v-4c-3.313 0-6.055-2.09-7.097-5.002z"
                ></path>
              </svg>
            ) : (
              "Log in"
            )}
          </button>
        </div>
        <div className="w-[350px] tabl:w-[450px] border mt-4 p-4 flex justify-center items-center">
          <p>
            Don't have an account ?{" "}
            <Link to="/signup" className="text-[#0095F6]">
              Sign up
            </Link>{" "}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
