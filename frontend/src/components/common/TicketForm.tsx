import React, { useEffect, useState } from "react";
import { Calendar, Paperclip, ChevronDown, Image, TicketsPlane } from "lucide-react";
import { fetchAllDepartemts, fetchAllEmployeeWithLessTicket } from "@/api/services/companyService";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { Messages } from "@/enums/Messages";
import { useForm } from "react-hook-form";
import regexPatterns from "@/utils/regexPattern";
import { RegexMessages } from "@/utils/regexPattern";
import { createTicket } from "@/api/services/ticketService";
import { TicketFormData } from "@/interfaces/formInterfaces";
import getErrMssg from "../utility/getErrMssg";
import { IoCloseCircleSharp } from "react-icons/io5";

export interface IDepartement {
  _id: string;
  departmentName: string;
}

export interface IEmployeeList {
  _id: string;
  name: string;
  email: string;
}

export interface ICompany {
  _id: string;
  companyName: string;
  email: string;
}

interface TicketFormProps {
  handleCancel: () => void;
  ticketRaisedDepartmentName: string;
  ticketRaisedDepartmentID: string;
  ticketRaisedEmployeeID: string;
  ticketRaisedEmployeeName: string;
  ticketRaisedEmployeeEmail: string;
}

const TicketForm: React.FC<TicketFormProps> = ({
  handleCancel,
  ticketRaisedDepartmentName,
  ticketRaisedDepartmentID,
  ticketRaisedEmployeeID,
  ticketRaisedEmployeeName,
  ticketRaisedEmployeeEmail,
}) => {
  const [departments, setDepartments] = useState<IDepartement[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<TicketFormData>();

  const [employees, setEmployees] = useState<IEmployeeList | null>(null);
  const SelectedDepartmentId = watch("ticketHandlingDepartmentId");

  const handleClearImage = () => {
    setPreviewUrl(null)
    setSelectedImage(null);
  }

  const onSubmitForm = async (data: TicketFormData) => {
    const selectedDepartment = departments.find((dept) => dept._id == data.ticketHandlingDepartmentId);
    const selectedEmployee = employees;

    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      formData.append(key, data[key as keyof TicketFormData]);
    });
    formData.append("ticketRaisedDepartmentName", ticketRaisedDepartmentName);
    formData.append("ticketRaisedDepartmentId", ticketRaisedDepartmentID);
    formData.append("ticketRaisedEmployeeId", ticketRaisedEmployeeID);
    formData.append("ticketRaisedEmployeeName", ticketRaisedEmployeeName);
    formData.append("ticketRaisedEmployeeEmail", ticketRaisedEmployeeEmail);
    formData.append("ticketHandlingDepartmentName", selectedDepartment?.departmentName as string);
    formData.append("ticketHandlingEmployeeName", selectedEmployee?.name as string);
    formData.append("ticketHandlingEmployeeEmail", employees?.email as string);

    if (selectedImage) {
      formData.append("file", selectedImage);
    }

    try {
      const response = await createTicket(formData);
      if (response.success) {
        toast.success(response.message);
        setPreviewUrl(null);
        setSelectedImage(null);
        setEmployees(null);
        reset();
      }
    } catch (error: any) {
      toast.error(getErrMssg(error));
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg"];

    const file = event.target.files?.[0];
    if (file) {
      if (!allowedTypes.includes(file.type)) {
        toast.error(Messages.IMAGE_ERROR);
        return;
      }
      if (file.size > 3 * 1024 * 1024) {
        toast.error(Messages.IMAGE_MAX_SIZE_REACHED);
        return;
      }
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    const fetchAllDepartmentsData = async () => {
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
    fetchAllDepartmentsData();
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    if (!SelectedDepartmentId) {
      setEmployees(null);
      return;
    }

    const fetchEmloyees = async () => {
      try {
        const response = await fetchAllEmployeeWithLessTicket(SelectedDepartmentId);
        if (response.success) {
          setEmployees(response.data);
        }
      } catch (error: any) {
        if (error.response && error.response.data) {
          toast.error(Messages.NO_EMPLOYEES || error.response.data.message);
        } else {
          toast.error(Messages.SOMETHING_TRY_AGAIN);
        }
      }
    };

    fetchEmloyees();
  }, [SelectedDepartmentId]);

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="max-w-6xl mx-auto p-1">
      <div className="bg-gradient-to-b from-blue-100 to-blue-200  rounded-3xl p-5 shadow-xl">
        <div className="flex justify-center items-center gap-2 mb-2">
          <h2 className="text-center font-semibold text-2xl text-blue-600 underline ">Create Ticket</h2>
          <TicketsPlane className="text-blue-600 w-8 h-8" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left Column */}
          <div className="space-y-2">
            <div>
              <label className="block text-gray-800 text-lg font-medium mb-1 ms-2">Ticket is creating for?</label>
              {errors.ticketReason && (
                <p className="text-sm font-semibold text-red-500 mt-1">{errors.ticketReason.message}</p>
              )}
              <input
                type="text"
                className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                placeholder="Enter the ticketReason for creating the ticket"
                {...register("ticketReason", {
                  required: RegexMessages.FEILD_REQUIRED,
                  minLength: {
                    value: 5,
                    message: RegexMessages.MINIMUM_LIMIT,
                  },
                  maxLength: {
                    value: 40,
                    message: RegexMessages.MAXIMUM_LIMIT_REACHED,
                  },
                  pattern: {
                    value: regexPatterns.textWithSpaceAndCommas,
                    message: RegexMessages.textWithSpaceAndCommasRegexMessage,
                  },
                })}
              />
            </div>

            <div>
              <label className="block text-gray-800 text-lg font-medium mb-1 ms-2">Describe the issue</label>
              <textarea
                className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent h-40 resize-none text-lg"
                placeholder="Provide detailed description of the issue"
                {...register("description", {
                  required: RegexMessages.FEILD_REQUIRED,
                  minLength: {
                    value: 10,
                    message: RegexMessages.MINIMUM_LIMIT,
                  },
                  maxLength: {
                    value: 200,
                    message: RegexMessages.MAXIMUM_LIMIT_REACHED,
                  },
                  pattern: {
                    value: regexPatterns.textAreaValidation,
                    message: RegexMessages.text_area_validation,
                  },
                })}
              />
            </div>
            {errors.description && <p className="text-sm font-semibold text-red-500">{errors.description.message}</p>}

            {/* image upload */}
            <div>
              <label className="block text-gray-800 text-lg font-medium mb-1 ms-2">Attach media here</label>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e)}
                  className="hidden"
                  id="imageUpload"
                />
                <label
                  htmlFor="imageUpload"
                  className="cursor-pointer flex items-center gap-3 p-4 rounded-xl border border-gray-200 bg-white">
                  <Paperclip className="w-6 h-6 text-gray-500" />
                  <Image className="w-6 h-6 text-gray-500" />
                  <span>Upload Image</span>
                </label>
                {/* Image Preview  only show if image is avilable*/}
                {previewUrl && (
                  <div className="flex ms-4">
                    <div className="mt-4">
                      <img
                        src={previewUrl}
                        alt="Selected Preview"
                        className="w-36 h-36 object-cover rounded-lg border border-gray-300"
                      />
                    </div>
                    <div>
                      <button 
                        onClick={handleClearImage}
                      >
                        <IoCloseCircleSharp className="text-xl mt-2 ms-2 hover:text-red-600 hover:text-2xl" />
                      </button>
                      
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-gray-800 text-lg font-medium mb-1 ms-2">
                Choose Ticket assigning department
              </label>
              <div className="relative">
                <select
                  className="w-full px-6 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white text-lg"
                  {...register("ticketHandlingDepartmentId", {
                    required: RegexMessages.FEILD_REQUIRED,
                    pattern: {
                      value: regexPatterns.textAndNumberWithoutSpace,
                      message: RegexMessages.textWithSpaceAndCommasRegexMessage,
                    },
                  })}>
                  <option value="">Select</option>
                  {departments.map((department) => (
                    <option key={department._id} value={department._id}>
                      {department.departmentName}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500 pointer-events-none" />
              </div>
              {errors.ticketHandlingDepartmentId && (
                <p className="text-sm font-semibold text-red-500 p-2">{errors.ticketHandlingDepartmentId.message}</p>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div>
              <label className="block text-gray-800 text-lg font-medium mb-1 ms-2">
                Choose appropriate priority for this task
              </label>
              <div className="relative">
                <select
                  {...register("priority", {
                    required: RegexMessages.FEILD_REQUIRED,
                    pattern: {
                      value: regexPatterns.textWithSpaceAndCommas,
                      message: RegexMessages.textWithSpaceAndCommasRegexMessage,
                    },
                  })}
                  className="w-full px-6 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white text-lg">
                  <option value="">Select</option>
                  <option value="High priority">High priority</option>
                  <option value="Medium priority">Medium priority</option>
                  <option value="Low priority">Low priority</option>
                </select>
                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500 pointer-events-none" />
              </div>
            </div>
            {errors.priority && <p className="text-sm font-semibold text-red-500">{errors.priority.message}</p>}

            <div>
              <label className="block text-gray-800 text-lg font-medium mb-1 ms-2">
                Select a due date for this task
              </label>
              <div className="relative">
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  max={new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0]}
                  className="w-full px-6 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white text-lg"
                  {...register("dueDate", {
                    required: RegexMessages.FEILD_REQUIRED,
                    pattern: {
                      value: regexPatterns.textAreaValidation,
                      message: RegexMessages.textWithSpaceAndCommasRegexMessage,
                    },
                  })}
                />
                <Calendar className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500 pointer-events-none" />
              </div>
            </div>
            {errors.dueDate && <p className="text-sm font-semibold text-red-500">{errors.dueDate.message}</p>}

            <div>
              <label className="block text-gray-800 text-lg font-medium mb-1 ms-2">
                Any additional support required?
              </label>
              <div className="relative">
                <select
                  className="w-full px-6 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white text-lg"
                  {...register("supportType", {
                    required: RegexMessages.FEILD_REQUIRED,
                    pattern: {
                      value: regexPatterns.textAreaValidation,
                      message: RegexMessages.textWithSpaceAndCommasRegexMessage,
                    },
                  })}>
                  <option value="">Select one</option>
                  <option value="Video call assistance">Video call assistance</option>
                  <option value="Screen sharing">Screen sharing</option>
                  <option value="On-site support">On-site support</option>
                  <option value="Documentation">Documentation</option>
                </select>
                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500 pointer-events-none" />
                {errors.supportType && (
                  <p className="text-sm font-semibold text-red-500 p-2">{errors.supportType.message}</p>
                )}
              </div>
            </div>

            {/* Select Employee (Only Show if Employees Exist) */}
            {employees !== null && (
              <div className="hidden">
                <label className="block text-gray-800 text-lg font-medium mb-3">Assigning Employee</label>
                <div className="relative">
                  <select
                    className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white text-lg"
                    {...register("ticketHandlingEmployeeId", {
                      required: "Employee selection is required",
                    })}>
                    <option value={employees._id}>{employees.name}</option>
                  </select>
                  <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500 pointer-events-none" />
                  {errors.ticketHandlingEmployeeId && (
                    <p className="text-sm font-semibold text-red-500 p-2">{errors.ticketHandlingEmployeeId.message}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-6">
          <button
            type="button"
            onClick={handleCancel}
            className="px-12 py-4 bg-red-500 hover:bg-orange-600 font-semibold text-white rounded-full text-lg  transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
            Cancel
          </button>
          <button
            type="submit"
            className="px-12 py-4 bg-green-500 text-white rounded-full text-lg font-semibold hover:bg-purple-700 transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
            Send Ticket
          </button>
        </div>
      </div>
    </form>
  );
};

export default TicketForm;
