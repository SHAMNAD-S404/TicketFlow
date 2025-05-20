import React from "react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { googleSignIn } from "../../api/services/authService";
import { toast } from "react-toastify";
import { SignupSteps } from "../../enums/SingnupSteps";
import getErrMssg from "../utility/getErrMssg";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux store/store";
import { fetchCompany } from "@/redux store/userSlice";

const GoogleSignIn: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  //google signup
  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      const token = credentialResponse.credential;

      try {
        const response = await googleSignIn(token);
        //if user with email id already exist
        if (response.isExistingUser) {
          const getCompanyData = await dispatch(fetchCompany()).unwrap();
          if (getCompanyData) toast.success(response.message);
          navigate("/company/dashboard/dashboard");
          return;
        }
        if (response.success) {
          localStorage.setItem("email", response.email);
          localStorage.setItem("signupStep", SignupSteps.Signup_Form);
          toast.success(response.message);
          window.location.reload();
        }
      } catch (error) {
        toast.error(getErrMssg(error));
      }
    }
  };

  const handleError = () => {
    toast.error("Google login failed");
  };

  return (
    <div className="flex flex-1 justify-center items-center  ">
      <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
    </div>
  );
};

export default GoogleSignIn;
