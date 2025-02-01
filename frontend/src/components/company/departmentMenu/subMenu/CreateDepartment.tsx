import React from "react";
import Tooltips from "../../../utility/Tooltips";
import { useForm } from "react-hook-form";
import regexPatterns from "../../../../utils/regexPattern";
import { toast } from "react-toastify";
import { createDepartment } from "../../../../api/services/companyService";
interface CreateDepartmentProps {
    setActiveSubMenu : ()=> void;
}

export interface DepartemntForm {
  departmentName: string;
  responsibilities: string;
}

const CreateDepartment: React.FC<CreateDepartmentProps> = ({setActiveSubMenu}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DepartemntForm>();

  const onSubmit = async (data: DepartemntForm) => {
   
    try {
      const response = await createDepartment(data);
      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message);
      } else {
        alert("Error creating account. Please try again.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center px-4 mt-8">
       
      <div className=" bg-gradient-to-b from-violet-200 to-blue-300 w-2/4 rounded-xl shadow-xl shadow-gray-500 overflow-hidden p-4 ">
        <h2 className="text-center text-2xl text-black  font-semibold ">
          Add Departments
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col  items-center gap-4  ">
            <div className="w-3/4 space-y-1 p-4 ">
              <label className="flex gap-5 items-center text-lg font-medium">
                Enter Department Name
                <Tooltips message="Alphabates and space only allowed" />
              </label>
              <input
                className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none  focus:ring-2 focus:ring-blue-300x"
                type="text"
                placeholder="Finance Departemnt"
                {...register("departmentName", {
                  required: "This field is required !!",
                  maxLength: 20,
                  min: 5,
                  pattern: {
                    value: regexPatterns.name,
                    message:
                      "Only alphabets and numbers are allowed. Leading space not allowed",
                  },
                })}
              />
              {errors.departmentName && (
                <p className="text-sm font-medium text-red-500">
                  {errors.departmentName.message}
                </p>
              )}
            </div>

            <div className="w-3/4 space-y-1 px-4">
              <label className="flex gap-1 items-center text-lg font-medium">
                Department Responsibilities
                <Tooltips message="Alphabates ,space and comma only allowed " />
              </label>
              <input
                className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
                type="text"
                placeholder="bills management and finance accounting"
                {...register("responsibilities", {
                  required: "This field is required !!",
                  maxLength: 60,
                  min: 5,
                  pattern: {
                    value: regexPatterns.textWithSpaceAndCommas,
                    message: "Text , space and commas only allowed",
                  },
                })}
              />
              {errors.responsibilities && (
                <p className="text-sm font-bold text-red-500">
                  {errors.responsibilities.message}
                </p>
              )}
            </div>

            <div className= "flex  items-center gap-8">

             <button
                className="bg-gray-100 hover:text-white font-bold p-2 rounded-2xl w-32 shadow-xl shadow-gray-400 text-lg  mt-4 mb-8 transition-transform duration-300 hover:bg-lime-500 hover:shadow-xl hover:shadow-gray-600 "
                type="submit"
                >
                Create
                </button>
                <button
                onClick={()=> setActiveSubMenu()}
                className="bg-red-500 text-white hover:text-white font-bold p-2 rounded-2xl w-32 shadow-2xl shadow-black text-lg mt-4 mb-8 transition-transform duration-300 hover:bg-red-700 hover:shadow-xl hover:shadow-gray-600 "
                type="button"
                >
                Cancel
             </button>

            </div>

          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDepartment;
