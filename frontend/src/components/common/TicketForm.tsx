import React, { useEffect, useState } from "react";
import { Calendar, Paperclip, ChevronDown, Image, TicketsPlane } from "lucide-react";
import { fetchAllDepartemts, fetchEmployeesByDepartment } from "@/api/services/companyService";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { Messages } from "@/enums/Messages";
import { useForm } from "react-hook-form";
import regexPatterns from "@/utils/regexPattern";
import { RegexMessages } from "@/utils/regexPattern";
import { createTicket } from "@/api/services/ticketService";
import { TicketFormData } from "@/interfaces/formInterfaces";

export interface IDepartement {
  _id: string;
  departmentName: string;
}

export interface IEmployeeList {
  _id: string;
  name: string;
  email: string;
}

interface TicketFormProps {
  handleCancel: () => void;
  ticketRaisedDepartmentName: string;
  ticketRaisedDepartmentID: string;
  ticketRaisedEmployeeID: string;
  ticketRaisedEmployeeName: string;
}

const TicketForm: React.FC<TicketFormProps> = ({
  handleCancel,
  ticketRaisedDepartmentName,
  ticketRaisedDepartmentID,
  ticketRaisedEmployeeID,
  ticketRaisedEmployeeName,
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

  const [employees, setEmployees] = useState<IEmployeeList[]>([]);
  const SelectedDepartmentId = watch("ticketHandlingDepartmentId");

  const onSubmitForm = async (data: TicketFormData) => {
    const selectedDepartment = departments.find((dept) => dept._id == data.ticketHandlingDepartmentId);
    const selectedEmployee = employees.find((employee) => employee._id == data.ticketHandlingEmployeeId);

    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      formData.append(key, data[key as keyof TicketFormData]);
    });
    formData.append("ticketRaisedDepartmentName", ticketRaisedDepartmentName);
    formData.append("ticketRaisedDepartmentId", ticketRaisedDepartmentID);
    formData.append("ticketRaisedEmployeeId", ticketRaisedEmployeeID);
    formData.append("ticketRaisedEmployeeName", ticketRaisedEmployeeName);
    formData.append("ticketHandlingDepartmentName", selectedDepartment?.departmentName as string);
    formData.append("ticketHandlingEmployeeName", selectedEmployee?.name as string);

    if (selectedImage) {
      formData.append("file", selectedImage);
    }

    try {
      const response = await createTicket(formData);
      if (response.success) {
        toast.success(response.message);
        setPreviewUrl(null);
        setSelectedImage(null);
        reset();
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message);
      } else {
        toast.error(Messages.SOMETHING_TRY_AGAIN);
      }
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg"];

    const file = event.target.files?.[0];
    if (file) {
      if (!allowedTypes.includes(file.type)) {
        toast.error("Invalid file type. Only JPEG, PNG, and GIF are allowed.");
        return;
      }
      if (file.size > 3 * 1024 * 1024) {
        toast.error("Select file below 3 mb");
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
      setEmployees([]);
      return;
    }

    const fetchEmloyees = async () => {
      try {
        const response = await fetchEmployeesByDepartment(SelectedDepartmentId);
        if (response.success) {
          setEmployees(response.data);
        }
      } catch (error: any) {
        if (error.response && error.response.data) {
          toast.error(error.response.data.message);
        } else {
          toast.error(Messages.SOMETHING_TRY_AGAIN);
        }
      }
    };

    fetchEmloyees();
  }, [SelectedDepartmentId]);

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="max-w-6xl mx-auto p-8">
      <div className="flex justify-center items-center gap-2">
        <h2 className="text-center font-semibold text-2xl text-blue-600 underline ">Create Ticket</h2>
        <TicketsPlane className="text-blue-600 w-8 h-8" />
      </div>
      <div className="bg-gradient-to-b from-blue-100 to-blue-200 rounded-3xl p-12 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left Column */}
          <div className="space-y-8">
            <div>
              <label className="block text-gray-800 text-lg font-medium mb-3">Ticket is creating for?</label>
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
              <label className="block text-gray-800 text-lg font-medium mb-3">Describe the issue</label>
              <textarea
                className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent h-48 resize-none text-lg"
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
              <label className="block text-gray-800 text-lg font-medium mb-3">Attach media here</label>
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
              </div>

              {/* Image Preview */}
              {previewUrl && (
                <div className="mt-4">
                  <img
                    src={previewUrl}
                    alt="Selected Preview"
                    className="w-24 h-24 object-cover rounded-lg border border-gray-300"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-gray-800 text-lg font-medium mb-3">Choose Ticket assigning department</label>
              <div className="relative">
                <select
                  className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white text-lg"
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
          <div className="space-y-8">
            <div>
              <label className="block text-gray-800 text-lg font-medium mb-3">
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
                  className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white text-lg">
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
              <label className="block text-gray-800 text-lg font-medium mb-3">Select a due date for this task</label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white text-lg"
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
              <label className="block text-gray-800 text-lg font-medium mb-3">Any additional support required?</label>
              <div className="relative">
                <select
                  className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white text-lg"
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
            {employees.length > 0 && (
              <div>
                <label className="block text-gray-800 text-lg font-medium mb-3">Select an Employee</label>
                <div className="relative">
                  <select
                    className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white text-lg"
                    {...register("ticketHandlingEmployeeId", {
                      required: "Employee selection is required",
                    })}>
                    <option value="">Select one</option>
                    {employees.map((employee) => (
                      <option key={employee._id} value={employee._id}>
                        {employee.name}
                      </option>
                    ))}
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

        <div className="mt-12 flex justify-center">
          <button
            type="submit"
            className="px-12 py-4 bg-purple-600 text-white rounded-full text-lg font-medium hover:bg-purple-700 transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
            Send Ticket
          </button>
        </div>
      </div>
    </form>
  );
};

export default TicketForm;
