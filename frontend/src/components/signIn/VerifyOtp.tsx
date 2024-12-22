import React, { useEffect, useRef, useState } from "react";
import Verify from "../../assets/images/verify.png";
import { useNavigate } from "react-router-dom";

interface VerifyOtpProps {
  verifyHandler  : () => void
}

const VerifyOtp: React.FC<VerifyOtpProps> = ({ verifyHandler }) => {

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(4 * 60 + 59); //initial countdown
  const [isResending , setIsResending] = useState<boolean>(false);
  const inputRef = useRef<(HTMLInputElement | null)[]>([]);

  const navigate = useNavigate();

  //Handle OTP input change
  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    //focus move
    if (value && index < otp.length - 1) {
      inputRef.current[index + 1]?.focus();
    }
  };

  useEffect(() => {
    let interval : NodeJS.Timeout;
    if(timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } 
    return () => clearInterval(interval);
  }, [timer]);

  //resend otp
  const handleResendOtp = async () => {
    try {
      setIsResending(true);
      //axios req is here
      setTimer( 4*60 + 59);
      alert("OTP SENDED")
    } catch (error) {
      console.log("failed to send otp",error);
      alert("Failed to send otp")
      
    } finally {
      setIsResending(false)
    }
  }


  return (
    <div className="flex  items-center justify-center h-screen  bg-gray-50">
      <div className="bg-blue-50 phone:p-8 md:p-24 rounded-2xl shadow-2xl  grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/*Left section*/}
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl text-center font-bold mb-4 text-gray-800">Verify code</h1>
          <p className="text-gray-600 mb-6 text-center">
            An authentication code has been sent to your email.
          </p>

          {/* OTP Input Fields */}
          <div className="flex justify-center gap-4 mb-4">
            {otp.map((value, index) => (
              <input
                key={index}
                ref={(el) => (inputRef.current[index] = el)}
                type="text"
                maxLength={1}
                value={value}
                onChange={(e) => handleInputChange(index, e.target.value)}
                className="w-12 h-12 border-2 border-gray-300 rounded-lg text-center text-xl font-semibold focus:border-blue-500 focus:outline-none"
              />
            ))}
          </div>

          <div>
      {/* Timer and Resend */}
      <p className="text-sm text-gray-600 mb-4">
        Didn’t receive a code?{" "}
        {timer === 0 ? (
          <span
            onClick={handleResendOtp}
            className={`text-blue-500 cursor-pointer ${
              isResending ? "opacity-50" : ""
            }`}
          >
            {isResending ? "Resending..." : "Resend OTP"}
          </span>
        ) : (
          <span className="text-red-500">
            Resend OTP in {Math.floor(timer / 60)}:{(timer % 60)
              .toString()
              .padStart(2, "0")}
          </span>
        )}
      </p>
    </div>

          {/* Verify Button */}
          <button
            type="button"
            className="w-full bg-blue-600 hover:bg-green-600 text-white py-2 rounded-lg text-lg font-medium"
            onClick={verifyHandler}
          >
            Verify
          </button>
        </div>

        {/* Right Section: Image */}
        <div className="hidden md:flex items-center justify-center">
          <img src={Verify} alt="OTP Verification" className="w-80 h-auto" />
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
