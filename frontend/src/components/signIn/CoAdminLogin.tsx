import React, { useEffect, useState } from "react";
import ForgotPassEmail from "./ForgotPassEmail";
import VerifyOtp from "./VerifyOtp";
import NewPassword from "./NewPassword";
import Login from "./Login";

enum Steps {
  Login = "login",
  ForgotPassword = "forgotPassword",
  VerifyCode = "verifyCode",
  NewPassword = "newPassword",
}

const CoAdminLogin: React.FC = () => {
  const [step, setStep] = useState<Steps>(Steps.Login);

  const handleForgotPassword = () => setStep(Steps.ForgotPassword);
  const handleSubmitEmail = () => setStep(Steps.VerifyCode);
  const handleBackToLogin = () => setStep(Steps.Login);
  const handleSetPassword = () => setStep(Steps.NewPassword);

  useEffect(() => {
    const savedStep = localStorage.getItem("currentStep");
    if (savedStep) {
      setStep(savedStep as Steps);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("currentStep", step);
  }, []);

  return (
    <div>
      {step === "login" && <Login handleforgotPass={handleForgotPassword} />}
      {step === "forgotPassword" && (
        <ForgotPassEmail
          userType="admin"
          onSubmitEmail={handleSubmitEmail}
          onBacktoLogin={handleBackToLogin}
        />
      )}
      {step === "verifyCode" && (
        <VerifyOtp verifyHandler={handleSetPassword} userType="admin" />
      )}
      {step === "newPassword" && (
        <NewPassword loginHandler={handleBackToLogin} userType="admin" />
      )}
    </div>
  );
};

export default CoAdminLogin;
