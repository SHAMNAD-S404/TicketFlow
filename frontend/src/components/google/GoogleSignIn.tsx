import React from "react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { googleSignIn } from "../../api/services/authService";
import { toast } from "react-toastify";
import { SignupSteps } from "../../enums/SingnupSteps";
import getErrMssg from "../utility/getErrMssg";


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

        }
      } catch (error: any) {
       toast.error(getErrMssg(error))
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
