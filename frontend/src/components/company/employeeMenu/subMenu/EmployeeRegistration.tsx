import React, { useEffect, useState } from "react";
import Tooltips from "../../../utility/Tooltips";
import { useForm } from "react-hook-form";
import regexPatterns from "../../../../utils/regexPattern";
import { RegexMessages } from "../../../../utils/regexPattern";
import { toast } from "react-toastify";
import { IEmployeeForm } from "../../../../types/IEmployeeForm";
import { fetchAllDepartemts } from "../../../../api/services/companyService";
import { RiUserSharedFill } from "react-icons/ri";
import RegisterImage from "../../../../assets/images/hero2.png";
import { createEmployee } from "../../../../api/services/companyService";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { Rootstate } from "../../../../redux store/store";
import { Messages } from "@/enums/Messages";
import getErrMssg from "@/components/utility/getErrMssg";

interface Departement {
  _id: string;
  departmentName: string;
}

interface EmployeeRegistrationProps {
  handleCancel: () => void;
}

const EmployeeRegistration: React.FC<EmployeeRegistrationProps> = ({ handleCancel }) => {

  const [departments, setDepartments] = useState<Departement[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const company = useSelector((state: Rootstate) => state.company.company);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetchAllDepartemts();
        if (response && response.data) {
          setDepartments(response.data);
        }
      } catch (error: any) {
        if (error.response && error.response.data) {
          Swal.fire({
            title: "oops",
            text: error.response.data.message,
            icon: "error",
          }).then((result) => {
            if (result.isConfirmed) {
              handleCancel();
            }
          });
        } else {
          toast.error(Messages.SOMETHING_TRY_AGAIN);
        }
      }
    };

    fetchDepartments();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IEmployeeForm>();

  const onSubmit = async (data: IEmployeeForm) => {
    try {
      const selectedDepartment = departments.find((dept) => dept._id === data.departmentId);
      if (selectedDepartment && company) {
        data.departmentName = selectedDepartment.departmentName;
        data.companyId = company._id;
      }
      setLoading(true);
      const response = await createEmployee(data);
      if (response.success) {
        toast.success(response.message);
        reset(); //Reset the form fields
      }
    } catch (error) {
      toast.error(getErrMssg(error));
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="bg-gray-50 mt-8  md:h-[750px] flex items-center justify-center p-6 rounded-2xl shadow-2xl">
      <div className="bg-white  rounded-2xl shadow-xl overflow-hidden max-w-5xl w-full">
        <div className="flex flex-col md:flex-row">
          {/* Left Section */}
          <div className="bg-gray-200 p-8 md:w-5/12">
            <div className="text-2xl font-bold text-gray-800 mb-4">
              "Track Performance,
              <br />
              Boost Productivity
              <br />– Register Your Team Today!"
            </div>
            <div className="mt-8">
              <img src={RegisterImage} alt="Team collaboration" className="rounded-lg w-full object-cover" />
            </div>
          </div>

          {/* Right Section */}
          <div className="p-8 md:w-7/12">
            <div className="flex items-center mb-8 gap-1 justify-center text-blue-600">
              <RiUserSharedFill className="text-xl" />
              <h2 className="text-2xl font-bold text-gray-800">Employee Registration</h2>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {/* Name Field */}
              <div>
                <label className="flex items-center gap-3 text-sm font-medium text-gray-700 mb-1">
                  Enter employee name
                  <Tooltips message="Alphabets and space only allowed" />
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-md bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="John Wick"
                  {...register("name", {
                    required: "This field is required",
                    maxLength: {
                      value: 20,
                      message: "Name must be less than 20 characters",
                    },
                    minLength: {
                      value: 5,
                      message: "Name must be at least 5 characters",
                    },
                    pattern: {
                      value: regexPatterns.name,
                      message: RegexMessages.nameRegexMessage,
                    },
                  })}
                />
                {errors.name && (
                  <div className="text-sm font-medium text-red-500">
                    {errors.name.type === "required" && <p>{errors.name.message}</p>}
                    {errors.name.type === "maxLength" && <p>{errors.name.message}</p>}
                    {errors.name.type === "minLength" && <p>{errors.name.message}</p>}
                    {errors.name.type === "pattern" && <p>{errors.name.message}</p>}
                  </div>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label className="flex items-center gap-3 text-sm font-medium text-gray-700 mb-1">
                  Enter employee email id
                  <Tooltips message="Enter valid email id" />
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2 rounded-md bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="johnwick@gmail.com"
                  {...register("email", {
                    required: "This field is required",
                    maxLength: {
                      value: 30,
                      message: "Email must be less than 30 characters",
                    },
                    minLength: {
                      value: 6,
                      message: "Email must be at least 6 characters",
                    },
                    pattern: {
                      value: regexPatterns.email,
                      message: RegexMessages.emailRegexMessage,
                    },
                  })}
                />
                {errors.email && <p className="text-sm font-semibold text-red-500">{errors.email.message}</p>}
              </div>

              {/* Phone Field */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  Enter employee phone number
                  <Tooltips message="Number only allowed" />
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-2 rounded-md bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="+91 9641100685"
                  {...register("phone", {
                    required: "This field is required",
                    minLength: {
                      value: 10,
                      message: "Phone number must be 10 digits",
                    },
                    maxLength: {
                      value: 10,
                      message: "Phone number must be 10 digits",
                    },
                    pattern: {
                      value: regexPatterns.phoneNumber,
                      message: RegexMessages.phoneNumberRegexMessage,
                    },
                  })}
                />
                {errors.phone && (
                  <div className="text-sm text-red-500 font-medium">
                    {errors.phone.type === "required" && <p>{errors.phone.message}</p>}
                    {errors.phone.type === "minLength" && <p>{errors.phone.message}</p>}
                    {errors.phone.type === "maxLength" && <p>{errors.phone.message}</p>}
                    {errors.phone.type === "pattern" && <p>{errors.phone.message}</p>}
                  </div>
                )}
              </div>

              {/* Department Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select employee department</label>
                <select
                  {...register("departmentId", {
                    required: "this field is required",
                  })}
                  className="w-full px-4 py-2 rounded-md bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option value="">Select</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.departmentName}
                    </option>
                  ))}
                </select>
                {errors.departmentId && (
                  <p className="text-sm text-red-500 font-medium">{errors.departmentId.message}</p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex space-x-4 ">
                <button
                  disabled={loading}
                  type="submit"
                  className={`flex-1 font-semibold text-sm  hover:bg-purple-600 text-white py-2 px-4 rounded-md  transition-colors duration-200 ${loading ? "bg-black cursor-wait" : "bg-blue-500 cursor-pointer"}`}>
                  {loading ? "Processing....." : "Register"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 bg-red-500 hover:bg-green-700 font-semibold text-sm text-white py-2 px-4 rounded-md  transition-colors duration-200">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeRegistration;
