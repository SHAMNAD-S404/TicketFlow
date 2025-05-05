import { useForm } from "react-hook-form";
import React from "react";
import regexPatterns, { RegexMessages } from "../../../../utils/regexPattern";
import { udpateEmployeeProfile } from "../../../../api/services/companyService";
import { toast } from "react-toastify";
import { useSelector , useDispatch } from "react-redux";
import { Rootstate ,AppDispatch } from "../../../../redux store/store";
import { fetchEmployee } from "../../../../redux store/employeeSlice";
import getErrMssg from "@/components/utility/getErrMssg";

export interface EmployeeEditForm {
  name: string;
  phone: string;
  email: string;
}

interface EmployeeEditFormProps {
  onCancel: () => void;
}

const EmployeeProfileEdit: React.FC<EmployeeEditFormProps> = ({ onCancel }) => {

  const employee = useSelector((state:Rootstate) => state.employee.employee)
  const dispatch = useDispatch<AppDispatch>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmployeeEditForm>({
    defaultValues: {
      name : employee?.name,
      phone : employee?.phone,
    },
  });

  const onSubmit = async (data: EmployeeEditForm) => {
    try {
      data.email = employee?.email as string;
      // API call
      const response = await udpateEmployeeProfile(data);
      if (response.success) {
        toast.success(response.message);
        //refresh the context after successful updation
        dispatch(fetchEmployee());

        onCancel();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(getErrMssg(error))
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto p-4 bg-white shadow-md rounded-md"
    >
      <h2 className="text-lg font-semibold mb-4">Edit Employee Profile</h2>
      {/* Name Field */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600">Name</label>
        <input
          type="text"
          {...register("name", {
            required: "Name is required",
            pattern: {
              value: regexPatterns.name,
              message: RegexMessages.nameRegexMessage,
            },
          })}
          className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>
      {/* Phone Field */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600">Phone</label>
        <input
          type="text"
          {...register("phone", {
            required: "Phone number is required",
            pattern: {
              value: regexPatterns.phoneNumber,
              message: "Enter a valid 10-digit phone number",
            },
          })}
          className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.phone && (
          <p className="text-red-500 text-sm">{errors.phone.message}</p>
        )}
      </div>
       {/* Submit Button */}
      <button
        type="submit"
        className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Save Changes
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="w-full mt-4 p-2 bg-red-400 text-white rounded-md hover:bg-red-600"
      >
        cancel
      </button>
    </form>
  );
};

export default EmployeeProfileEdit;
