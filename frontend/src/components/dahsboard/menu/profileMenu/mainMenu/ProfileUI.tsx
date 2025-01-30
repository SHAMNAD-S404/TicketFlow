import React from "react";
import { FaArrowLeft, FaMapMarkerAlt, FaGlobeAmericas } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { IoIosMail } from "react-icons/io";
import { FaPhone, FaBriefcase } from "react-icons/fa6";
import { useUser } from "../../../../../pages/Dashboard";
import { IAdminContext } from "../../../../../types/IAdminContext";

interface ProfileProps {
  onEdit: () => void;
}

const ProfileUI: React.FC<ProfileProps> = ({onEdit}) => {
  const userData = useUser().user;

  //{"companyName" in userData ? userData.companyName : userData.name}
  if (!userData) return <div>Loading...</div>;

  return (
    <div className="flex flex-1 h-full bg-gradient-to-br from-purple-100 to-purple-200 ">
      <div className="w-full h-fit p-6">
        {/* Main Container */}
        <div className="bg-white rounded-3xl shadow-xl p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <button className="hover:bg-purple-50 p-2 rounded-full transition-colors">
              <FaArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <button className="text-green-500 hover:text-green-600 font-medium flex items-center gap-1"
            
              onClick={onEdit}
            >
              <MdEdit className="w-5 h-5" />
              <span>edit</span>
            </button>
          </div>

          {/* Profile Section */}
          <div className="flex flex-col md:flex-row gap-8">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <div className="relative mx-auto md:mx-0">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-200 to-purple-100 flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
                    alt="Profile"
                    className="w-28 h-28 rounded-full object-cover border-4 border-white"
                  />
                </div>
                <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors">
                  <MdEdit className="w-4 h-4 text-purple-600" />
                </button>
              </div>
            </div>

            {/* User Info */}
            <div className="flex-grow">
              <div className="text-center md:text-left mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-1">
                  {" "}
                  {"companyName" in userData
                    ? userData.companyName
                    : userData.name}
                </h1>
                <p className="text-purple-600 font-medium">
                  {"companyType" in userData
                    ? userData.companyType
                    : userData.departmentName}
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
                      {userData.email}
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
                      {"phoneNumber" in userData
                        ? userData.phoneNumber
                        : userData.phone}{" "}
                    </p>
                  </div>
                </div>

                {"originCountry" in userData && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <FaMapMarkerAlt className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="text-gray-700 font-medium">
                        {userData.originCountry}
                      </p>
                    </div>
                  </div>
                )}

                {"corporatedId" in userData && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <FaGlobeAmericas className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Corporate id</p>
                      <p className="text-gray-700 font-medium">
                        {(userData as IAdminContext).corporatedId}
                      </p>
                    </div>
                  </div>
                )}

                {"companyType" in userData && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <FaBriefcase className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Company Type</p>
                      <p className="text-gray-700 font-medium">
                        {userData.companyType}
                      </p>
                    </div>
                  </div>
                )}

                {"departmentName" in userData && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <FaBriefcase className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Department</p>
                      <p className="text-gray-700 font-medium">
                        {userData.departmentName}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <FaBriefcase className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Joined Date</p>
                    <p className="text-gray-700 font-medium">
                      {new Date(userData.createdAt).toLocaleDateString(
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
