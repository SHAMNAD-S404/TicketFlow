import React from "react";
import SignupHeader from "../components/SignUp/SignupHeader";
import CoAdminLogin from "../components/signIn/CoAdminLogin";
import UserLogin from "../components/signIn/UserLogin";
import { useLocation } from "react-router-dom";

const SignIn: React.FC = () => {
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const role = queryParams.get("role");
  return (
    <div>
      <SignupHeader showDescription={true} />
      {role === "admin" ? (
        <CoAdminLogin />
      ) : role === "employee" ? (
        <UserLogin />
      ) : (
        <div>
          <p className="text-xl text-red-500 font-semibold">Invalid Role! Please return to login selection.</p>
        </div>
      )}
    </div>
  );
};

export default SignIn;
