import React from 'react'
import FacebookLogin from 'react-facebook-login';

const FacebokLogin = () => {
    const responseFacebook = (response) => {
        console.log(response);
        // Handle the response from Facebook here (e.g., save the user info in your state, send it to your backend, etc.)
      };
  return (
    <FacebookLogin
    appId="867061348614929" // Replace with your Facebook app ID
    autoLoad={false}
    fields="name,email,picture"
    callback={responseFacebook}
    cssClass="w-full bg-[#1877F2] text-white h-[40px] rounded-md flex items-center justify-center mt-4"
    icon="fa-facebook"
    textButton=" Log in with Facebook"
  />
  )
}

export default FacebokLogin