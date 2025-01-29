import React, { useEffect, useState } from 'react'
import SignupHeader from '../components/SignUp/SignupHeader'
import SignupForm from '../components/SignUp/SignupForm'
import OtpVerification from '../components/SignUp/OtpVerification'
import SignupEmail from '../components/SignUp/SignupEmail'
import { SignupSteps } from '../enums/SingnupSteps'

const SignUp :React.FC = () => {

  const [step, setStep] = useState<SignupSteps>( ()=> {
    return (localStorage.getItem("signupStep") as SignupSteps || SignupSteps.Singup_Email );
  });

  useEffect(() => {
    localStorage.setItem("signupStep",step);
  },[step])

  const gotoVerifyEmail = () => {
    //form validation will be handle here
    setStep(SignupSteps.Verify_OTP)
  };

  const gotoRegisterForm = () => {
    setStep(SignupSteps.Signup_Form)
  }
  
  return (
    <div className='singup-page'>
        <SignupHeader />

        {step === SignupSteps.Singup_Email && (
          <SignupEmail onVerifyEmail={gotoVerifyEmail} />
        )}

        {step === SignupSteps.Verify_OTP && (
          <OtpVerification onSignupForm ={gotoRegisterForm} />
        )}

        {step === SignupSteps.Signup_Form && (
          <SignupForm/>
        ) }


       
    </div>
       
   
  )
}

export default SignUp