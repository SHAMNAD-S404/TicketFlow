import React, { useState } from "react";
import { FaArrowLeft, FaRegCalendarAlt } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { IoIosMail } from "react-icons/io";
import { FaPhone, FaBriefcase } from "react-icons/fa6";
import ProfileEdit from "../subMenu/EmployeeProfileEdit";
import { useSelector } from "react-redux";
import { Rootstate } from "../../../../redux/store";

const ProfileUI: React.FC = () => {
  const [currentView, setCurrentView] = useState<"view" | "edit">("view");
  const employee = useSelector((state: Rootstate) => state.employee.employee);

  if (!employee) return <div>Loading...</div>;

  const handleEditClick = () => {
    setCurrentView("edit");
  };

  const handleCancel = () => {
    setCurrentView("view");
  };

  if (currentView === "edit") {
    return <ProfileEdit onCancel={handleCancel} />;
  }

  return (
    <div className="flex flex-1 lg:h-[700px] bg-gradient-to-b from-purple-100 to-purple-50 justify-center p-8 rounded-2xl shadow-xl ">
      <div className="w-full h-fit p-6">
        {/* Main Container */}
        <div className="bg-white    lg:h-[500px] rounded-3xl shadow-2xl p-12 lg:mt-8`">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <button className="hover:bg-purple-100 p-2 rounded-full transition-colors">
              <FaArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <button
              className="text-green-500 hover:text-green-600 font-medium flex items-center gap-1"
              onClick={() => handleEditClick()}
            >
              <div className="flex items-center hover:text-red-500 transition-transform duration-200 ease-in">
                <MdEdit className="w-7 h-7 " />
                <span className="text-xl font-medium">edit</span>
              </div>
            </button>
          </div>

          {/* Profile Section */}
          <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <div className="relative mx-auto md:mx-0">
                <div className="w-36 h-36 rounded-full bg-gradient-to-br from-purple-200 to-purple-100 flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
                    alt="Profile"
                    className="w-36 h-36 p-2 rounded-full object-cover border-4 border-white"
                  />
                </div>
                <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg hover:bg-purple-500 transition-colors">
                  <MdEdit className="w-4 h-4 text-purple-600 hover:text-black" />
                </button>
              </div>
            </div>

            {/* User Info */}
            <div className="flex-grow">
              <div className="text-center md:text-left mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-1">
                  {" "}
                  {employee.name}
                </h1>
                <p className="text-purple-600 font-medium">
                  {employee.departmentName}
                </p>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <IoIosMail className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="text-gray-700 font-medium">
                      {employee.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <FaPhone className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="text-gray-700 font-medium">
                      {" "}
                      {employee.phone}{" "}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <FaBriefcase className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Department Name</p>
                    <p className="text-gray-700 font-medium">
                      {employee.departmentName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <FaRegCalendarAlt className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Joined Date</p>
                    <p className="text-gray-700 font-medium">
                      {new Date(employee.createdAt).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileUI;
