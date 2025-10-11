import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import toast from 'react-hot-toast';
import { USER_ROLES } from '../../../common/userEnums';

const GoogleLoginButton = ({ className = "" }) => {
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      // Send the credential to your backend
      const response = await axios.post('/auth/google-login', {
        credential: credentialResponse.credential
      });

      const { token, user } = response.data;

      // Store user data in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("username", user.username);
      localStorage.setItem("email", user.email);
      localStorage.setItem("role", user.role);
      localStorage.setItem("name", user.name);

      toast.success("Google login successful!");
      navigate(user.role === USER_ROLES.ADMIN ? "/admin" : "/profile");
    } catch (error) {
      console.error('Google login error:', error);
      const message = error.response?.data?.message || "Google login failed";
      toast.error(message);
    }
  };

  const handleError = () => {
    console.error('Google login failed');
    toast.error("Google login failed. Please try again.");
  };

  return (
    <div className={`flex justify-center ${className}`}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        theme="filled_blue"
        size="large"
        text="signin_with"
        shape="rectangular"
        width="100%"
        useOneTap={false}
        auto_select={false}
        itp_support={true}
      />
    </div>
  );
};

export default GoogleLoginButton;
