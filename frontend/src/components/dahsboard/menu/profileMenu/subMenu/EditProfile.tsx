import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { IAdminContext } from "../../../../../types/IAdminContext";
import { useUser } from "../../../../../pages/Dashboard";
import { updateCompanyProfile } from "../../../../../api/services/companyService";
import { toast } from "react-toastify";

interface ProfileEditProps {
  onCancel: () => void;
}

export interface IcompanyEditForm{
    companyName : string,
    companyType : string,
    phoneNumber : string,
    corporatedId : string,
    originCountry : string,
    email : string,
}

const ProfileEdit: React.FC<ProfileEditProps> = ({ onCancel }) => {
  const userData = useUser().user;
  const refreshUser = useUser().refreshUser;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IcompanyEditForm>({
    defaultValues: {
      companyName:
        "companyName" in (userData ?? {})
          ? (userData as IAdminContext).companyName
          : "",
      companyType:
        "companyType" in (userData ?? {})
          ? (userData as IAdminContext).companyType
          : "",
      phoneNumber:
        "phoneNumber" in (userData ?? {})
          ? (userData as IAdminContext).phoneNumber
          : "",
          corporatedId:
        "corporatedId" in (userData ?? {})
          ? (userData as IAdminContext).corporatedId
          : "",
      originCountry:
        "originCountry" in (userData ?? {})
          ? (userData as IAdminContext).originCountry
          : "",
    },
  });

  const onSubmit = async(data: IcompanyEditForm) => {
       try {
        data.email = userData?.email as string;
        console.log("Updated Profile Data:", data);
    
    
        // API call  to update profile
        const response = await updateCompanyProfile(data);
         if(response.success) {
                toast.success(response.message)
                //refresh the context after successful updation
                await refreshUser();
                onCancel();
            }else{
                toast.error(response.message)
            }
       } catch (error : any) {
         if (error.response && error.response.data) {
                    toast.error(error.response.data.message);
                  } else {
                    alert('Error on register employee. Please try again later.');
                  }
       }

  };

  return (
    <div className="flex flex-1 justify-center h-full bg-gradient-to-br from-purple-100 to-purple-200 p-14">
      <div className="w-full   max-w-lg bg-white p-6 rounded-3xl shadow-xl">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Edit Profile</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Company Name
            </label>
            <input
              type="text"
              {...register("companyName", {
                required: "Company Name is required",
              })}
              className="w-full mt-1 p-2 border rounded-lg"
            />
            {errors.companyName && (
              <p className="text-red-500 text-sm">
                {errors.companyName.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600">
              Choose company type
            </label>
            <select
              className="w-full p-2 mt-1 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              {...register("companyType", {
                required: "Please select a company type",
              })}
            >
              <option value="" disabled>
                Select a company type
              </option>
              <option value="IT Industry">IT Industry</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Finance">Finance</option>
              <option value="Education">Education</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Retail">Retail</option>
            </select>
            {errors.companyType && (
              <p className="text-red-500 text-sm">
                {errors.companyType.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="text"
              {...register("phoneNumber", {
                required: "Phone Number is required",
              })}
              className="w-full mt-1 p-2 border rounded-lg"
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Corporate ID
            </label>
            <input
              type="text"
              {...register("corporatedId", {
                required: "Corporate ID is required",
              })}
              className="w-full mt-1 p-2 border rounded-lg"
            />
            {errors.corporatedId && (
              <p className="text-red-500 text-sm">
                {errors.corporatedId.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Origin Country
            </label>
            <input
              type="text"
              {...register("originCountry", {
                required: "Origin Country is required",
              })}
              className="w-full mt-1 p-2 border rounded-lg"
            />
            {errors.originCountry && (
              <p className="text-red-500 text-sm">
                {errors.originCountry.message}
              </p>
            )}
          </div>

          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEdit;
