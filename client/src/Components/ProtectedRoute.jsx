import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ element }) => {
  const user = useSelector((state) => state.user.user);
  const location = useLocation();

  const expirationTimestamp = new Date(user?.expiration).getTime();

  // Check if the user is logged in and if the token is valid
  const isAuthenticated = user && user.usertoken && ( expirationTimestamp > Date.now());
 
  if (!isAuthenticated) {
    console.log("not authenticated")
   
    return <Navigate to="/login" state={{ from: location }} />;
  }

 
  return element;
};

export default ProtectedRoute;
