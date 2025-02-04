import React, { useState } from "react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { googleSignIn } from "../../api/services/authService";
import { toast } from "react-toastify";
import { SignupSteps } from "../../enums/SingnupSteps";


const GoogleSignIn: React.FC = () => {

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      const token = credentialResponse.credential;

      try {
        const response = await googleSignIn(token);
        if (response.success) {
          localStorage.setItem("email", response.email);
          localStorage.setItem("signupStep", SignupSteps.Signup_Form);
          toast.success(response.message);
          window.location.reload()
                 
        } else {
          toast.error(response.message);
        }
      } catch (error: any) {
        if (error.response && error.response.data) {
          toast.error(error.response.data.message);
        } else {
          alert("Error Google sign in. Please try again.");
        }
      }
    }
  };

  const handleError = () => {
    console.error("Google login failed");
  };

  return (
    <div className="flex flex-1 justify-center items-center ">
      <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
    </div>
  );
};

export default GoogleSignIn;
