import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { TicketFormData } from "@/interfaces/formInterfaces";
import { ChevronDown, Paperclip, Image } from "lucide-react";
import regexPatterns, { RegexMessages } from "@/utils/regexPattern";
import { editTicket } from "@/api/services/ticketService";
import { toast } from "react-toastify";
import { Messages } from "@/enums/Messages";
import { fetchAllDepartemts, fetchAllEmployeeWithLessTicket } from "@/api/services/companyService";
import Swal from "sweetalert2";
import { ITicketDocument } from "@/interfaces/ITicketDocument";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import getErrMssg from "../utility/getErrMssg";

export interface IDepartement {
  _id: string;
  departmentName: string;
}

export interface IEmployeeList {
  _id: string;
  name: string;
  email: string;
}

interface IEditTicket {
  isOpen: boolean;
  onClose: () => void;
  ticketData: ITicketDocument;
  refetch: () => void;
}

const EditTicket: React.FC<IEditTicket> = ({ isOpen, onClose, ticketData, refetch }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<TicketFormData>();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [departments, setDepartments] = useState<IDepartement[]>([]);
  const [employee, setEmployee] = useState<IEmployeeList | null>(null);
  const SelectedDepartmentId = watch("ticketHandlingDepartmentId");

  const onSubmitForm = async (data: TicketFormData) => {
    const selectedDepartment = departments.find((dept) => dept._id == data.ticketHandlingDepartmentId);
    const selectedEmployee = employee;

    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      formData.append(key, data[key as keyof TicketFormData]);
    });

    if (!selectedEmployee) {
      toast.error(Messages.SELECT_DEPT_AGAIN);
      return;
    }

    formData.append("ticketHandlingDepartmentName", selectedDepartment?.departmentName as string);
    formData.append("ticketHandlingEmployeeName", selectedEmployee?.name as string);
    formData.append("ticketHandlingEmployeeEmail", employee?.email as string);
    formData.append("id", ticketData._id);

    if (selectedImage) {
      formData.append("file", selectedImage);
    }

    try {
      const response = await editTicket(formData);
      if (response.success) {
        toast.success(response.message);
        setPreviewUrl(null);
        setSelectedImage(null);
        setEmployee(null);
        onClose();
        reset();
        refetch();
      }
    } catch (error) {
      toast.error(getErrMssg(error));
    }
  };

  const handleCancelButton = () => {
    reset();
    setEmployee(null);
    setPreviewUrl(null);
    setSelectedImage(null);
    onClose();
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
    if (isOpen && ticketData) {
      reset({
        ticketReason: ticketData.ticketReason || "",
        description: ticketData.description || "",
        priority: ticketData.priority || "",
        supportType: ticketData.supportType || "",
        ticketHandlingDepartmentId: ticketData.ticketHandlingDepartmentId || "",
        ticketHandlingEmployeeId: ticketData.ticketHandlingEmployeeId || "",
      });

      if (ticketData.imageUrl) setPreviewUrl(ticketData.imageUrl);
    }
  }, [isOpen, ticketData, reset]);

  useEffect(() => {
    const fetchAllDepartmentsData = async () => {
      try {
        const response = await fetchAllDepartemts();
        if (response && response.data) {
          setDepartments(response.data);
        }
      } catch (error:any) {
        if (error.response && error.response.data) {
          Swal.fire({
            title: "oops",
            text: error.response.data.message,
            icon: "error",
          }).then((result) => {
            if (result.isConfirmed) {
              handleCancelButton();
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
      setEmployee(null);
      return;
    }

    const fetchEmloyees = async () => {
      try {
        const response = await fetchAllEmployeeWithLessTicket(SelectedDepartmentId);
        if (response.success) {
          setEmployee(response.data);
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
    <div>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          className="sm:max-w-[525px] md:max-w-[1025px] md:max-h-[825px]"
          onInteractOutside={(e) => e.preventDefault()} // Prevents closing when clicking outside
        >
          <DialogHeader>
            <DialogTitle className="text-center text-2xl underline underline-offset-4">Edit Ticket</DialogTitle>
            <DialogDescription className="text-center text-black">
              Make changes to your Ticket here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmitForm)} className="max-w-5xl mx-1">
            <div className="bg-gradient-to-b from-blue-100 to-blue-200  rounded-3xl p-6 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Left Column */}
                <div className="space-y-2">
                  <div>
                    <label className="block text-gray-800 text-lg font-medium mb-1">Ticket is creating for?</label>
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
                    <label className="block text-gray-800 text-lg font-medium mb-1">Describe the issue</label>
                    <textarea
                      className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent h-44 resize-none text-lg"
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
                  {errors.description && (
                    <p className="text-sm font-semibold text-red-500">{errors.description.message}</p>
                  )}

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
                        className="cursor-pointer flex items-center gap-3 p-2 rounded-xl border border-gray-200 bg-white">
                        <Paperclip className="w-6 h-6 text-gray-500" />
                        <Image className="w-6 h-6 text-gray-500" />
                        <span className="mx-4 ">{selectedImage ? "replace image" : "upload image"}</span>
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
                </div>

                {/* Right Column */}
                <div className="space-y-2">
                  <div>
                    <label className="block text-gray-800 text-lg font-medium mb-3">
                      Choose Ticket assigning department
                    </label>
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
                      <p className="text-sm font-semibold text-red-500 p-2">
                        {errors.ticketHandlingDepartmentId.message}
                      </p>
                    )}
                  </div>
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
                    <label className="block text-gray-800 text-lg font-medium mb-3">
                      Any additional support required?
                    </label>
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

                  {/* employee fetching hidden field */}

                  <div className="hidden">
                    <label className="block text-gray-800 text-lg font-medium mb-3">Assigning Employee</label>
                    <div className="relative">
                      <select
                        className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white text-lg"
                        {...register("ticketHandlingEmployeeId")}>
                        <option value={employee?._id}>{employee?.name}</option>
                      </select>
                      <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500 pointer-events-none" />
                    </div>
                  </div>
                  {/* employee fetching hidden field */}
                </div>
                {errors.ticketHandlingEmployeeId && (
                  <p className="text-sm font-semibold text-red-500 p-2">{errors.ticketHandlingEmployeeId.message} , </p>
                )}
              </div>

              <div className="mt-12 flex justify-center gap-6">
                <button
                  type="button"
                  onClick={handleCancelButton}
                  className="px-12 py-4 bg-red-600 hover:bg-violet-600 font-semibold text-white rounded-full text-lg  transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-4 bg-black text-white rounded-full text-lg font-semibold hover:bg-blue-600 transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                  Save changes
                </button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditTicket;
