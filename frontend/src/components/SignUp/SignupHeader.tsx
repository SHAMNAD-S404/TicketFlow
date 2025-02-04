import React from "react";
import { Link } from "react-router-dom";

interface SignupHeaderProps {
  showDescription?: boolean;
}

const SignupHeader: React.FC<SignupHeaderProps> = ({
  showDescription = true,
}) => {
  return (
    <nav className="w-full bg-blue-100 border-b  border-gray-200">
      <div className="max-w-7xl mx-5 px-4 sm:px-6 lg:px-6">
        <div className="flex items-center phone:h-auto md:h-20 ">
          <div className="flex items-center ">
            <div className="ml-2  ">
              <Link to="/">
             
                <h1 className="text-3xl phone:p-5 md:p-1  font-bold to-black  hover:text-blue-600">
                  Tiket{" "}
                  <span className="  bg-gradient-to-l from-purple-500 via-orange-500 to-yellow-500 text-transparent bg-clip-text   hover:text-green-600">
                    Flow
                  </span>{" "}
                </h1>
               
              </Link>
              {showDescription && (
                <p className="text-sm text-gray-600 italic">
                  Welcome to TicketFlow.{" "}
                  <span className="hidden md:inline-block text-blue-500 font-medium">
                    Register to unlock the power of seamless IT ticket
                    management.
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default SignupHeader;
