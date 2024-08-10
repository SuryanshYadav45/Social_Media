import React, { useEffect, useRef, useState } from "react";
import Navbar from "../Components/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector, useStore } from "react-redux";
import { HiOutlinePhotograph } from "react-icons/hi";
import { SlCamera } from "react-icons/sl";
import { jwtDecode } from "jwt-decode";
import { getDownloadURL, getStorage, ref, uploadBytesResumable, } from "firebase/storage"
import { RiCloseLargeFill } from "react-icons/ri";
import { app } from "../firebase";
import { deployUrl } from "../deployment";
import { signInSuccess, signOut } from '../redux/user/userSlice'

const User = () => {
    const dispatch = useDispatch();
    const navigate=useNavigate()
    const { id } = useParams();
    const fileInputRef = useRef(null);
    const [currentUser, setcurrentUser] = useState();
    const [File, setFile] = useState();
    const [updateProfile, setupdateProfile] = useState(false)
    const [filePreview, setFilePreview] = useState(null);
    const user = useSelector((state) => state.user.user);
    const decodeUser = jwtDecode(user.usertoken);
    const [uploadProgress, setUploadProgress] = useState(null);
    


    const [userData, setuserData] = useState([]);
    const [userPost, setuserPost] = useState([]);
    useEffect(() => {
        const fetchuser = async () => {
            try {
                const response = await fetch(
                    `${deployUrl}/user/userinfo/${id}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `${user.usertoken}`,
                        },
                    }
                );

                if (response.status === 200) {
                    const data = await response.json();
                    
                    setuserData(data.userinfo);
                    setuserPost(data.userpost);
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchuser();
        setFilePreview(decodeUser.photoUrl)
    }, [id]);

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const logout = async () => {
        dispatch(signOut());
        navigate('/login')
      }

    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, `property/` + fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);;
                    setUploadProgress(progress);
                    // console.log(`Upload is ${progress}% done`);
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



    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            const fileURL = URL.createObjectURL(selectedFile);
            setFilePreview(fileURL);
            // console.log(fileURL);
            // console.log(`Selected file: ${selectedFile.name}`);
        }
    };

    const handleUpdate=async()=>
    {
        try {

            const file=await storeImage(File);

            const photoUrl={
                "photoUrl":file
            }
            const response=await fetch(`${deployUrl}/user/updateuser`,{
                method:"POST",
                headers:{
                    'Content-Type':'application/json',
                    Authorization: `${user.usertoken}`,
                },
                body:JSON.stringify(photoUrl)
                
            })
            if(response.status===201)
            {
                // console.log("photo updated successfully")
                setupdateProfile(false)
                const data = await response.json()
                dispatch(signInSuccess(data))
           
                 window.location.reload()
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="flex relative bg-black ">
            <div className="w-full bg-gray-100 smlg:w-[10%] fixed bottom-0 lap:w-[15%] ">
                <Navbar />
            </div>

            <div className="  w-full min-h-screen  text-white bg-black smlg:w-[90%] smlg:ml-[10%] lap:w-[90%] lap:ml-[15%] ">
                <div className="flex w-full justify-center mt-6 ">
                    <img
                        src={userData.photoUrl}
                        className="w-[130px] h-[130px] rounded-full mr-7"
                        alt=""
                    />

                    <div className="flex flex-col">
                        <div className="mb-3 flex justify-between smlg:w-[330px]">
                            <span className="text-[25px]">{userData?.username}</span>

                            {userData._id === decodeUser.id ? (
                                <button className="bg-[#363636] rounded-md ml-2 mt-[1px] text-white w-[80px] h-[35px]" onClick={()=>setupdateProfile(true)}>
                                    Edit Profile
                                </button>
                            ) : (
                                <>
                                    <button className="bg-[#363636] text-white rounded-md w-[80px] h-[35px]">
                                        Following
                                    </button>
                                    <button className="bg-[#363636] text-white rounded-md w-[80px] h-[35px]">
                                        Message
                                    </button>
                                </>
                            )}
                        </div>
                        <div className="flex mb-2">
                            <p className="mr-2 text-[20px]">{userPost?.length} Posts</p>
                            <p className="ml-2 text-[20px]">
                                {userData?.friends?.length} Friends
                            </p>
                        </div>
                        <h3>{userData.fullname}</h3>
                        <button onClick={logout} className='bg-[#363636] w-[130px] rounded-lg h-[30px] mt-3 text-white'>Logout</button>
                    </div>
                </div>
                <div className="w-[80%] h-[1px] bg-[#2c2c2d] mx-auto mt-5"></div>

                <p className="text-center mt-5 uppercase text-[20px]">Posts</p>
                {userPost.length <= 0 ? (
                    <div className="w-full flex-col h-[50%] flex justify-center items-center">
                        <div className="rounded-full border border-[#2c2c2d] p-4">
                            <SlCamera color="#2c2c2d" size={50} />
                        </div>
                        <div>
                            <span className="font-bold text-[30px]">No Posts Yet</span>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4  w-[80%] mx-auto place-items-center">
                        {userPost.map((post) => (
                            <img
                                key={post._id}
                                className="hover:opacity-75 h-[350px]"
                                src={post.imageurls[0]}
                            />
                        ))}
                    </div>
                )}
            </div>
            {updateProfile&&<div className="absolute flex justify-center items-center  backdrop-blur-[6px] bg-transparent w-full h-screen">
                <div className="w-[80%] relative bg-black p-6 flex flex-col   rounded-2xl shadow-sm shadow-gray-500">
                    <RiCloseLargeFill color="white" size={25} onClick={() => setupdateProfile(false)} className="absolute right-3 cursor-pointer" />
                    <h3 className="text-white text-center mb-4 text-[23px]">Updated Profile</h3>
                    <div className="bg-[#2c2c2d] w-[60%] p-3 rounded-xl mx-auto flex">
                        <img
                            src={filePreview}
                            className="w-[60px] h-[60px] rounded-full"
                            alt=""
                        />
                        <div className="ml-2 mt-1">
                            <p className="text-white">{decodeUser?.username}</p>
                            <button onClick={handleButtonClick} className="text-[#0095F6] cursor-pointer font-semibold">
                                Change photo
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                style={{ display: "none" }}
                            />
                        </div>
                    </div>

                    <button disabled={uploadProgress !== null}  className="bg-[#0095F6] w-[120px] h-[35px] text-white mx-auto mt-3 rounded" onClick={handleUpdate}>{uploadProgress !== null ? `Uploading ${uploadProgress}%` : 'Submit'}</button>
                </div>

            </div>}
        </div>
    );
};

export default User;
