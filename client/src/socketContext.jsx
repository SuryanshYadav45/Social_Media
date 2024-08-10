import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';
import { jwtDecode } from "jwt-decode";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const userdata = useSelector((state) => state.user.user);
    const [socket, setSocket] = useState(null);
    
 

    // useEffect(() => {
    //     console.log('useEffect triggered, userdata:', userdata);
    
    //     // Add your socket connection logic here
    
    // }, [JSON.stringify(userdata)]);

    useEffect(() => {
       
        console.log('useEffect triggered, userdata:', userdata);
        let decodeUser = null;
        if (userdata != null) {
            try {
                decodeUser = jwtDecode(userdata.usertoken);
                console.log("user decoded successfully",decodeUser)
            } catch (error) {
                console.error("Invalid token", error);
                return; // Exit the useEffect early if there's an issue with decoding
            }
        }

        if (decodeUser) {
            
            
            const newSocket = io('ws://social-media-d1kh.onrender.com'); // replace with your server URL
            setSocket(newSocket);
            console.log("Socket info",newSocket)
            
            const registerMessage = { type: "register", userId: decodeUser.id };
            newSocket.emit('register', registerMessage);
            console.log("Sent register message:", registerMessage);
                    

                // newSocket.on('connect', () => {
                //     console.log('Connected with socket ID:', newSocket.id);
    
                    
                        
                // });
                

            return () => {
                newSocket.close();
            };
        }
        else{
            console.log("user not logged in")
        }

    }, [JSON.stringify(userdata)]); // Add userdata as a dependency to re-run the effect when it changes

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};