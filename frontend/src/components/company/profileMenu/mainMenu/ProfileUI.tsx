import React, { useState } from "react";
import { FaArrowLeft, FaMapMarkerAlt, FaGlobeAmericas, FaRegCalendarAlt } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { IoIosMail } from "react-icons/io";
import { FaPhone, FaBriefcase } from "react-icons/fa6";
import { RiLockPasswordFill } from "react-icons/ri";
import ProfileEdit from "../subMenu/ProfileEdit";
import { useSelector, useDispatch } from "react-redux";
import { Rootstate, AppDispatch } from "../../../../redux store/store";
import { fetchCompany } from "@/redux store/userSlice";
import { toast } from "react-toastify";
import { updateCompanyDp } from "@/api/services/companyService";
import getErrMssg from "@/components/utility/getErrMssg";
import ChangePassword from "@/components/common/ChangePassword";

const ProfileUI: React.FC = () => {
 
  const company = useSelector((state: Rootstate) => state.company.company);
  const dispatch = useDispatch<AppDispatch>();

 const [currentView, setCurrentView] = useState<"view" | "edit">("view");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>(company?.imageUrl || "");
  const [loading, setLoading] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg"];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      toast.error("please select a file");
      return;
    }
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type. Only JPEG, PNG, and GIF are allowed.");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      toast.error("Select file below 3 mb");
      return;
    }
    setSelectedFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  //change password component view handle
  const hanldeChangePassword = () => setIsVisible(!isVisible)


  //handle image upload
  const hanldeUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a image");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    setLoading(true);

    try {
      console.log(selectedFile);
      console.log("fromdata:", formData);
      for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await updateCompanyDp(formData);
      if (response.success) {
        setPreviewImage(response.imageUrl);
        dispatch(fetchCompany());
        toast.success(response.message);
        setLoading(false);
      }
    } catch (error: any) {
      toast.error(getErrMssg(error));
      setLoading(false);
    }
  };

  if (!company) return <div>Loading...</div>;

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
    <div className="flex flex-1 lg:h-[840px] bg-gradient-to-b from-blue-50 to-blue-100 justify-center px-2 rounded-2xl shadow-xl ">
      <div className="w-full h-fit px-6">
        <h1 className="text-center  text-3xl font-semibold underline underline-offset-8 ">Profile</h1>
        {/* Main Container */}
        <div className="bg-white lg:h-[650px] rounded-3xl shadow-2xl p-12 lg:mt-8">
          {/* Header */}
          <header>
            <div className="flex justify-between items-center mb-8">
              <button className="hover:bg-purple-100 p-2 rounded-full transition-colors">
                <FaArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <button
                className="text-green-500 hover:text-green-600 font-medium flex items-center gap-1"
                onClick={() => handleEditClick()}>
                <div className="flex items-center hover:text-red-500 transition-transform duration-200 ease-in">
                  <MdEdit className="w-7 h-7" />
                  <span className="text-xl font-medium">edit</span>
                </div>
              </button>
            </div>
          </header>

          {/* Profile Section */}
          <div className="flex flex-col md:flex-row gap-8">
            {/* Profile Image */}
            <aside>
              <div className="flex-shrink-0">
                <div className="relative mx-auto md:mx-0">
                  <div className="w-36 h-36 rounded-full bg-gradient-to-br from-purple-200 to-purple-100 flex items-center justify-center">
                    <img
                      src={previewImage}
                      alt="Profile"
                      className="w-36 h-36 p-2 rounded-full object-cover border-4 border-white"
                    />
                  </div>
                  {/* upload button */}
                  <button
                    className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg hover:bg-lime-300  transition-colors"
                    onClick={() => document.getElementById("fileInput")?.click()}>
                    <MdEdit className="w-4 h-4 text-purple-600 hover:text-black  hover:text-xl hover:w-6 hover:h-6 " />
                  </button>

                  {/* hidden file input */}
                  <input
                    type="file"
                    id="fileInput"
                    accept="image/jpeg , image/jpg , image/png , image/gif"
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  {/* upload button */}
                  {selectedFile && (
                    <button
                      onClick={hanldeUpload}
                      disabled={loading}
                      className={`mt-3 px-4 py-2 text-white rounded-lg ${
                        loading ? "bg-gray-400 cursor-not-allowed " : "bg-blue-500 hover:bg-blue-700"
                      }`}>
                      {loading ? "Uploading..." : "Upload"}
                    </button>
                  )}
                </div>
              </div>
            </aside>

            {/* User Info */}
            <main className="flex-grow">
              <div className="flex-grow">
                <div className="text-center md:text-left mb-6">
                  <h1 className="text-2xl font-bold text-gray-800 mb-1"> {company.companyName}</h1>
                  <p className="text-purple-600 font-medium">{company.companyType}</p>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <IoIosMail className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email Address</p>
                      <p className="text-gray-700 font-medium">{company.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <FaPhone className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p className="text-gray-700 font-medium"> {company.phoneNumber} </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <FaMapMarkerAlt className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="text-gray-700 font-medium">{company.originCountry}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <FaGlobeAmericas className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Corporate id</p>
                      <p className="text-gray-700 font-medium">{company.corporatedId}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <FaBriefcase className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Company Type</p>
                      <p className="text-gray-700 font-medium">{company.companyType}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <FaRegCalendarAlt className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Joined Date</p>
                      <p className="text-gray-700 font-medium">
                        {new Date(company.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  {/* chnage password session */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <RiLockPasswordFill className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <button 
                      onClick={hanldeChangePassword}
                      className="bg-violet-500 px-2 py-1 rounded-xl text-white text-sm font-semibold hover:bg-green-500">
                       {isVisible ? "Cancel" : "Change Password"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* change password input fields */}
                <footer>


                {isVisible && (
                   <ChangePassword
                    userEmail={company.email}
                   />
                )}


                </footer>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileUI;
