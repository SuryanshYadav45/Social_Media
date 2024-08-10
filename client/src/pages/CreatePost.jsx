import React, { useEffect, useRef, useState } from 'react'
import Navbar from '../Components/Navbar'
import { getDownloadURL, getStorage, ref, uploadBytesResumable, } from "firebase/storage"
import { app } from '../firebase.js';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';


const CreatePost = () => {
    const navigate=useNavigate();
    const fileInputRef = useRef(null);
    const user = useSelector((state) => state.user.user)
    const [File, setFile] = useState();
    const [filePreview, setFilePreview] = useState(null);
    const [uploading, setUploading] = useState(false)
    const [ImageUploadDone, setImageUploadDone] = useState(false)
    const [formdata, setFormdata] = useState({
        imageurl: "",
        caption: ""
    });
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
    console.log(File)



    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, `property/` + fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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

    const handleImageSubmit = () => {
        if (File) {
            setUploading(true);
            storeImage(File)
                .then((url) => {
                    setUploading(false);
                    setFormdata((prevFormdata) => ({
                        ...prevFormdata,
                        imageurl: url
                    }));
                    setImageUploadDone(true)
                })

                .catch((error) => {
                    console.log(error);
                    setUploading(false);
                });
        } else {
            console.log("No file selected");
        }
    };

    const handleFormdata = async (e) => {
        setFormdata((prevFormdata) => ({
            ...prevFormdata,
            caption: e.target.value
        }));
    }

    const createPost = async () => {
        try {
            const response= await fetch(`${deployUrl}/post/createpost`,{
                method:"POST",
                headers:{
                    "Content-Type": "application/json",
                    "Authorization":`${user.usertoken}`
                },
                body: JSON.stringify(formdata)
            })
            if(response.status===201)
            {
                navigate('/')
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className=" flex bg-black ">
            <div className="w-full z-50 bg-gray-100 smlg:w-[10%] fixed bottom-0 lap:w-[18%] ">
                <Navbar />
            </div>

            <div className="relative w-full h-screen flex justify-center items-center text-white bg-black smlg:w-[90%] smlg:ml-[10%] lap:w-[82%] lap:ml-[18%]">
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="relative  bg-[#19191A] rounded-md justify-center w-[350px] h-[500px] smlg:w-[600px] items-center mt-3 z-10">
                    <h2 className="text-white text-center mt-1 mb-1 pb-1 border-b border-[#2e2e2f]">Create Post</h2>
                    <div className='flex flex-col justify-center items-center h-[80%] mt-6'>

                        {filePreview ? (<><img className="w-full h-[70%] " src={filePreview} />
                            {!ImageUploadDone && (<button className='w-[130px] bg-[#0095F6] text-white h-[30px] mt-2 rounded-md flex justify-center items-center ' onClick={handleImageSubmit}>
                                {uploading ? <svg class="animate-spin h-5 w-5 mr-3 ..." viewBox="0 0 24 24">
                                    <circle className="opacity-[0]" cx="12" cy="12" r="10" stroke-width="4"></circle>
                                    <path className="opacity-100" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.416A7.96 7.96 0 014 12H0c0 6.627 5.373 12 12 12v-4c-3.313 0-6.055-2.09-7.097-5.002z"></path>
                                </svg> : "Upload"}
                            </button>)}
                            {ImageUploadDone && (<div className='w-full mt-2'>
                                <textarea name="caption" id="caption" placeholder='Write a caption' className='w-full bg-transparent outline-none p-3 resize-none' rows={3} onChange={handleFormdata}></textarea>

                                <button className='w-[100px] bg-[#0095F6] text-white h-[30px] mt-2 rounded-md ml-2 ' onClick={createPost}>Share</button></div>)} </>)
                            : (
                                <><svg aria-label="Icon to represent media such as images or videos" class="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="77" role="img" viewBox="0 0 97.6 77.3" width="96"><title>Icon to represent media such as images or videos</title><path d="M16.3 24h.3c2.8-.2 4.9-2.6 4.8-5.4-.2-2.8-2.6-4.9-5.4-4.8s-4.9 2.6-4.8 5.4c.1 2.7 2.4 4.8 5.1 4.8zm-2.4-7.2c.5-.6 1.3-1 2.1-1h.2c1.7 0 3.1 1.4 3.1 3.1 0 1.7-1.4 3.1-3.1 3.1-1.7 0-3.1-1.4-3.1-3.1 0-.8.3-1.5.8-2.1z" fill="currentColor"></path><path d="M84.7 18.4 58 16.9l-.2-3c-.3-5.7-5.2-10.1-11-9.8L12.9 6c-5.7.3-10.1 5.3-9.8 11L5 51v.8c.7 5.2 5.1 9.1 10.3 9.1h.6l21.7-1.2v.6c-.3 5.7 4 10.7 9.8 11l34 2h.6c5.5 0 10.1-4.3 10.4-9.8l2-34c.4-5.8-4-10.7-9.7-11.1zM7.2 10.8C8.7 9.1 10.8 8.1 13 8l34-1.9c4.6-.3 8.6 3.3 8.9 7.9l.2 2.8-5.3-.3c-5.7-.3-10.7 4-11 9.8l-.6 9.5-9.5 10.7c-.2.3-.6.4-1 .5-.4 0-.7-.1-1-.4l-7.8-7c-1.4-1.3-3.5-1.1-4.8.3L7 49 5.2 17c-.2-2.3.6-4.5 2-6.2zm8.7 48c-4.3.2-8.1-2.8-8.8-7.1l9.4-10.5c.2-.3.6-.4 1-.5.4 0 .7.1 1 .4l7.8 7c.7.6 1.6.9 2.5.9.9 0 1.7-.5 2.3-1.1l7.8-8.8-1.1 18.6-21.9 1.1zm76.5-29.5-2 34c-.3 4.6-4.3 8.2-8.9 7.9l-34-2c-4.6-.3-8.2-4.3-7.9-8.9l2-34c.3-4.4 3.9-7.9 8.4-7.9h.5l34 2c4.7.3 8.2 4.3 7.9 8.9z" fill="currentColor"></path><path d="M78.2 41.6 61.3 30.5c-2.1-1.4-4.9-.8-6.2 1.3-.4.7-.7 1.4-.7 2.2l-1.2 20.1c-.1 2.5 1.7 4.6 4.2 4.8h.3c.7 0 1.4-.2 2-.5l18-9c2.2-1.1 3.1-3.8 2-6-.4-.7-.9-1.3-1.5-1.8zm-1.4 6-18 9c-.4.2-.8.3-1.3.3-.4 0-.9-.2-1.2-.4-.7-.5-1.2-1.3-1.1-2.2l1.2-20.1c.1-.9.6-1.7 1.4-2.1.8-.4 1.7-.3 2.5.1L77 43.3c1.2.8 1.5 2.3.7 3.4-.2.4-.5.7-.9.9z" fill="currentColor"></path></svg>
                                    <span className='mt-2'>Select Your Image</span>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        style={{ display: 'none' }}
                                    />
                                    <button onClick={handleButtonClick} className='w-[130px] bg-[#0095F6] text-white h-[30px] rounded-md mt-5'>Select Photo</button>
                                </>)}
                    </div>
                </div>
            </div>


        </div>
    )
}

export default CreatePost