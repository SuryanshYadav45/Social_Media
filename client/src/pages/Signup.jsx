import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { deployUrl } from "../deployment";

const Signup = () => {
  const [code, setCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setloading] = useState(false)
  const navigate = useNavigate();
  const [formdata, setFormdata] = useState({
    username: "",
    email: "",
    password: "",
    fullname: "",
    photoUrl: "",
  });
  const [File, setFile] = useState();
  const [verification, setVerification] = useState(false);
  const fileInputRef = useRef(null);
  const [filePreview, setFilePreview] = useState("https://shorturl.at/3K8El");

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const fileURL = URL.createObjectURL(selectedFile);
      setFilePreview(fileURL);
      console.log(fileURL);
      console.log(`Selected file: ${selectedFile.name}`);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, `property/` + fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handlechange = (e) => {
    const { name, value } = e.target;
    setFormdata((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSignup = async () => {
    try {
        setloading(true)
      if (File) {
        const imageUrl = await storeImage(File);
        setFormdata((prevData) => ({
          ...prevData,
          photoUrl: imageUrl,
        }));
      }
      const response = await fetch(`${deployUrl}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formdata),
      });
      if (response.status === 201) {
        setloading(false)
        setVerification(true);
        
      }
    } catch (error) {
        setloading(false)
      console.log(error);
    }
  };

  const handleToggle = (e) => {
    setShowPassword(e.target.checked);
  };

  const handlecode = async () => {
    try {
      const response = await fetch(`${deployUrl}/auth/verifyemail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: code,
        }),
      });
      if (response.status === 200) {
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="w-full h-[100vh] flex justify-center items-center ">
      <div>
        {verification ? (
          <div className="w-[350px] tabl:w-[450px] border p-4">
            <p className="text-center  ">
              Enter the confirmation code we sent to {formdata.email}{" "}
              <Link to="" className="text-[#0095F6]">
                Resend Code
              </Link>
            </p>
            <input
              type="text"
              placeholder="Confirmation Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-[99%] mt-4 mb-2 p-2 h-[40px] outline-none border"
            />
            <button
              className="w-full bg-[#0095F6] text-white h-[40px] rounded-md mt-5"
              onClick={handlecode}
            >
              Next
            </button>
          </div>
        ) : (
          <div className="w-[350px] tabl:w-[450px] border p-4">
            <h1 className="text-center text-[30px] tabl:text-[40px]">
              Instagram
            </h1>
            <div className="flex flex-col justify-center mt-2 items-center">
              <img
                src={filePreview}
                className="border border-[#75757c] rounded-full w-[80px] h-[80px]"
                alt=""
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <p
                className="text-[#0095F6] font-semibold cursor-pointer"
                onClick={handleButtonClick}
              >
                Choose Profile Photo
              </p>
            </div>
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handlechange}
              className="w-[99%] mt-4 mb-2 p-2 h-[40px] outline-none border"
            />
            <input
              type="text"
              placeholder="Full Name"
              name="fullname"
              onChange={handlechange}
              className="w-[99%] mt-4 mb-2 p-2 h-[40px] outline-none border"
            />
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={handlechange}
              className="w-[99%] mt-4 mb-2 p-2 h-[40px] outline-none border"
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              name="password"
              onChange={handlechange}
              className="w-[99%] mt-2 p-2 h-[40px] outline-none border"
            />
            <input
              type="checkbox"
              checked={showPassword}
              onChange={handleToggle}
              className="mt-4"
            />{" "}
            Show Password
            <button
              className="w-full bg-[#0095F6] text-white h-[40px] rounded-md mt-5"
              onClick={handleSignup}
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
                "Sign up"
              )}
            </button>
          </div>
        )}

        <div className="w-[350px] tabl:w-[450px] border mt-4 p-4 flex justify-center items-center">
          <p>
            Have an account ?{" "}
            <Link to="/login" className="text-[#0095F6]">
              Log in
            </Link>{" "}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
