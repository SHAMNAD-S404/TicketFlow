import React, { useEffect, useState } from "react";
import UserLogHome from "./UserLogHome";
import ForgotPassEmail from "./ForgotPassEmail";
import VerifyOtp from "./VerifyOtp";
import NewPassword from "./NewPassword";

enum Steps {
  Login = "login",
  ForgotPassword = "forgotPassword",
  VerifyCode = "verifyCode",
  NewPassword = "newPassword",
}

const UserLogin: React.FC = () => {
  const [step, setStep] = useState<Steps>(Steps.Login);

  const goToLogin = () => setStep(Steps.Login);
  const goToForgotPassword = () => setStep(Steps.ForgotPassword);
  const goToVerify = () => setStep(Steps.VerifyCode);
  const goToNewPassword = () => setStep(Steps.NewPassword);

  useEffect(() => {
    const savedStep = localStorage.getItem("currentStep");
    if (savedStep) {
      setStep(savedStep as Steps);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("currentStep", step);
  }, [step]);

  return (
    <div>
      {step === Steps.Login && (
        <UserLogHome forgotPassword={goToForgotPassword} />
      )}
      {step === Steps.ForgotPassword && (
        <ForgotPassEmail
          userType="user"
          onSubmitEmail={goToVerify}
          onBacktoLogin={goToLogin}
        />
      )}
      {step === Steps.VerifyCode && (
        <VerifyOtp userType="user" verifyHandler={goToNewPassword} />
      )}
      {step === Steps.NewPassword && (
        <NewPassword userType="user" loginHandler={goToLogin} />
      )}
    </div>
  );
};

export default UserLogin;
