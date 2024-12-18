import React, { useEffect, useState } from 'react'
import SignupHeader from '../components/SignUp/SignupHeader'
import SignupForm from '../components/SignUp/SignupForm'
import OtpVerification from '../components/SignUp/OtpVerification'

const SignUp :React.FC = () => {

  const [step, setStep] = useState<"signup" | "verifyOtp">( ()=> {
    return (localStorage.getItem("signupStep") as "signup" | "verifyOtp" ) || "signup" ;
  });

  useEffect(() => {
    localStorage.setItem("signupStep",step);
  },[step])

  const handleCreateAccount = () => {
    //form validation will be handle here
    setStep("verifyOtp")
  };
  
  return (
    <div className='singup-page'>
        <SignupHeader/>

        {step === "signup" ? (
           <SignupForm onCreateAccount={handleCreateAccount} />
        ) : (
          <OtpVerification/>
        )  }
       
    </div>
       
   
  )
}

export default SignUp